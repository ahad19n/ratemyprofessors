const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const ejsLayouts = require("express-ejs-layouts");

const { randomString } = require('./helpers');
const ActionLog = require('./models/ActionLog');

// -------------------------------------------------------------------------- //

const app = express();
app.disable("x-powered-by");  // Hide Express signature for security through obscurity
app.set("trust proxy", true); // Trust upstream proxys for X-Forwarded-* headers
dotenv.config({ silent: true });

// -------------------------------------------------------------------------- //

app.use(cookieParser());
app.use(morgan("combined"));
app.use(express.urlencoded());

// -------------------------------------------------------------------------- //

app.use(express.static(path.join(__dirname, "../static")));

// -------------------------------------------------------------------------- //

if (!process.env.MONGODB_URI) {
  console.error("[ERROR] MONGODB_URI environment variable is required");
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("[INFO] Successfully connected to MongoDB"))
  .catch(err => {
    console.error("[ERROR] Failed to connect to MongoDB:", err);
    process.exit(1);
  });

// -------------------------------------------------------------------------- //

// Ensure each request has an ACID (Action Correlation ID) cookie.
// If missing, generate a new 32 char ID and persist it in a cookie for a long duration.
app.use((req, res, next) => {
  if (!req.cookies?.acid) {
    const acid = randomString(32);
    req.cookies.acid = acid;  // Make the cookie available downstream immediately

    // Generate a Set-Cookie response header
    res.cookie('acid', acid, {
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000 // 10 Years
    });
  }

  next();
});

// Log all POST requests for auditing and spam detection purposes.
// Any errors during saving are ignored; the request continues normally.
app.use((req, res, next) => {
  if (req.method !== 'POST') return next(); // Only proceed if POST request

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
});

// -------------------------------------------------------------------------- //

app.use(ejsLayouts);
app.set("view engine", "ejs");
app.set("layout", "partials/Layout"); // Default parent layout for all views
app.set("views", path.join(__dirname, "views"));

// -------------------------------------------------------------------------- //

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// -------------------------------------------------------------------------- //

// Endpoint to check the health of the app (Express + MongoDB)
// Returns 200 if MongoDB is reachable, 503 otherwise
app.get("/health", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.sendStatus(200);
  } catch (err) {
    console.error("[ERROR] Failed Health Check:", err);
    res.sendStatus(503);
  }
});

// -------------------------------------------------------------------------- //

// Only allows requests with the correct token,
// otherwise redirects to a random 10-hour video on YouTube.
// If ADMIN_SECRET is not defined, gracefully fails by disabling admin login entirely. 
const adminAuth = (req, res, next) => {
  const secret = req.get("authorization");

  if (secret && secret.length == 32 && secret === process.env.ADMIN_SECRET) {
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
};

app.use("/admin", adminAuth, require("./controllers/Admin"));

// -------------------------------------------------------------------------- //

app.use("/async", require("./controllers/Async"));
app.use("/search", require("./controllers/Search"));
app.use("/report", require("./controllers/Report"));
app.use("/professor", require("./controllers/Professor"));
app.use("/university", require("./controllers/University"));

// -------------------------------------------------------------------------- //

app.get("/", (req, res) => {
  res.render("IndexPage");
});

app.get("/about", (req, res) => {
  res.render("AboutPage");
});

app.use((req, res) => {
  res.status(404).render("errors/404");
});

// -------------------------------------------------------------------------- //

const gracefulShutdown = async (server) => {
  try {
    console.log('[INFO] Attempting to gracefully shut down server');

    await new Promise((resolve, reject) => {
      server.close(err => (err ? reject(err) : resolve()));
    });
    console.log('[INFO] Successfully shutdown server');

    await mongoose.connection.close();
    console.log('[INFO] Successfully closed MongoDB connection');

    process.exit(0);
  } catch (err) {
    console.error('[ERROR] Error during server shutdown:', err);
    process.exit(1);
  }
};

const server = app.listen(process.env.PORT || 3000, () => {
  console.log("[INFO] Server listening on port", process.env.PORT || 3000);
});

process.on("SIGINT", () => gracefulShutdown(server));
process.on("SIGTERM", () => gracefulShutdown(server));
