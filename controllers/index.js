'use strict';


var auth = require('../lib/auth')
  , async = require('async')
  , sm = require('sitemap')
  , Category = require('../models/category')
  , Machinery = require('../models/machinery');


module.exports = function (router) {


  router.get('/rental/:old', function (req, res, next) {

    async.parallel({
      category: function (callback) {
        Category.findOne({'seo.canonical': req.url}, 'url', function (err, item) {
          console.log(item);
          callback(null, item);
        });
      },
      machinery: function (callback) {
        Machinery.findOne({'seo.canonical': req.url}, 'url', function (err, item) {
          console.log(item);
          callback(null, item);
        });
      }
    }, function (err, result) {
      if (result.category || result.machinery) {
        if (result.category) {
          console.log(result.category);
          res.redirect(301, '/category/' + result.category.url);
        }
        if (result.machinery) {
          console.log(result.machinery);
          res.redirect(301, '/machinery/' + result.machinery.url);
        }
      } else {
        next();
      }
    });

  });


  router.get('/', function (req, res) {

    Category.find({category: {'$ne': null}})
      .populate('category', 'url')
      .sort({ title: 1 })
      .exec(function (err, items) {
        var model = {
          seo: {
            title: 'ГлобалТехноСтрой',
            keywords: '',
            description: ''
          },
          categories: items
        };

        res.render('index', model);
      });

  });


  router.get('/admin', auth.isAuthenticated('admin'), auth.injectUser(), function (req, res) {
    res.render('admin');
  });


  router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });


  router.get('/sitemap.xml', function (req, res) {

    var urls = [
      { url: '/' }
    ];

    async.parallel({
      category: function (callback) {
        Category.find({}, 'url', function (err, items) {
          async.each(items, function (item, callback) {
            var url = { url: '/category/' + item.url };
            urls.push(url);
            callback();
          }, function () {
            callback();
          });
        });
      },
      machinery: function (callback) {
        Machinery.find({}, 'url', function (err, items) {
          async.each(items, function (item, callback) {
            var url = { url: '/machinery/' + item.url };
            urls.push(url);
            callback();
          }, function () {
            callback();
          });
        });
      }
    }, function (err) {
      var sitemap = sm.createSitemap({
        hostname: 'http://gts76.ru',
        cacheTime: 600000,
        urls: urls
      });
      sitemap.toXML(function (xml) {
        res.header('Content-Type', 'application/xml');
        res.send(xml);
      });
    });

  });


//  router.get('*', function (req, res) {
//    res.redirect('/');
//  });

};
