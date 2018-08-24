variable "aws_region" {
  description = "The AWS region to deploy in"
}

variable "slackbot_instance_type" {
  description = "Type of EC2 instance"
  default = "t2.micro"
}

variable "environment" {
  description = "Environment of deployment"
}

variable "public_key_path" {
  description = "Path to public key"
}

variable "private_key_path" {
  description = "Path to private key"
}

variable "key_name" {
  description = "Name of SSH key"
}

variable "white_listed_ips" {
  type = "list"
  description = "The public IP that can log into the instances"
}
