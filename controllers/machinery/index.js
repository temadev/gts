'use strict';


var Machinery = require('../../models/machinery')
  , Category = require('../../models/category')
  , async = require('async')
  , auth = require('../../lib/auth');


module.exports = function (router) {

//  router.get('/populate', function (req, res) {
//    var region = [
//      { name: 'Ярославль', smena: '4' },
//      { name: 'Рыбинск', smena: '16' },
//      { name: 'Ростов', smena: '12' },
//    ];
//    Machinery.update({}, {$set: { region: region }}, {upsert: true}, function (err) {
//      res.send(200);
//    });
//  });

  router.get('/list', function (req, res) {

    var regex = new RegExp(req.query.query, 'i');
    var suggestions = [];

    async.parallel({
      machinery: function (callback) {
        Machinery
          .find({ title: regex }, { 'title': 1, 'category': 1, 'url': 1, 'params': 1, 'price': 1 })
          .populate('category', 'title')
          .sort({'updated_at': -1})
          .sort({'created_at': -1})
          .limit(20)
          .exec(function (err, machinery) {
            callback(null, machinery);
          });
      },
      category: function (callback) {
        Category
          .find({ title: regex }, {_id: 1})
          .sort({'updated_at': -1})
          .sort({'created_at': -1})
          .limit(20)
          .exec(function (err, category) {
//            console.log(category);

            var machineryCat = [];
            async.each(category, function (cat, callback) {
//              console.log(cat);
              Machinery
                .find({category: cat._id}, { 'title': 1, 'category': 1, 'url': 1, 'params': 1, 'price': 1 })
                .populate('category', 'title')
                .sort({'updated_at': -1})
                .sort({'created_at': -1})
                .limit(20)
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
              , price_type = (model.category._id+'' === '544677d1f23fda0000151807' || model.category._id+'' === '5446779ef23fda0000151806')?'руб./сутки':'руб./час';
            if (model.params && model.params.length > 0 && model.params[0].name !== '') {
              value = model.category.title + ' ' + model.title + ' (' + model.params[0].name + ': ' + model.params[0].value + ') — ' + model.price + ' ' + price_type;
            } else {
              value = model.category.title + ' ' + model.title + ' — ' + model.price + ' ' + price_type;
            }
            var curModel = {
              data: model._id,
              url: '/machinery/' + model.url,
              value: value
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
              , price_type = (model.category._id+'' === '544677d1f23fda0000151807' || model.category._id+'' === '5446779ef23fda0000151806')?'руб./сутки':'руб./час';
            if (model.params && model.params.length > 0 && model.params[0].name !== '') {
              value = model.category.title + ' ' + model.title + ' (' + model.params[0].name + ': ' + model.params[0].value + ') — ' + model.price + ' ' + price_type;
            } else {
              value = model.category.title + ' ' + model.title + ' — ' + model.price + ' ' + price_type;
            }
            var curModel = {
              data: model._id,
              url: '/machinery/' + model.url,
              value: value
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

    Machinery.findOne({ url: url })
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
            res.format({
              json: function () {
                res.json({ machinery: machinery });
              },
              html: function () {
                res.render('machinery/index', { machinery: machinery });
              }
            });
          });
        }
      });

  });


  router.get('/edit/:id', auth.isAuthenticated(), function (req, res) {

    var id = req.params.id;

    Machinery.findOne({ _id: id })
      .exec(function (err, machinery) {
//        console.log(machinery);

        Category.find({category: {$exists: true}})
          .exec(function (err, categories) {
            res.format({
              json: function () {
                res.json({ machinery: machinery, categories: categories });
              },
              html: function () {
                res.render('machinery/edit', { machinery: machinery, categories: categories });
              }
            });
          });
      });

  });


  router.post('/edit', function (req, res) {

    var body = req.body;

    Machinery.findByIdAndUpdate(body.id, { $set: body }, function (err, machinery) {
      res.redirect('/machinery/' + machinery.url);
    });

  });


  router.get('/create', function (req, res) {

    Category.find({category: {$exists: true}})
      .exec(function (err, categories) {
        res.format({
          json: function () {
            res.json({categories: categories});
          },
          html: function () {
            res.render('machinery/create', {categories: categories});
          }
        });
      });

  });


  router.post('/create', function (req, res) {

//    console.log(req.body);

    var body = req.body;

    var newMachinery = new Machinery(body);

    newMachinery.save(function (err, machinery) {
      res.redirect('/machinery/' + machinery.url);
    });

  });


  router.post('/remove', function (req, res) {

    Machinery.findById(req.body.id, function (err, machinery) {
      machinery.remove();
      res.json(200);
    });

  });

};