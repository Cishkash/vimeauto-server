var express = require('express');
var https = require('https');

var router = express.Router();

/**
 * Parses a key from a uri. Used for routing and whatnot.
 *
 * @param  {Object} items The dataObj of the category responses
 * @param  {Number} index The index of which part of parsed uri you are looking
 *                        for. Just in case you have a deeper level uri
 * @return {Object}       Mapped dataObj key form the split uri
 */
function parseKey(items, index) {
  if (!items) { return; }
  index = index ? index : 2;
  return items.map(item => {
    return item.key = item.uri.split('/')[index];
  });
};

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

      parseKey(dataObj.categories);

      res.send(dataObj);
    });
  });

  request.on('error', (error) => {
    res.send( error );
  });

  request.end();
});

/**
 * The categories/videos route
 * @type {Object}
 */
router.get('/videos/:category_id', function(req, res, next) {

  if (!req.params.category_id) {
    res.status(500).send({error: "Missing required category id param"})
  };

  var options = {
    hostname: 'api.vimeo.com',
    path: '/categories/' + req.params.category_id + '/videos?per_page=12',
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
      dataObj = JSON.parse(datum);

      parseKey(dataObj.data);
      res.send(dataObj.data);
    });
  });

  request.on('error', (error) => {
    res.send( error );
  });

  request.end();
});

module.exports = router;
