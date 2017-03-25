variable "aws_region" {
  description = "The AWS region to deploy in"
}

variable "slackbot_instance_type" {
  description = "Type of EC2 instance"
  default = "t2.micro"
}

variable "ami" {
  description = "AMI ID of EC2 instance"
}

variable "environment" {
  description = "Environment of deployment"
}