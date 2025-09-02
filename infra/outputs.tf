output "api_gateway_url" {
  description = "API Gateway endpoint URL"
  value       = "${aws_api_gateway_deployment.api_deployment.invoke_url}"
}

output "dynamodb_table_name" {
  description = "DynamoDB table name"
  value       = aws_dynamodb_table.feeds_table.name
}

output "lambda_health_function_name" {
  description = "Health Lambda function name"
  value       = aws_lambda_function.health_function.function_name
}

output "lambda_feeds_function_name" {
  description = "Feeds Lambda function name"
  value       = aws_lambda_function.feeds_function.function_name
}

output "cloudwatch_dashboard_url" {
  description = "CloudWatch Dashboard URL"
  value       = "https://console.aws.amazon.com/cloudwatch/home?region=${var.aws_region}#dashboards:name=${aws_cloudwatch_dashboard.feed_api_dashboard.dashboard_name}"
}

output "sns_alerts_topic_arn" {
  description = "SNS Topic ARN for alerts"
  value       = aws_sns_topic.alerts.arn
}
