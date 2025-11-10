const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const ejsLayouts = require("express-ejs-layouts");

const ActionLog = require("./models/ActionLog");
const { initMongoose, ensureAcid, logAction, gracefulShutdown } = require("./func");

// -------------------------------------------------------------------------- //

dotenv.config();
const app = express();
app.disable("x-powered-by");
app.set("trust proxy", true);
const PORT = process.env.PORT || 3000;

// -------------------------------------------------------------------------- //

app.use(cookieParser());
app.use(morgan("combined"));
app.use(express.urlencoded());

// -------------------------------------------------------------------------- //

app.use(express.static(path.join(__dirname, "../static")));

// -------------------------------------------------------------------------- //

initMongoose(process.env.MONGO_URI);

// -------------------------------------------------------------------------- //

app.use(ensureAcid);
app.use(logAction);

// -------------------------------------------------------------------------- //

app.use(ejsLayouts);
app.set("view engine", "ejs");
app.set("layout", "partials/Layout");
app.set("views", path.join(__dirname, "views"));

// -------------------------------------------------------------------------- //

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// -------------------------------------------------------------------------- //

app.get("/", (req, res) => {
  res.render("IndexPage");
});

app.use("/async", require("./controllers/Async"));
app.use("/search", require("./controllers/Search"));
app.use("/report", require("./controllers/Report"));
app.use("/professor", require("./controllers/Professor"));
app.use("/university", require("./controllers/University"));
app.use("/about", (req, res) => {
  res.render("AboutUs", { title: "About Us" });
});
app.use("/home", (req, res) => {
  res.render("IndexPage");
});

// -------------------------------------------------------------------------- //

app.use((req, res) => {
  res.status(404).render("errors/404");
});

// -------------------------------------------------------------------------- //

const server = app.listen(PORT, () => {
  console.log("[INFO] Sever listening on port", PORT);
});

process.on("SIGINT", () => gracefulShutdown(app, server));
process.on("SIGTERM", () => gracefulShutdown(app, server));
