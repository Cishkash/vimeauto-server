var express = require('express');
var https = require('https');

var router = express.Router();

/* GET categories page. */
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
    var dataObj = {};

    response.on('data', (data) => {
      datum += data.toString('utf-8');
    }).on('end', () => {
      datum = JSON.parse(datum);
      dataObj.categories = datum.data;

      // Assign an id to each category object
      dataObj.categories.forEach((item, index) => {
        item.id = index;
      });

      res.send(dataObj);
    });
  });

  request.on('error', () => {
    res.send('An error occurred');
  });
  
  request.end();
});

module.exports = router;
