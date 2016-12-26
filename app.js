var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var https = require('https');

var env = require('./.env');

// Create a base64 encoded string from the clientId and secret
var encodedCredentials = new Buffer(env.clientId + ':' + env.clientSecret).toString('base64');

var index = require('./routes/index');
var users = require('./routes/users');
var categories = require('./routes/categories');

app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/categories', categories);

// Fetch app level bearerToken object
bearerToken(global.bearerToken);

function bearerToken(token) {
  if (token) { return; }

  var options = {
    hostname: 'api.vimeo.com',
    path: '/oauth/authorize/client?grant_type=client_credentials',
    method: 'POST',
    headers: {
      'Authorization': 'basic ' + encodedCredentials,
      'Content-Type': 'application/json'
    }
  };

  var req = https.request(options, (res) => {
    var datum = [];
    res.on('data', (d) => {
      datum.push(d);
    }).on('end', () => {
      app.locals.token = JSON.parse(datum);
    });
  });

  req.end();
}

// CORS related stuff
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  console.log('Request url: ' + req.url);
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
