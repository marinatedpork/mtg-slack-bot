data  "aws_ami" "slackbot" {
  most_recent = true

  filter {
    name = "name"
    values = ["mtg-slack-bot-${var.environment}-*"]
  }
}
