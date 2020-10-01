#!/bin/bash


server_block="# A 'Default' HTTP server that will redirect HTTP requests to HTTPS
server {
    listen 80;
    server_name default_http_server;
    return 301 https://\$host\$request_uri;
}

# The HTTPS server
server {
  listen              443 http2 ssl;
  server_name         default_server;
  ssl_certificate     /etc/letsencrypt/live/$1/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/$1/privkey.pem;
  ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
  ssl_ciphers         HIGH:!aNULL:!MD5;
  client_max_body_size 20m;

  ##
  # Gzip Settings
  ##
  gzip on;
  gzip_comp_level       5;
  gzip_min_length       256;
  gzip_proxied          any;
  gzip_vary             on;
  gzip_types application/javascript text/css text/plain application/json application/manifest+json application/xml image/svg+xml;
  

  location / {
      root  /var/www/html;
      try_files \$uri \$uri/ /index.html;
    }

"
rest_of_location_block="
  # Send all requests to be handled by NodeJS to port 4000
  location ~ ^(/add| /stories) {
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header Host \$http_host;
    proxy_set_header X-NginX-Proxy true;
    proxy_set_header Cache-Control 'no-store';

    rewrite ^/?(.*) /\$1 break;

    proxy_pass https://localhost:4000;
    proxy_redirect off;
  }
}
"

if [ "$PUSH_API" = "1" ]
then
  nginx_block="$server_block $external_api_location_block $rest_of_location_block"
else
  nginx_block="$server_block $rest_of_location_block"
fi

cat > /etc/nginx/sites-available/default <<- EOM
  $nginx_block
EOM
