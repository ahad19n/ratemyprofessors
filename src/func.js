const mongoose = require("mongoose");
const ActionLog = require('./models/ActionLog');

module.exports = {

  joinName: (...parts) => {
    return parts.filter(Boolean).join(" ");
  },

  genSlug: (name) => {
    return name.toString().trim().toLowerCase().replace(/\s+/g, '-');
  },

  gracefulShutdown(app, server) {
    console.log('[INFO] Gracefully shutting down server');
    server.close(() => process.exit(0));
  },

  initMongoose(uri) {
    mongoose.connect(uri)
    .then(() => console.log('[INFO] Successfully connected to MongoDB'))
    .catch(error => {
      console.error('[ERROR] Failed to connect to MongoDB:', error);
      process.exit(1);
    })
  },

  randomString: (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++)
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
  },

  ensureAcid: (req, res, next) => {
    const acid = req.cookies?.acid;
    if (!acid) {
      const newAcid = module.exports.randomString(32);
      res.cookie('acid', newAcid);
      req.cookies.acid = newAcid;
    }
    next();
  },

  logAction: (req, res, next) => {
    if (req.method !== 'POST') return next();

    new ActionLog({
      ts: Date.now(),
      route: req.originalUrl,
      acid: req.cookies.acid,
      ipAddr: req.get('cf-connecting-ip'),
      userAgent: req.get('user-agent'),
      postBody: JSON.stringify(req.body),
    }).save().catch((err) => {
      console.error(`[ERROR] Failed to log action: ${err}`);
    });

    next();
  }

};