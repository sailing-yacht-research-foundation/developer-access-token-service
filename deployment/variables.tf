variable "aws_region" {
  default = "us-east-2"
  type    = string
}
variable "db_password" {
  description = "RDS root user password"
  sensitive   = true
}
