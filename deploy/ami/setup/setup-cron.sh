set -e

echo "Setting up cron job..."
sudo chmod +x ~/ingest-cards.sh

# Every day at 7 PM Central Standard Time
(sudo echo "0 0 */1 * * sudo /home/ubuntu/ingest-cards.sh") | crontab -
