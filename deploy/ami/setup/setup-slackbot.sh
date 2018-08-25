#!/usr/bin/env bash


# Installs and sets up the Slack Bot

set -e

cd /opt
sudo git clone https://github.com/mtgjson/mtgjson.git

echo "Untaring slackbot.tar.gz to /opt/slackbot"
sudo mv ~/slackbot.tar.gz /opt/slackbot.tar.gz
sudo mkdir /opt/slackbot
sudo tar -zxvf /opt/slackbot.tar.gz -C /opt/slackbot
sudo rm /opt/slackbot.tar.gz

echo "Installing Node packages..."
cd /opt/slackbot && sudo npm install

echo "Seeding database..."
sudo rm -rf /opt/slackbot/data
sudo mkdir /opt/slackbot/data
sudo PATH_TO_JSON=/opt/mtgjson/json PATH_TO_DESTINATION=/opt/slackbot/data node ./tasks/move-cards.js
sudo PATH_TO_JSON=/opt/slackbot/data node /opt/slackbot/tasks/ingest-cards.js
sudo rm -rf /opt/slackbot/data

# Create log file
echo "Creating log directory..."
sudo mkdir -p /var/log/slackbot
