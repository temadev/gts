'use strict';

var Category = require('../models/category')
  , async = require('async');

exports.categories = function () {
  return function (req, res, next) {
    Category.find({category: {'$exists': false}}, {title: 1, url: 1}, function (err, categories) {

      var cat = {};

      cat['Главная'] = {
        active: 0,
        href: '/'
      };

      async.eachSeries(categories, function (category, callback) {
        cat[category.title] = {
          active: 0,
          href: '/category/' + category.url,
          id: category.url,
          S: {}
        };
        Category.find({ category: category }, {title: 1, url: 1, image: 1}).sort('title').exec(function (err, subcategories) {
          async.eachSeries(subcategories, function (sub, callback) {
            cat[category.title].S[sub.title] = {
              href: '/category/' + sub.url,
              id: sub.url,
              image: sub.image,
              active: 0
            };
            callback();
          }, function () {
            callback();
          });

        });
      }, function () {
        res.locals.nav = {menu: cat};
        next();
      });
    });

  };
};
