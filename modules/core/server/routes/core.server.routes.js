'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  app.route('/*').get(core.renderIndex);

  // check requested website, send results
  app.route('/website').post(core.checkWebsite);

  // send all websites
  // mysteriously get does not work here
  app.route('/websites').post(core.getWebsites);

  // send all checks for requested website url
  app.route('/websitechecks').post(core.getWebsiteChecks);

  // send the requested check
  app.route('/websitecheck').post(core.getWebsiteCheck);
};
