'use strict';


var auth = require('../lib/auth')
  , async = require('async')
  , sm = require('sitemap')
  , request = require('request')
  , Category = require('../models/category')
  , Machinery = require('../models/machinery')
  , Page = require('../models/page');


module.exports = function (router) {

  router.all('/*', function(req, res, next) {
    if (req.headers.host.match(/^www/) !== null ) {
      var host = 'http://' + req.headers.host.replace(/^www\./, '') + req.url;
      res.redirect(301, host);
    } else {
      next();
    }
  });


  router.get('/', function (req, res) {

    var model = {
      seo: {},
      links: [
        {href: 'http://gts76.ru', title: 'Ярославль'},
        {href: 'http://ivanovo.gts76.ru', title: 'Иваново'},
        {href: 'http://kostroma.gts76.ru', title: 'Кострома'},
        {href: 'http://vladimir.gts76.ru', title: 'Владимир'},
        {href: 'http://vologda.gts76.ru', title: 'Вологда'}
      ],
      slider: []
    };


    async.each(res.locals.settings, function (setting, cb) {
      if (setting.type === 'seo') {
        if (setting.title === 'index.title') {
          model.seo.title = setting.value;
        }
        if (setting.title === 'index.keywords') {
          model.seo.keywords = setting.value;
        }
        if (setting.title === 'index.description') {
          model.seo.description = setting.value;
        }
      }
      if (setting.type === 'slider' && setting.title === 'index.bottom' && setting.value.length) {
        model.slider.push(setting.value);
      }
      cb();
    }, function () {
      Category.find({category: {'$ne': null}, hide: {'$ne': true}})
        .populate('category', 'url')
        .sort({title: 1})
        .exec(function (err, items) {
          model.categories = items;
          res.render('index', model);
        });
    });

  });


  router.get('/order/:category/:machinery', function (req, res) {
    async.parallel({
      machinery: function (cb) {
        Machinery.findOne({url: req.params.machinery}, {title: 1}).exec(function (err, machinery) {
          if (machinery) {
            cb(null, machinery.title);
          } else {
            cb(null, 'any');
          }
        });
      },
      category: function (cb) {
        Category.findOne({url: req.params.category}, {title: 1}).exec(function (err, category) {
          if (category) {
            cb(null, category.title);
          } else {
            cb(null, 'any');
          }
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


  router.get('/robots.txt', function (req, res) {
    res.header('Content-Type', 'text/plain');
    res.send('User-agent: *\nHost: ' + res.locals.hostname.split('http://')[1]);
  });


  router.get('/sitemap.xml', function (req, res) {

    var urls = [
      {url: '/'}
    ];

    async.parallel({
      category: function (callback) {
        Category.find({hide: {'$ne': true}}, 'url', function (err, items) {
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
        Machinery.find({hide: {'$ne': true}}, 'url', function (err, items) {
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
        Page.find({url: {$ne: 'test'}, hide: {'$ne': true}}, 'url', function (err, items) {
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
        hostname: res.locals.hostname,
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
