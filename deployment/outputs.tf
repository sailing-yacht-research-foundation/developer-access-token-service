output "ecr_repo_url" {
  value = aws_ecr_repository.dev_token_repo.repository_url
}

output "alb_dns_name" {
  value = aws_alb.application_load_balancer.dns_name
}
