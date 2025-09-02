terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    # Configurar después con tu bucket S3 para el estado de Terraform
    # bucket = "feed-discapacidad-terraform-state"
    # key    = "staging/terraform.tfstate"
    # region = "eu-west-1"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "feed-discapacidad"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# DynamoDB Table para almacenar feeds
resource "aws_dynamodb_table" "feeds_table" {
  name           = "${var.project_name}-feeds-${var.environment}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"
  
  attribute {
    name = "id"
    type = "S"
  }
  
  attribute {
    name = "category"
    type = "S"
  }
  
  attribute {
    name = "language"
    type = "S"
  }
  
  global_secondary_index {
    name     = "category-index"
    hash_key = "category"
  }
  
  global_secondary_index {
    name     = "language-index"
    hash_key = "language"
  }
  
  tags = {
    Name = "${var.project_name}-feeds-${var.environment}"
  }
}

# IAM Role para Lambda Functions
resource "aws_iam_role" "lambda_execution_role" {
  name = "${var.project_name}-lambda-role-${var.environment}"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# IAM Policy para Lambda
resource "aws_iam_role_policy" "lambda_dynamodb_policy" {
  name = "${var.project_name}-lambda-dynamodb-policy-${var.environment}"
  role = aws_iam_role.lambda_execution_role.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem"
        ]
        Resource = [
          aws_dynamodb_table.feeds_table.arn,
          "${aws_dynamodb_table.feeds_table.arn}/index/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# Lambda Functions
resource "aws_lambda_function" "health_function" {
  filename         = "health_function.zip"
  function_name    = "${var.project_name}-health-${var.environment}"
  role            = aws_iam_role.lambda_execution_role.arn
  handler         = "src.handlers.health.lambda_handler"
  runtime         = "python3.9"
  timeout         = 30
  
  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.feeds_table.name
      ENVIRONMENT    = var.environment
    }
  }
}

resource "aws_lambda_function" "feeds_function" {
  filename         = "feeds_function.zip"
  function_name    = "${var.project_name}-feeds-${var.environment}"
  role            = aws_iam_role.lambda_execution_role.arn
  handler         = "src.handlers.feeds.lambda_handler"
  runtime         = "python3.9"
  timeout         = 30
  
  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.feeds_table.name
      ENVIRONMENT    = var.environment
    }
  }
}

# API Gateway
resource "aws_api_gateway_rest_api" "feed_api" {
  name        = "${var.project_name}-api-${var.environment}"
  description = "Feed Discapacidad API"
  
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

# API Gateway Deployment
resource "aws_api_gateway_deployment" "api_deployment" {
  depends_on = [
    aws_api_gateway_integration.health_integration,
    aws_api_gateway_integration.feeds_integration
  ]
  
  rest_api_id = aws_api_gateway_rest_api.feed_api.id
  stage_name  = var.environment
}

# Health endpoint
resource "aws_api_gateway_resource" "health_resource" {
  rest_api_id = aws_api_gateway_rest_api.feed_api.id
  parent_id   = aws_api_gateway_rest_api.feed_api.root_resource_id
  path_part   = "health"
}

resource "aws_api_gateway_method" "health_method" {
  rest_api_id   = aws_api_gateway_rest_api.feed_api.id
  resource_id   = aws_api_gateway_resource.health_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "health_integration" {
  rest_api_id = aws_api_gateway_rest_api.feed_api.id
  resource_id = aws_api_gateway_resource.health_resource.id
  http_method = aws_api_gateway_method.health_method.http_method
  
  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.health_function.invoke_arn
}

# Feeds endpoint
resource "aws_api_gateway_resource" "feeds_resource" {
  rest_api_id = aws_api_gateway_rest_api.feed_api.id
  parent_id   = aws_api_gateway_rest_api.feed_api.root_resource_id
  path_part   = "feeds"
}

resource "aws_api_gateway_method" "feeds_get_method" {
  rest_api_id   = aws_api_gateway_rest_api.feed_api.id
  resource_id   = aws_api_gateway_resource.feeds_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "feeds_post_method" {
  rest_api_id   = aws_api_gateway_rest_api.feed_api.id
  resource_id   = aws_api_gateway_resource.feeds_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "feeds_integration" {
  rest_api_id = aws_api_gateway_rest_api.feed_api.id
  resource_id = aws_api_gateway_resource.feeds_resource.id
  http_method = aws_api_gateway_method.feeds_get_method.http_method
  
  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.feeds_function.invoke_arn
}

# Lambda permissions para API Gateway
resource "aws_lambda_permission" "health_api_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.health_function.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.feed_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "feeds_api_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.feeds_function.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.feed_api.execution_arn}/*/*"
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "health_function_logs" {
  name              = "/aws/lambda/${aws_lambda_function.health_function.function_name}"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "feeds_function_logs" {
  name              = "/aws/lambda/${aws_lambda_function.feeds_function.function_name}"
  retention_in_days = 14
}
