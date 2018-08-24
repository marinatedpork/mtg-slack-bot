resource "aws_instance" "slackbot" {
  instance_type          = "${var.slackbot_instance_type}"
  ami                    = "${data.aws_ami.slackbot.image_id}"
  key_name               = "${aws_key_pair.slackbot.id}"
  count = 1
  vpc_security_group_ids = [
    "${aws_security_group.slackbot.id}"
  ]

  tags {
    Environment = "${var.environment}"
    Name        = "slackbot-${var.environment}"
  }
}

resource "aws_key_pair" "slackbot" {
  key_name   = "${var.key_name}"
  public_key = "${file(var.public_key_path)}"
}

resource "aws_security_group" "slackbot" {
  name          = "${var.environment}-slackbot"
  description   = "Controls instance traffic. Add public IPs to the list of ingress/inbound IPs to allow yourself to SSH in."

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = "${var.white_listed_ips}"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "null_resource" "slackbot" {
  triggers {
    slackbot_id = "${aws_instance.slackbot.id}"
  }

  provisioner "local-exec" {
    command = "ssh -v -i ./${var.private_key_path} -o 'StrictHostKeyChecking no' ubuntu@${aws_instance.slackbot.public_dns} 'sudo sleep 10 && chmod +x ~/run-slackbot.sh && ~/run-slackbot.sh'"
  }
}

output "slackbot_private_ip" {
  value = "${aws_instance.slackbot.private_ip}"
}

output "slackbot_public_dns" {
  value = "${aws_instance.slackbot.public_dns}"
}
