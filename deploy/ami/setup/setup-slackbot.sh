#!/usr/bin/env bash

# Installs and sets up the Slack Bot

set -e

echo "Untaring slackbot.tar.gz to /opt/slackbot"
sudo mkdir /opt/slackbot
tar -zxvf /opt/slackbot.tar.gz -C /opt/slackbot
rm /opt/slackbot.tar.gz

echo "Installing Node packages..."
cd /opt/slackbot && npm install

echo "Seeding database..."
PATH_TO_JSON=./data node ./tasks/ingest-cards.js
rm -rf data
