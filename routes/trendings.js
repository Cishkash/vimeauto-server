var express = require('express');
var https = require('https');

var router = express.Router();

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {

  var options = {
        hostname: 'api.vimeo.com',
        path: '/videos?filter=trending&per_page=3',
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
      dataObj.trendings = datum.data;

      // Assign an id to each category object
      dataObj.trendings.forEach((item, index) => {
        item.id = index;
      });

      res.send(dataObj);
    });
  });

  request.end();
});

module.exports = router;
