const path = require('path');
const express = require('express');
const mongoose = require("mongoose");
const ejsLayouts = require('express-ejs-layouts');

const app = express();
app.disable('x-powered-by');
const PORT = process.env.PORT || 3000;

app.use(ejsLayouts);
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, '../static')));

app.set('view engine', 'ejs');
app.set('layout', '../components/Layout');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect('mongodb://root:root@localhost:27017') // TODO: process.env.MONGO_URI
.then(() => console.log('[INFO] MongoDB connected successfully'))
.catch(error => console.error(`[ERROR] MongoDB connection failed: ${error}`));

app.get('/', (req, res) => {
  res.render('Index');
});

app.use('/async', require('./controllers/Async'));
app.use('/search', require('./controllers/Search'));
app.use('/report', require('./controllers/Report'));
app.use('/professor', require('./controllers/Professor'));
app.use('/university', require('./controllers/University'));

app.listen(PORT, () => {
  console.log(`[INFO] Sever listening on port ${PORT}`);
});