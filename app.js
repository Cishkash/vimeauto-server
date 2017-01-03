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
var trendings = require('./routes/trendings');

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
app.use('/trendings', trendings);

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

module.exports = app;
