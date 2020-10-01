#!/bin/sh

# Create moneytor user
mysql -u root -p$MYSQL_ROOT_PASSWORD -e "CREATE USER '${DB_USERNAME}'@'%' IDENTIFIED BY '${DB_PASSWORD}';"

# Create schema
mysql -u root -p$MYSQL_ROOT_PASSWORD -e "CREATE DATABASE ${DB_SCHEMA}";

# Grant all privileges on schema to moneytor user
mysql -u root -p$MYSQL_ROOT_PASSWORD -e "GRANT ALL PRIVILEGES ON ${DB_SCHEMA} . * TO '${DB_USERNAME}'@'%'; FLUSH PRIVILEGES;"
