set -e

echo "Setting up cron job..."
sudo chmod +x ~/ingest-cards.sh

# Every day at 1 AM Central Standard Time
(sudo echo "0 6 */1 * * sudo /home/ubuntu/ingest-cards.sh") | crontab -
