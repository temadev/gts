'use strict';

var Settings = require('../models/settings');

exports.settings = function () {
  return function (req, res, next) {
    Settings.find({}).exec(function (err, settings) {
      res.locals.settings = settings;
      next();
    });
  };
};