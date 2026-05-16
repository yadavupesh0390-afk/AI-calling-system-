const logger = {
  info: (msg) => console.log(`ℹ️ ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
  warn: (msg) => console.warn(`⚠️ ${msg}`),
  debug: (msg) => console.log(`🐞 ${msg}`)
};

module.exports = logger;
