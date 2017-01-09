var express = require('express');
var https = require('https');

var router = express.Router();

router.get('/:video_id', function(req, res, next) {
  var options = {
        hostname: 'api.vimeo.com',
        path: '/videos/' + req.params.video_id,
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
      dataObj.video = datum;
      dataObj.video.id = 1;

      res.send(dataObj);
    });
  });

  request.on('error', (err) => {
    res.send(err);
  });

  request.end();
});

module.exports = router;
