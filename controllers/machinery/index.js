'use strict';


var Machinery = require('../../models/machinery')
  , Category = require('../../models/category')
  , async = require('async')
  , auth = require('../../lib/auth');


module.exports = function (router) {

  router.all('/*', function (req, res, next) {
    if (req.headers.host.match(/^www/) !== null) {
      var host = 'http://' + req.headers.host.replace(/^www\./, '') + '/machinery' + req.url;
      res.redirect(301, host);
    } else {
      next();
    }
  });

  router.get('/list', function (req, res) {

    var regex = new RegExp(req.query.query, 'i');
    var suggestions = [];

    async.parallel({
      machinery: function (callback) {
        Machinery
          .find({title: regex, hide: {'$ne': true}}, {title: 1, category: 1, url: 1, params: 1, price: 1, img: 1, sort: 1})
          .populate('category', 'title')
          .sort({'sort': 1})
          .limit(10)
          .exec(function (err, machinery) {
            callback(null, machinery);
          });
      },
      category: function (callback) {
        Category
          .find({title: regex, hide: {'$ne': true}}, {_id: 1})
          .sort({'updated_at': -1})
          .sort({'created_at': -1})
          .limit(10)
          .exec(function (err, category) {
//            console.log(category);

            var machineryCat = [];
            async.each(category, function (cat, callback) {
//              console.log(cat);
              Machinery
                .find({category: cat._id, hide: {'$ne': true}}, {title: 1, category: 1, url: 1, params: 1, price: 1, img: 1, sort: 1})
                .populate('category', 'title')
                .sort({'sort': 1})
                .limit(10)
                .exec(function (err, machinery) {
                  if (machinery) {

                    async.each(machinery, function (mach, callback) {

                      machineryCat.push(mach);
                      callback();
                    }, function () {
                      callback();
                    });
//                    console.log(machinery);
                  }

                });
            }, function () {
//              console.log(machineryCat);
              callback(null, machineryCat);
            });

          });
      }
    }, function (err, models) {

      async.parallel([
        function (callback) {
          async.each(models.machinery, function (model, callback) {
            var value
              , price_type = (model.category._id + '' === '544677d1f23fda0000151807' || model.category._id + '' === '5446779ef23fda0000151806') ? 'руб./сутки' : 'руб./час'
              , price = model.price ? model.price + ' ' + price_type : '';
            if (model.params && model.params.length > 0 && model.params[0].name !== '') {
              value = '<strong>' + model.category.title + ' ' + model.title + '</strong>' + model.params[0].name + ': ' + model.params[0].value + '<br>' + price;
            } else {
              value = '<strong>' + model.category.title + ' ' + model.title + '</strong>' + price;
            }
            var img = (model.img && model.img.length > 0 && model.img[0].url !== '') ? '<img src="' + model.img[0].url + '">' : '<img src="img/blank.png">';
            var curModel = {
              data: model._id,
              url: '/machinery/' + model.url,
              value: value,
              img: img
            };
            suggestions.push(curModel);
            callback();
          }, function (err) {
            callback();
          });
        },
        function (callback) {
          async.each(models.category, function (model, callback) {
            var value
              , price_type = (model.category._id + '' === '544677d1f23fda0000151807' || model.category._id + '' === '5446779ef23fda0000151806') ? 'руб./сутки' : 'руб./час'
              , price = model.price ? model.price + ' ' + price_type : '';
            if (model.params && model.params.length > 0 && model.params[0].name !== '') {
              value = '<strong>' + model.category.title + ' ' + model.title + '</strong>' + model.params[0].name + ': ' + model.params[0].value + '<br>' + price;
            } else {
              value = '<strong>' + model.category.title + ' ' + model.title + '</strong>' + price;
            }
            var img = (model.img && model.img.length > 0 && model.img[0].url !== '') ? '<img src="' + model.img[0].url + '">' : '<img src="img/blank.png">';
            var curModel = {
              data: model._id,
              url: '/machinery/' + model.url,
              value: value,
              img: img
            };
            suggestions.push(curModel);
            callback();
          }, function (err) {
            callback();
          });
        }
      ], function () {
        res.json({
          query: req.query.query,
          suggestions: suggestions
        });
      });

    });

  });


  router.get('/:url', function (req, res, next) {

    var url = req.params.url;

    Machinery.findOne({url: url, hide: {'$ne': true}})
      .populate('category', 'title url category')
      .exec(function (err, machinery) {
        if (!machinery) {
          next();
        }
        if (machinery) {
          var options = {
            path: 'category.category',
            model: 'Category'
          };
          Machinery.populate(machinery, options, function (err, machinery) {
            if (req.xhr) {
              res.render('machinery/index_ajax', {machinery: machinery});
            }
            else {
              res.render('machinery/index', {machinery: machinery, url: '/machinery/' + url});
            }
          });
        }
      });

  });


  router.get('/edit/:id', auth.isAuthenticated(), function (req, res) {

    var id = req.params.id;

    Machinery.findOne({_id: id})
      .exec(function (err, machinery) {
//        console.log(machinery);

        Category.find({category: {$exists: true}})
          .exec(function (err, categories) {
            res.render('machinery/edit', {machinery: machinery, categories: categories});
          });
      });

  });


  router.post('/edit', auth.isAuthenticated(), function (req, res) {

    var body = req.body;

    body.url = body.url.trim();
    body.hide = body.hide?true:false;

    body.img = body.img.filter(function (img) {
      return (img.url !== '')
    });

    Machinery.findByIdAndUpdate(body.id, {$set: body}, function (err, machinery) {
      res.redirect('/machinery/' + machinery.url);
    });

  });


  router.get('/create', auth.isAuthenticated(), function (req, res) {

    Category.find({category: {$exists: true}})
      .exec(function (err, categories) {
        res.render('machinery/create', {categories: categories});
      });

  });


  router.post('/create', auth.isAuthenticated(), function (req, res) {

    var body = req.body;

    body.url = body.url.trim();

    var newMachinery = new Machinery(body);

    newMachinery.save(function (err, machinery) {
      if (machinery) {
        res.redirect('/machinery/' + machinery.url);
      }
    });

  });


  router.post('/remove', auth.isAuthenticated(), function (req, res) {

    Machinery.findById(req.body.id, function (err, machinery) {
      machinery.remove();
      res.json(200);
    });

  });

};