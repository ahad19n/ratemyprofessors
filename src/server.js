const path = require('path');
const express = require('express');
const layouts = require('express-ejs-layouts');

const app = express();
app.disable('x-powered-by');

app.use(layouts);
app.use(express.urlencoded());
app.use('/assets', express.static(path.join(__dirname, '../assets')));

app.set('view engine', 'ejs');
app.set("layout", "layouts/main");
app.set('views', path.join(__dirname, 'views'));

app.use('/add', require('./controllers/Add'));
app.use('/async', require('./controllers/Async'));
app.use('/professor', require('./controllers/Professor'));
app.use('/report', require('./controllers/Report'));
app.use('/search', require('./controllers/Search'));
app.use('/university', require('./controllers/University'));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running at ${port}`);
});