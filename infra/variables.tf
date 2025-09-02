variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "staging"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "feed-discapacidad"
}

variable "alert_email" {
  description = "Email address for alerts"
  type        = string
  default     = "admin@ejemplo.com"
}
