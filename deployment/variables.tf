variable "aws_region" {
  default = "us-east-1"
  type    = string
}
variable "port" {
  default = 8000
}
variable "db_host" {
  default     = "mydb.c4oiwp1bgxbr.us-east-1.rds.amazonaws.com"
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
  default = "VAr{_h8EjOF0j9b>9fs2"

}

variable "id_chiper_key" {
  default = "sZlQfFAHZxsKk2I147DS8tNIjXMbe1e9"

}

variable "id_chiper_alg" {
  default = "aes-256-cbc"

}

variable "id_chiper_iv" {
  default = "fLmgHeoqxk3uSpXq"

}

variable "token_expire" {
  default = 86400000

}

variable "server_port_map" {
  default = 8000

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