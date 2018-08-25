# "0 9 * * 3"
# Wednesday, 4:00 AM Friday, Central Time (CT) -- cron uses UTC
set -e

echo "Setting up cron job..."
sudo chmod +x ~/ingest-cards.sh
(sudo echo "*/5 * * * * /home/ubuntu/ingest-cards.sh") | crontab -
