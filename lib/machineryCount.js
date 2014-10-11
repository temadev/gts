'use strict';

var Machinery = require('../models/machinery');

exports.machineryCount = function () {
  return function (req, res, next) {
    Machinery.count({}, function (err, count) {
      res.locals.machineryCount = count;
      next();
    });
  };
};