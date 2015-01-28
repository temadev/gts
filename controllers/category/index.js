'use strict';


var Category = require('../../models/category')
  , Machinery = require('../../models/machinery')
  , async = require('async')
  , auth = require('../../lib/auth');


module.exports = function (router) {


  router.get('/:url', function (req, res, next) {

    var url = req.params.url;

    Category.findOne({ url: url })
      .populate('category', 'title url')
      .exec(function (err, category) {
        if (!category) {
          next();
        }
        if (category) {
          Machinery.find({category: category})
            .sort({'sort': 1})
            .exec(function (err, machinery) {
              res.format({
                json: function () {
                  res.json({ category: category, machinery: machinery });
                },
                html: function () {
                  res.render('category/index', { category: category, machinery: machinery });
                }
              });
            });
        }
      });

  });


  router.get('/edit/:id', auth.isAuthenticated(), function (req, res) {

    var id = req.params.id;

    Category.findOne({ _id: id })
      .exec(function (err, category) {
//        console.log(category);

        Category.find({category: {$exists: false}})
          .exec(function (err, categories) {
//            console.log(categories);
            res.format({
              json: function () {
                res.json({ category: category });
              },
              html: function () {
                res.render('category/edit', { category: category, categories: categories });
              }
            });
          });
      });
  });


  router.post('/edit', auth.isAuthenticated(), function (req, res) {

    var body = req.body;

    Category.findByIdAndUpdate(body.id, { $set: body }, function (err, category) {
      res.redirect('/category/' + category.url);
    });

  });


  router.get('/create', auth.isAuthenticated(), function (req, res) {

    Category.find({category: {$exists: false}})
      .exec(function (err, categories) {
        res.format({
          json: function () {
            res.json({categories: categories});
          },
          html: function () {
            res.render('category/create', {categories: categories});
          }
        });
      });

  });


  router.post('/create', auth.isAuthenticated(), function (req, res) {

    var body = req.body;

    var newCategory = new Category(body);

    newCategory.save(function (err, category) {
      res.redirect('/category/' + category.url);
    });

  });


  router.post('/remove', auth.isAuthenticated(), function (req, res) {

    Category.findById(req.body.id, function (err, category) {
      category.remove();
      res.json(200);
    });

  });

};