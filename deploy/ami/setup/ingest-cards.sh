#!/usr/bin/env bash

set -e
LOG_FILE="ingest-$(date +'%m-%d-%Y').log"
sudo touch /var/log/slackbot/${LOG_FILE}

sudo echo "Pulling in data changes from mtgjson." >> /var/log/slackbot/${LOG_FILE} 2>&1
cd /opt/mtgjson
sudo git pull origin master >> /var/log/slackbot/${LOG_FILE} 2>&1

sudo echo "Copying cards." >> /var/log/slackbot/${LOG_FILE} 2>&1
sudo mkdir -p /opt/slackbot/data
sudo PATH_TO_JSON=/opt/mtgjson/json PATH_TO_DESTINATION=/opt/slackbot/data node /opt/slackbot/tasks/move-cards.js >> /var/log/slackbot/${LOG_FILE} 2>&1

sudo echo "Ingesting cards." >> /var/log/slackbot/${LOG_FILE} 2>&1
sudo PATH_TO_JSON=/opt/slackbot/data node /opt/slackbot/tasks/ingest-cards.js >> /var/log/slackbot/${LOG_FILE} 2>&1

sudo echo "Cleaning up data." >> /var/log/slackbot/${LOG_FILE} 2>&1
sudo rm -rf /opt/slackbot/data

sudo echo "Killing all node processes." >> /var/log/slackbot/${LOG_FILE} 2>&1
killall node >> /var/log/slackbot/${LOG_FILE} 2>&1 &
sudo sleep 2

sudo echo "Running ~/run-slackbot.sh." >> /var/log/slackbot/${LOG_FILE} 2>&1
sudo ~/run-slackbot.sh
