const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const errorsHandler = require('./middlewares/errors');
const routes = require('./routes/index');
const app = express();
const redirect = require('./middlewares/redirect')

app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({ limit: '10mb'}));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(redirect)
app.use('/',  routes);

app.use(errorsHandler.notFound);
app.use(errorsHandler.catchErrors);

module.exports = app;
