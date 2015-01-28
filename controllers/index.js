'use strict';


var auth = require('../lib/auth')
  , async = require('async')
  , sm = require('sitemap')
  , request = require('request')
  , Category = require('../models/category')
  , Machinery = require('../models/machinery')
  , Page = require('../models/page');


module.exports = function (router) {


  router.get('/rental/:category', function (req, res, next) {

    var url = req.originalUrl;

    if (url.slice(-1) !== '/') {
      url = url + '/';
    }

    Category.findOne({'seo.canonical': url}, 'url', function (err, item) {
      if (item) {
        res.redirect(301, '/category/' + item.url);
      } else {
        next();
      }
    });

  });


  router.get('/rental/:category/:machinery', function (req, res, next) {

    var url = req.originalUrl;

    if (url.slice(-1) !== '/') {
      url = url + '/';
    }

    Machinery.findOne({'seo.canonical': url}, 'url', function (err, item) {
      if (item) {
        res.redirect(301, '/machinery/' + item.url);
      } else {
        next();
      }
    });

  });


  router.get('/', function (req, res) {

    Category.find({category: {'$ne': null}})
      .populate('category', 'url')
      .sort({title: 1})
      .exec(function (err, items) {
        var model = {
          seo: {
            title: 'Аренда спецтехники и аренда строительной техники. Услуги спецтехники от компании ГТС ГлобалТехноСтрой',
            keywords: 'аренда спецтехники, аренда строительной техники, услуги спецтехники',
            description: 'Если вам требуется аренда спецтехники или аренда строительной техники, обращайтесь в компанию «ГлобалТехноСтрой». Мы предлагаем услуги спецтехники на выгодных условиях. Высокий уровень сервиса и профессионализм наших специалистов способствуют развитию вашего бизнеса.'
          },
          categories: items
        };

        res.render('index', model);
      });

  });


  router.get('/order/:category/:machinery', function (req, res) {
    async.parallel({
      machinery: function (cb) {
        Machinery.findOne({url: req.params.machinery}, {title: 1}).exec(function (err, machinery) {
          cb(null, machinery.title);
        });
      },
      category: function (cb) {
        Category.findOne({url: req.params.category}, {title: 1}).exec(function (err, category) {
          cb(null, category.title);
        });
      }
    }, function (err, title) {
      res.render('machinery/order_ajax', {category: title.category, machinery: title.machinery});
    });
  });


  router.post('/order', function (req, res) {

    var order = req.body
      , url = encodeURI('http://95.86.207.16:3333/1c/hs/orders/add?name=' + order.name + '&phone=' + order.phone + '&dateBegin=' + order.dateBegin + '&dateEnd=' + order.dateEnd + '&timeBegin=' + order.timeBegin + '&time=' + order.time + '&comment=' + order.comment + '&machinery=' + order.machinery + '&category=' + order.category);

    request({
      url: url,
      json: true
    }, function (err, result) {
      if (result && result.statusCode === 200) {
        res.send(200);
      } else {
        res.send(408);
      }
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
      {url: '/'}
    ];

    async.parallel({
      category: function (callback) {
        Category.find({}, 'url', function (err, items) {
          async.each(items, function (item, callback) {
            var url = {url: '/category/' + item.url};
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
            var url = {url: '/machinery/' + item.url};
            urls.push(url);
            callback();
          }, function () {
            callback();
          });
        });
      },
      page: function (callback) {
        Page.find({url: {$ne: 'test'}}, 'url', function (err, items) {
          async.each(items, function (item, callback) {
            var url = {url: '/page/' + item.url};
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


  //router.get('/*', function (req, res) {
  //  res.redirect('/');
  //});

};
