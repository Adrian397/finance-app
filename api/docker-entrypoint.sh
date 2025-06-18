#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Run setup tasks
echo "Running cache:clear..."
php bin/console cache:clear

echo "Running database migrations..."
php bin/console doctrine:migrations:migrate --no-interaction

# Start the main process (supervisord).
# The 'exec' command is important, it replaces the shell process with supervisord.
echo "Starting supervisord..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/app.conf