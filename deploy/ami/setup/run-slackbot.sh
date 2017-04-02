#!/usr/bin/env bash

# Runs the Slack Bot and pip

echo "Running the Slack Bot"

sudo mkdir /var/log/slackbot
sudo nohup sh -c 'node /opt/slackbot/index.js > /var/log/slackbot/bot.log 2>&1 &'
