#!/usr/bin/env bash

# Installs and sets up MongoDB on Ubuntu

set -e

sudo mv ~/mongod.service /lib/systemd/system/mongod.service
sudo mkdir /var/run/mongodb
sudo mkdir /var/log/mongodb
sudo mkdir /var/lib/mongo

echo "Getting keys ubuntu.com..."
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927

echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org

sleep 3

echo "Running daemon-reload..."
sudo systemctl daemon-reload
echo "Starting mongo..."
sudo systemctl start mongod
echo "Enabling mongo..."
sudo systemctl enable mongod

echo "Do you see mongod in the below netstat? If not, then something went wrong..."
echo $(netstat -plntu)
