'use strict';

var Settings = require('../models/settings')
  , async = require('async');

exports.settings = function () {
  return function (req, res, next) {
    Settings.find({}).exec(function (err, settings) {
      res.locals.settings = settings;
      res.locals.phones = {};
      async.each(settings, function (setting, cb) {
        if (setting.type === 'phone' && setting.value !== '') {
          res.locals.phones[setting.title] = setting.value;
        }
        cb();
      }, function () {
        next();
      });
    });
  };
};