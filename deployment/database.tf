data "aws_availability_zones" "available" {}

resource "aws_db_subnet_group" "syrf" {
  name = "syrf"
  subnet_ids = [
    "${aws_default_subnet.default_subnet_a.id}",
    "${aws_default_subnet.default_subnet_b.id}",
    "${aws_default_subnet.default_subnet_c.id}"
  ]

  tags = {
    Name = "SYRF"
  }
}

resource "aws_security_group" "rds" {
  name   = "syrf_rds"
  vpc_id = aws_default_vpc.default_vpc.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "syrf_rds"
  }
}

resource "aws_db_parameter_group" "syrf" {
  name   = "syrf"
  family = "postgres13"

  parameter {
    name  = "log_connections"
    value = "1"
  }
}

resource "aws_db_instance" "syrf" {
  identifier             = "syrf"
  instance_class         = "db.t3.micro"
  allocated_storage      = 5
  engine                 = "postgres"
  engine_version         = "13.1"
  username               = "livedata"
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.syrf.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  parameter_group_name   = aws_db_parameter_group.syrf.name
  publicly_accessible    = true
  skip_final_snapshot    = true
}
