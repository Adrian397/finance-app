# PHP + extensions
FROM php:8.1-fpm

RUN apt-get update \
 && apt-get install -y git zip unzip libicu-dev libonig-dev libxml2-dev \
 && docker-php-ext-install pdo_mysql intl opcache \
 && rm -rf /var/lib/apt/lists/*

# Bring in Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# 1) Copy composer manifests (for caching)
COPY composer.json composer.lock ./

# 2) Copy *all* your Symfony code (including bin/console)
COPY . .

# 3) Now install dependencies (auto-scripts can run)
RUN composer install --no-interaction --optimize-autoloader \
 && chown -R www-data:www-data var

EXPOSE 8000

CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]