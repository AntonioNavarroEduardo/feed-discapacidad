# Configuración para entorno de producción
aws_region   = "eu-west-1"
environment  = "prod"
project_name = "feed-discapacidad"
alert_email  = "ops@feed-discapacidad.com"

# Configuraciones específicas de producción
lambda_memory_size = 512
lambda_timeout     = 60
dynamodb_billing_mode = "PROVISIONED"
dynamodb_read_capacity = 5
dynamodb_write_capacity = 5
