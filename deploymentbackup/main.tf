terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }

# backend "s3" {
#   bucket = "syrf-dev-token-terraform-state"
#   key    = "global/s3/terraform.tfstate"
#   region = "us-east-1"
# 
#   dynamodb_table = "dev-token-terraform-state-locking"
#   encrypt = true
# }

}


resource "aws_ecr_repository" "dev_token_repo" {
  name = "dev-token-repo"
}

resource "aws_ecs_cluster" "dev_token_cluster" {
  name = "dev-token-cluster" # Naming the cluster
}

resource "aws_cloudwatch_log_group" "dev_token_logs" {
  name = "dev-token-logs"
}

resource "aws_ecs_task_definition" "dev_token_task" {
  family                   = "dev-token-task" # Naming our first task
  container_definitions    = <<DEFINITION
  [
    {
      "name": "dev-token-task",
      "image": "${aws_ecr_repository.dev_token_repo.repository_url}",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 5000,
          "hostPort": 5000
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "${aws_cloudwatch_log_group.dev_token_logs.name}",
          "awslogs-region": "${var.aws_region}",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "memory": 512,
      "cpu": 256
    }
  ]
  DEFINITION
  requires_compatibilities = ["FARGATE"] # Stating that we are using ECS Fargate
  network_mode             = "awsvpc"    # Using awsvpc as our network mode as this is required for Fargate
  memory                   = 512         # Specifying the memory our container requires
  cpu                      = 256         # Specifying the CPU our container requires
  execution_role_arn       = aws_iam_role.ecsTaskExecutionRole.arn
}

resource "aws_iam_role" "ecsTaskExecutionRole" {
  name               = "devTokenEcsTaskExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "ecsTaskExecutionRole_policy" {
  role       = aws_iam_role.ecsTaskExecutionRole.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_alb" "application_load_balancer" {
  name               = "dev-token-lb" # Naming our load balancer
  load_balancer_type = "application"
  subnets = ["subnet-0f26c9cfb54dc1283", "subnet-064b3ecd2cd9870d3", "subnet-0a5e0f272ad1948ac"]
  # Referencing the security group
  security_groups = [aws_security_group.load_balancer_security_group.id]
}

# Creating a security group for the load balancer:
resource "aws_security_group" "load_balancer_security_group" {

  vpc_id = "vpc-06fc2c81865587bc6"
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allowing traffic in from all sources
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb_target_group" "dev_token_target_group" {


  name        = "dev-token-target-group"
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = "vpc-06fc2c81865587bc6" # Referencing the default VPC
  depends_on  = ["aws_alb.application_load_balancer"]
}

resource "aws_lb_listener" "listener" {
  load_balancer_arn = aws_alb.application_load_balancer.arn # Referencing our load balancer
  port              = "80"
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.dev_token_target_group.arn # Referencing our tagrte group
  }
}

resource "aws_ecs_service" "dev_token_service" {
  name            = "dev-token-service"                        # Naming our first service
  cluster         = aws_ecs_cluster.dev_token_cluster.id       # Referencing our created Cluster
  task_definition = aws_ecs_task_definition.dev_token_task.arn # Referencing the task our service will spin up
  launch_type     = "FARGATE"
  desired_count   = 1 # Setting the number of containers to 3

  load_balancer {
    target_group_arn = aws_lb_target_group.dev_token_target_group.arn # Referencing our target group
    container_name   = aws_ecs_task_definition.dev_token_task.family
    container_port   = 5000 # Specifying the container port
  }

  network_configuration {
    subnets          = ["subnet-0f26c9cfb54dc1283", "subnet-064b3ecd2cd9870d3", "subnet-0a5e0f272ad1948ac"]
    assign_public_ip = true                                                # Providing our containers with public IPs
    security_groups  = [aws_security_group.service_security_group.id] # Setting the security group
  }
}


resource "aws_security_group" "service_security_group" {
  vpc_id = "vpc-06fc2c81865587bc6" # Referencing our syrf VPC
  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    # Only allowing traffic in from the load balancer security group
    security_groups = [aws_security_group.load_balancer_security_group.id]
  }

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
