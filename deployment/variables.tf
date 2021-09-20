variable "aws_region" {
  default = "us-east-1"
  type    = string
}
variable "port" {
  default = 5000
}
variable "db_host" {
  default     = "syrf-backend-development.csvvxrzxjbev.us-east-1.rds.amazonaws.com"
  description = "connecting to remote db"
}

variable "db_port" {
  type = string

}

variable "db_user" {
  type = string

}

variable "db_password" {
  type = string

}

variable "db_name" {
  type = string

}

variable "jwt_secret" {
  default = ""

}

variable "id_chiper_key" {
  default = ""

}

variable "id_chiper_alg" {
  default = "aes-256-cbc"

}

variable "id_chiper_iv" {
  default = ""

}

variable "token_expire" {
  default = 86400000

}

variable "server_port_map" {
  default = 5000

}

variable "db_port_map" {
  default = 5433

}

variable "client_port_map" {
  default = 3000

}

variable "storage_auth_key" {
  default = "bTbq9oSjgG"

}

variable "node_env" {
  default = "development"

}

variable "client_port" {
  default = 3000

}