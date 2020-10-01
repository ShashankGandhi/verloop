#!/bin/bash

# This script sets up nginx on the server. This is only intended to be used once, but no harm if you use it multiple times

# Remove existing server block folder (if any)
rm -rf /var/www/default
rm -rf /etc/nginx/sites-enabled/default
# Get the directory where this script is being run from
SCRIPTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Create the root folder for the server block. The HTML files will be copied by the docker-compose startup commands.
mkdir -p /var/www/$SERVER_HOST/html

# When we have multi-tenant deployment (multiple subdomains on the same server), we need to add the default
# Docker DNS resolver to nginx for it to work.
sed  -i -e '/resolver/d' /etc/nginx/nginx.conf
sed /etc/nginx/nginx.conf -i -e 's/include \/etc\/nginx\/mime.types;/resolver 127.0.0.11;\ninclude \/etc\/nginx\/mime.types;/g'
sed '/gzip/d' /etc/nginx/nginx.conf

if [ "$SERVER_PROTOCOL" = "http" ]
then
  # Create a server block file for http
  echo "Creating HTTP block"
  $SCRIPTDIR/setupNginxBlockHttp.sh
elif [ "$SERVER_PROTOCOL" = "https" ]
then
  # Create a server block file for https
  echo "Creating HTTPS block"
  $SCRIPTDIR/setupNginxBlockHttps.sh $SERVER_HOST   # $SERVER_HOST required for SSL certificate path (for now)
fi

# Create a symlink to enable this site
ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/