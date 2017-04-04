#!/usr/bin/env bash

# Installs Node JS 7.x on Ubuntu

set -e

echo "Installing Node JS 7.x from deb.nodesource.com..."

curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
