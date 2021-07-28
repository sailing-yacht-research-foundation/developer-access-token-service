output "ecr_repo_url" {
  value = aws_ecr_repository.dev_token_repo.repository_url
}

output "alb_dns_name" {
  value = aws_alb.application_load_balancer.dns_name
}

output "rds_hostname" {
  description = "RDS instance hostname"
  value       = aws_db_instance.syrf.address
  sensitive   = true
}

output "rds_port" {
  description = "RDS instance port"
  value       = aws_db_instance.syrf.port
  sensitive   = true
}

output "rds_username" {
  description = "RDS instance root username"
  value       = aws_db_instance.syrf.username
  sensitive   = true
}
