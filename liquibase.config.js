const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

module.exports = {
  changelog: path.join(__dirname, 'database/changelog/db.changelog-master.yaml'),
  url: `jdbc:postgresql://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  driver: 'org.postgresql.Driver',
  classpath: path.join(__dirname, 'database/drivers/postgresql.jar'),
  logLevel: 'info',
};
