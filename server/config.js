require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  CHAT_PASSWORD: process.env.CHAT_PASSWORD || 'chat_password',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
