#!/usr/bin/env bash

# Runs the Slack Bot and pipes data to a log

set -e
echo "Cleaning up logs."
sudo rm -rf /var/log/slackbot
sudo mkdir -p /var/log/slackbot

echo "Creating new logs."
LOG_FILE="bot-$(date +'%m-%d-%Y').log"
sudo touch /var/log/slackbot/${LOG_FILE}

echo "Running the Slack Bot."
sudo nohup node /opt/slackbot/index.js >> /var/log/slackbot/${LOG_FILE} 2>&1 &
echo "Bot started."
