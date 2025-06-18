FROM php:8.1-fpm

ARG USER_ID
ARG GROUP_ID

# Install system dependencies for PHP extensions, Nginx, and Supervisor
RUN apt-get update \
 && apt-get install -y git zip unzip libicu-dev libonig-dev libxml2-dev nginx supervisor \
 && docker-php-ext-install pdo_mysql intl opcache \
 && rm -rf /var/lib/apt/lists/*

RUN sed -i 's#;log_level = notice#log_level = notice#g' /usr/local/etc/php-fpm.conf

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY ./docker/nginx/default.conf /etc/nginx/sites-available/default
RUN rm -f /etc/nginx/sites-enabled/default && \
    ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

RUN echo "[supervisord]\nnodaemon=true\nuser=root\n\n[program:php-fpm]\ncommand=/usr/local/sbin/php-fpm -F\nautostart=true\nautorestart=true\npriority=5\n\n[program:nginx]\ncommand=/usr/sbin/nginx -g 'daemon off;'\nautostart=true\nautorestart=true\npriority=10\n" > /etc/supervisor/conf.d/app.conf

WORKDIR /var/www/html

# Copy all application files from the build context (your ./api directory)
# This includes composer.json, composer.lock, bin/console, src/, config/, etc.
COPY . .

ENV COMPOSER_ALLOW_SUPERUSER=1

# Install dependencies (now that all files, including bin/console, are present)
# --no-dev should be used for production builds
RUN composer install --no-dev --no-interaction --optimize-autoloader --no-progress --prefer-dist


# Set ownership and permissions
# Create necessary log directories for Nginx and ensure www-data can write to them and Symfony's var/cache and var/log
RUN mkdir -p /var/log/nginx /var/www/html/var/cache /var/www/html/var/log \
 && chown -R www-data:www-data /var/www/html /var/log/nginx \
 && chmod -R 775 /var/www/html/var/cache /var/www/html/var/log

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/app.conf"]