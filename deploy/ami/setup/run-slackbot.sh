#!/usr/bin/env bash

# Runs the Slack Bot and pipes data to a log

set -e

echo "Running the Slack Bot..."

sudo mkdir /var/log/slackbot
sudo touch /var/log/slackbot/bot.log
sudo sh -c 'nohup node /opt/slackbot/index.js > /var/log/slackbot/bot.log 2>&1 &'

echo "Bot started..."

sleep 13
