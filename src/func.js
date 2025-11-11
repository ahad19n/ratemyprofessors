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
  },

  adminAuth: (req, res, next) => {
    const token = req.get("authorization");

    if (token && token.length == 32 && token === process.env.ADMIN_TOKEN) {
      return next();
    }

    const links = [
      "z9Uz1icjwrM", "Sagg08DrO5U", "hGlyFc79BUE", "UcRtFYAz2Yo", "gfkts0u-m6w",
      "6H2FRxvsd2M", "vP9k6qvLsNM", "toAdCKXu75E", "-qqRUrkNl14", "92krquAh9aY",
      "TRc85qoNo6w", "16G-Hv23nqw", "VZTnBXAwuUA", "jQRb4DZnhn8", "s65IoT8uBlg",
      "kUYuBaPtaPk", "CRkzItBabzs", "yhjA1iX2gWw", "a6GGZ68mOZA", "o1eHKf-dMwo",
      "rl0Dbav08UI", "WcCeyLf2IeE", "iC1PLC6ljJc", "-50NdPawLVY", "9ILQNSgE7mw",
      "V7HdWeYbV3Q", "NATSpYWERIE", "cuIKTk_DO4A", "A7IMBnMU5a4", "ZLcgsBAXNaQ",
    ]

    const random = links[Math.floor(Math.random() * links.length)];
    res.redirect(`https://www.youtube.com/watch?v=${random}`);
  }

};