const path = require('path');
const express = require('express');
const layouts = require('express-ejs-layouts');

const app = express();
const port = process.env.PORT || 3000;

app.use(layouts);
app.set('view engine', 'ejs');
app.set("layout", "layouts/main");
app.set('views', path.join(__dirname, 'views'));

app.disable('x-powered-by');
app.use('/assets', express.static(path.join(__dirname, '../assets')));

app.use(require('./router'));

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});