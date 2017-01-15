var express = require('express');
var https = require('https');

var router = express.Router();


router.get('/:video_id', function(req, res, next) {
  /**
   * Parses a usable date from the vimeo formatted date.
   *
   * @param  {String} date A date string consisting of a date and time.
   * @return {Array}       An array of the split date and time.
   */
  function parseDate(date) {
    return date.replace(/(?:T|\+)/g, ',').split(',');
  };

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
    var dateArray = [];

    response.on('data', (data) => {
      datum += data.toString('utf-8');
    }).on('end', () => {
      datum = JSON.parse(datum);
      dateArray = parseDate(datum.created_time);

      dataObj.video = datum;

      dataObj.video.created_date = dateArray[0]
      dataObj.video.created_time = dateArray[1];
      dataObj.video.id = parseInt(dataObj.video.uri.split('/')[2]);

      res.send(dataObj);
    });
  });

  request.on('error', (err) => {
    res.send(err);
  });

  request.end();
});

module.exports = router;
