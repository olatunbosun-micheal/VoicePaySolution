// i18n.js - Internationalization configuration for AfriPay
const path = require('path');
const fs = require('fs');

// Supported languages
const locales = ['en', 'yo', 'ig', 'ha', 'cm'];
const defaultLocale = 'en';

// Load translations from JSON files
function loadMessages() {
  const messages = {};
  
  locales.forEach(locale => {
    try {
      const filePath = path.join(process.cwd(), 'messages', locale, 'common.json');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      messages[locale] = JSON.parse(fileContent);
    } catch (error) {
      console.warn(`Failed to load messages for ${locale}:`, error.message);
      messages[locale] = {};
    }
  });
  
  return messages;
}

// Get message for a specific key and locale
function getMessage(key, locale = defaultLocale) {
  const messages = loadMessages();
  return messages[locale]?.[key] || messages[defaultLocale]?.[key] || key;
}

// Format message with variables
function formatMessage(key, variables = {}, locale = defaultLocale) {
  let message = getMessage(key, locale);
  
  // Replace variables in the message
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    message = message.replace(regex, value);
  });
  
  return message;
}

module.exports = {
  locales,
  defaultLocale,
  loadMessages,
  getMessage,
  formatMessage,
};
