const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('morgan');
const favicon = require('serve-favicon');
const passport = require('passport');
const session = require('express-session');
const nodemailer = require('nodemailer');
require('./app/config/passport')(passport);

const config = require('./app/config/database');
const port = process.env.PORT || 3000;

const auth = require('./app/routes/authentication')(router, passport);
const mailHandler = require('./app/routes/mailHandler')(router);
const user = require('./app/routes/user')(router);

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, { useMongoClient: true }, (err) => {
  if (err) {
    console.log('Erreur trying to connect to database' + err);
  } else {
    console.log('Connected to database ' + config.db);
  }
});

// MIDDLEWARE
// Logger
app.use(logger('dev'));

// Favicon
app.use(favicon(path.join(__dirname, 'public/src', 'favicon.ico')));

// Allows cross origin in development only
app.use(cors({ origin: 'http://localhost:4200' }));

// Cookie parser used for authentication
app.use(cookieParser());

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: false
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Set Static Folder
app.use(express.static(path.join(__dirname, '/public')));

// Routes
app.use('/auth', auth);
app.use('/mail', mailHandler);
app.use('/users', user);

// Get
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/src/index.html');
});

app.listen(port, () => {
  console.log('Listening on port ' + port);
});