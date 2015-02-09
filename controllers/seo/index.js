'use strict';


var Machinery = require('../../models/machinery')
  , Category = require('../../models/category')
  , async = require('async')
  , auth = require('../../lib/auth');


module.exports = function (router) {

  router.all('/*', function(req, res, next) {
    if (req.headers.host.match(/^www/) !== null ) {
      var host = 'http://' + req.headers.host.replace(/^www\./, '') + '/seo' +  + req.url;
      res.redirect(host);
    } else {
      next();
    }
  });

  router.get('/machinery', auth.isAuthenticated('admin'), function (req, res) {
    Machinery
      .find({})
      .populate('category', 'title')
      .sort({category: -1})
      .exec(function (err, machinery) {
        res.render('seo/machinery', {machinery: machinery});
      });
  });

  router.get('/machinery/list', auth.isAuthenticated('admin'), function (req, res) {
    Machinery
      .find({})
      .populate('category', 'title')
      .sort({category: -1})
      .exec(function (err, machinery) {
        res.render('seo/machinery_list', {machinery: machinery});
      });
  });


};