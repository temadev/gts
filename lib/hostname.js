'use strict';

exports.hostname = function () {
  return function (req, res, next) {
    res.locals.hostname = process.env.HOSTNAME;
    var ctime = new Date(require('fs').statSync(__dirname).ctime);
    ctime.setMonth(ctime.getMonth() + 6);
    res.locals.ctime = ctime;
    next();
  };
};