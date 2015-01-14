'use strict';


var Machinery = require('../../models/machinery')
  , Category = require('../../models/category')
  , async = require('async')
  , auth = require('../../lib/auth');


module.exports = function (router) {

  router.get('/machinery', auth.isAuthenticated(), function (req, res) {
    Machinery
      .find({})
      .populate('category', 'title')
      .sort({category: -1})
      .exec(function (err, machinery) {
        res.render('seo/machinery', {machinery: machinery});
      });
  });

  router.get('/machinery/list', auth.isAuthenticated(), function (req, res) {
    Machinery
      .find({})
      .populate('category', 'title')
      .sort({category: -1})
      .exec(function (err, machinery) {
        res.render('seo/machinery_list', {machinery: machinery});
      });
  });


};