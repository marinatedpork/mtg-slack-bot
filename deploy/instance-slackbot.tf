resource "aws_instance" "slackbot" {
  instance_type          = "${var.slackbot_instance_type}"
  ami                    = "${data.aws_ami.slackbot.image_id}"
  key_name               = "${aws_key_pair.slackbot.id}"
  count = 1

  vpc_security_group_ids = [
    "${aws_security_group.slackbot.id}"
  ]

  connection {
    user = "ubuntu"
    host = "${self.public_dns}"
    private_key = "${file(var.private_key_path)}"
    agent = true
  }

  tags {
    Environment = "${var.environment}"
    Name        = "slackbot-${var.environment}"
  }

  provisioner "file" {
    source = "ami/setup/setup-cron.sh"
    destination = "~/setup-cron.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x ~/setup-cron.sh && ~/setup-cron.sh"
    ]
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

output "slackbot_private_ip" {
  value = "${aws_instance.slackbot.private_ip}"
}

output "slackbot_public_dns" {
  value = "${aws_instance.slackbot.public_dns}"
}
