# Bucket S3 para almacenar logs de acceso (opcional)
resource "aws_s3_bucket" "access_logs" {
  bucket = "${var.project_name}-access-logs-${var.environment}-${random_string.bucket_suffix.result}"
}

resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

resource "aws_s3_bucket_versioning" "access_logs_versioning" {
  bucket = aws_s3_bucket.access_logs.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_encryption" "access_logs_encryption" {
  bucket = aws_s3_bucket.access_logs.id

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_s3_bucket_public_access_block" "access_logs_pab" {
  bucket = aws_s3_bucket.access_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# WAF para API Gateway
resource "aws_wafv2_web_acl" "feed_api_waf" {
  name  = "${var.project_name}-waf-${var.environment}"
  scope = "REGIONAL"

  default_action {
    allow {}
  }

  rule {
    name     = "RateLimitRule"
    priority = 1

    override_action {
      none {}
    }

    statement {
      rate_based_statement {
        limit              = 2000
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitRule"
      sampled_requests_enabled   = true
    }

    action {
      block {}
    }
  }

  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CommonRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "AWSManagedRulesKnownBadInputsRuleSet"
    priority = 3

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "KnownBadInputsRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${var.project_name}WAF${var.environment}"
    sampled_requests_enabled   = true
  }
}

# Asociar WAF con API Gateway
resource "aws_wafv2_web_acl_association" "feed_api_waf_association" {
  resource_arn = aws_api_gateway_deployment.api_deployment.execution_arn
  web_acl_arn  = aws_wafv2_web_acl.feed_api_waf.arn
}

# IAM Policy más restrictiva para Lambda
resource "aws_iam_policy" "lambda_security_policy" {
  name        = "${var.project_name}-lambda-security-policy-${var.environment}"
  description = "Política de seguridad restrictiva para Lambda"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:Query",
          "dynamodb:UpdateItem"
        ]
        Resource = [
          aws_dynamodb_table.feeds_table.arn,
          "${aws_dynamodb_table.feeds_table.arn}/index/*"
        ]
        Condition = {
          StringEquals = {
            "dynamodb:LeadingKeys" = ["$${aws:userid}"]
          }
        }
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = [
          "arn:aws:logs:${var.aws_region}:*:log-group:/aws/lambda/${var.project_name}-*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "xray:PutTraceSegments",
          "xray:PutTelemetryRecords"
        ]
        Resource = "*"
      }
    ]
  })
}

# Habilitar X-Ray tracing
resource "aws_lambda_function" "health_function_secure" {
  filename         = "health_function.zip"
  function_name    = "${var.project_name}-health-${var.environment}"
  role            = aws_iam_role.lambda_execution_role.arn
  handler         = "src.handlers.health.lambda_handler"
  runtime         = "python3.9"
  timeout         = 30
  memory_size     = 256  # Optimizado para costes

  layers = [
    "arn:aws:lambda:${var.aws_region}:580247275435:layer:LambdaInsightsExtension:21"
  ]

  tracing_config {
    mode = "Active"
  }

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.feeds_table.name
      ENVIRONMENT    = var.environment
      _X_AMZN_TRACE_ID = ""
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic,
    aws_cloudwatch_log_group.health_function_logs
  ]
}

# Attachment de políticas IAM
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_execution_role.name
}

resource "aws_iam_role_policy_attachment" "lambda_insights" {
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy"
  role       = aws_iam_role.lambda_execution_role.name
}

resource "aws_iam_role_policy_attachment" "lambda_xray" {
  policy_arn = "arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess"
  role       = aws_iam_role.lambda_execution_role.name
}

# Configuración de DynamoDB con autoscaling
resource "aws_appautoscaling_target" "dynamodb_read_target" {
  max_capacity       = 100
  min_capacity       = 1
  resource_id        = "table/${aws_dynamodb_table.feeds_table.name}"
  scalable_dimension = "dynamodb:table:ReadCapacityUnits"
  service_namespace  = "dynamodb"
}

resource "aws_appautoscaling_policy" "dynamodb_read_policy" {
  name               = "DynamoDBReadCapacityUtilization:${aws_appautoscaling_target.dynamodb_read_target.resource_id}"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.dynamodb_read_target.resource_id
  scalable_dimension = aws_appautoscaling_target.dynamodb_read_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.dynamodb_read_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBReadCapacityUtilization"
    }
    target_value = 70.0
  }
}

# Lambda Reserved Concurrency para control de costes
resource "aws_lambda_provisioned_concurrency_config" "feeds_function_concurrency" {
  function_name                     = aws_lambda_function.feeds_function.function_name
  provisioned_concurrent_executions = 2
  qualifier                        = aws_lambda_function.feeds_function.version
}
