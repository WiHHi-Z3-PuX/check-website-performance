'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  Website = mongoose.model('Website'),
  WebsiteCheck = mongoose.model('WebsiteCheck');

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  res.render('modules/core/server/views/index', {
    user: req.user || null
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};

/**
 * Crawl requested website, send results
 */
exports.checkWebsite = function (req, res) {
  console.log(req.body);
  var io = req.app.get('socketio');

  var websiteQuery = req.body.website;

  Website.findOneAndUpdate({ url: websiteQuery }, { $inc: { checks: 1 }, lastChecked: Date.now() }, { upsert: true, new: true }, function (err, website) {
    if (err) console.log(err);

    console.log(website);
  });

  var Crawler = require('simplecrawler');

  var port = 80;
  // var exclude = ['gif', 'jpg', 'jpeg', 'png', 'ico', 'bmp', 'ogg', 'webp',
  //   'mp4', 'webm', 'mp3', 'ttf', 'woff', 'json', 'rss', 'atom', 'gz', 'zip',
  //   'rar', '7z', 'css', 'js', 'gzip', 'exe'];

  var exclude = ['ogg', 'webp', 'mp4', 'woff', 'atom', 'gzip', 'rar', '7z', 'exe'];
  var exts = exclude.join('|');
  var regex = new RegExp('\.(' + exts + ')', 'i'); // This is used for filtering crawl items.

  var crawler = new Crawler(websiteQuery);

  crawler.maxDepth = 2;


  var resources = []; // This array will hold all the resources
  var stats = {
    resourceNumber: 0,
    totalSize: 0,
    totalTime: 0,
    slowestRequest: 0, 
    fastestRequest: 99999999999999
  };

  // Crawler configuration
  crawler.initialPort = port;
  crawler.initalPath = '/';

  crawler.addFetchCondition(function (parsedURL) {
    return !parsedURL.path.match(regex); // This will reject anything that's not a link.
  });

  // Run the crawler
  crawler.start();

  crawler.on('fetchcomplete', function(item, responseBuffer, response) {
    stats.resourceNumber += 1;
    stats.totalSize += item.stateData.actualDataSize;
    stats.totalTime += item.stateData.requestTime;
    if (item.stateData.requestTime > stats.slowestRequest) {
      stats.slowestRequest = item.stateData.requestTime;
    }
    if (item.stateData.requestTime < stats.fastestRequest) {
      stats.fastestRequest = item.stateData.requestTime;
    }
      
    var itemObject = {
      resourceNumber: stats.resourceNumber - 1,
      url: item.url,
      path: item.path,
      latency: item.stateData.requestLatency,
      time: item.stateData.requestTime,
      size: item.stateData.actualDataSize,
      resourceType: item.stateData.contentType,
      speed: (item.stateData.actualDataSize/item.stateData.requestTime).toFixed(2)
    };

    resources.push(itemObject);
    console.log(item.url);


    io.emit('chatMessage', itemObject);
  });

  crawler.on('complete', function(item, responseBuffer, response) {
    stats.avgTime = (stats.totalTime/stats.resourceNumber).toFixed(2);

    // console.log(pages);
    console.log('END');
    console.log(stats);
    // res.json({
    //   results: resources,
    //   stats: stats
    // });
    
    var websiteCheckObject = {
      url: websiteQuery,
      stats: stats,
      resources: resources
    };

    WebsiteCheck.create(websiteCheckObject, function (err, websiteCheckRes) {
      if (err) console.log(err);
    });

    res.json({
      end: true
    });
  });
};


/**
 * Send all websites
 */
exports.getWebsites = function (req, res) {
  Website.find().exec(function (err, websites) {
    console.log(websites);
    res.json(websites);
  });
};

/**
 * Send all checks for the requested website
 */
exports.getWebsiteChecks = function (req, res) {
  WebsiteCheck.find({}).where('url').equals(req.body.url)
    .exec(function (err, websiteChecks) {
    res.json(websiteChecks);
  });
};

/**
 * Send the requested website check
 */
exports.getWebsiteCheck = function (req, res) {
  WebsiteCheck.findOne({ _id: req.body._id })
    .exec(function (err, websiteCheck) {
      res.json(websiteCheck);
    });
};
