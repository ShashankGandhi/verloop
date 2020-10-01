
// Define the config variables that will be used in the application. Some are hardcoded, some come from env variables.

var config = {};

// Node express settings
config.bodyParserLimit = '10mb';

// Database settings
config.DB_HOST = process.env.DB_HOST;
config.DB_SCHEMA = process.env.DB_SCHEMA;
config.DB_USERNAME = process.env.DB_USERNAME;
config.DB_PASSWORD = process.env.DB_PASSWORD;

config.DB_PORT = process.env.DB_PORT ? process.env.DB_PORT : 3306;
config.SERVER_HOST = process.env.SERVER_HOST;
config.SERVER_PROTOCOL = process.env.SERVER_PROTOCOL;
config.SERVER_PORT = process.env.SERVER_PORT;
module.exports = config;
