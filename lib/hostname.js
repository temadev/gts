'use strict';

exports.hostname = function () {
  return function (req, res, next) {
    res.locals.hostname = process.env.HOSTNAME;
    next();
  };
};