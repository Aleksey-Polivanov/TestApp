const mongoose = require('mongoose'),
      log = require('./log'),
      config = require('./config.json');

mongoose.Promise = global.Promise;
mongoose.set('debug', true);
mongoose.connect(config.mongoose.uri);

const db = mongoose.connection;

db.on('error', (err) => {
    log.error('connection error:', err.message);
});

db.once('openUri', () => {
   log.info("Connected to DB!");
});

module.exports = mongoose;