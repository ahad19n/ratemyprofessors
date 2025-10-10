const path = require('path');
const morgan = require('morgan');
const express = require('express');
const cookieParser = require('cookie-parser');
const ejsLayouts = require('express-ejs-layouts');

const ActionLog = require('./models/ActionLog');
const { initMongoose, ensureAcid, gracefulShutdown } = require('./func');

// -------------------------------------------------------------------------- //

const app = express();
app.disable('x-powered-by');
const PORT = process.env.PORT || 3000;

// -------------------------------------------------------------------------- //

app.use(cookieParser());
app.use(ensureAcid);

// -------------------------------------------------------------------------- //

app.use(morgan('combined'));
app.use(express.urlencoded());

// -------------------------------------------------------------------------- //

app.use(express.static(path.join(__dirname, '../static')));

// -------------------------------------------------------------------------- //

app.use(ejsLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'partials/Layout');
app.set('views', path.join(__dirname, 'views'));

// -------------------------------------------------------------------------- //

initMongoose(process.env.MONGO_URI);

// -------------------------------------------------------------------------- //

app.use((req, res, next) => {
  if (req.method !== 'POST') return next();
 
  new ActionLog({
    acid: req.cookies.acid,
    route: req.originalUrl,
    body: JSON.stringify(req.body),
  }).save().catch(() => {});

  next();
});

// -------------------------------------------------------------------------- //

app.get('/', (req, res) => {
  res.render('IndexPage');
});

app.use('/async', require('./controllers/Async'));
app.use('/search', require('./controllers/Search'));
app.use('/report', require('./controllers/Report'));
app.use('/professor', require('./controllers/Professor'));
app.use('/university', require('./controllers/University'));

// -------------------------------------------------------------------------- //

app.use((req, res) => {
  res.status(404).render('errors/404');
});

// -------------------------------------------------------------------------- //

const server = app.listen(PORT, () => {
  console.log('[INFO] Sever listening on port', PORT);
});

process.on('SIGINT', () => gracefulShutdown(app, server));
process.on('SIGTERM', () => gracefulShutdown(app, server));