var express = require('express');
var https = require('https');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var options = {
        hostname: 'api.vimeo.com',
        path: '/categories',
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + app.locals.token.access_token,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.vimeo.*+json;version=3.2'
        }
      };

  var request = https.request(options, (response) => {
    var datum = '';
    response.on('data', (data) => {
      datum += data.toString('utf-8');
    }).on('end', () => {
      res.send(JSON.parse(datum));
    });
  });

  request.end();
});

module.exports = router;
