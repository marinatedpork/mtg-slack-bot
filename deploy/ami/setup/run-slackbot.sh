#!/usr/bin/env bash

# Runs the Slack Bot and pipes data to a log

set -e

echo "Running the Slack Bot..."

LOG_DIR=/var/log/slackbot/bot.log

sudo touch /var/log/slackbot/bot.log
sudo mkdir /var/log/slackbot
sudo sh -c 'forever start -a -l $LOG_DIR -o $LOG_DIR -e $LOG_DIR /opt/slackbot/index.js > $LOG_DIR 2>&1 &'

# Do I need pseduo here inside the -c string?

# sudo sh -c 'nohup node /opt/slackbot/index.js > /var/log/slackbot/bot.log 2>&1 &'

echo "Bot started..."

sleep 13
