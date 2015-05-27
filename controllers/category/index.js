'use strict';


var Category = require('../../models/category')
  , Machinery = require('../../models/machinery')
  , async = require('async')
  , auth = require('../../lib/auth');


module.exports = function (router) {

  router.all('/*', function(req, res, next) {
    if (req.headers.host.match(/^www/) !== null ) {
      var host = 'http://' + req.headers.host.replace(/^www\./, '') + '/category' + req.url;
      res.redirect(301, host);
    } else {
      next();
    }
  });

  router.get('/:url', function (req, res, next) {

    var url = req.params.url;

    Category.findOne({ url: url, hide: {'$ne': true} })
      .populate('category', 'title url')
      .exec(function (err, category) {
        if (!category) {
          next();
        }
        if (category) {
          Machinery.find({category: category, hide: {'$ne': true}})
            .sort({'sort': 1})
            .exec(function (err, machinery) {
              res.render('category/index', { category: category, machinery: machinery, url: '/category/' + url });
            });
        }
      });

  });


  router.get('/edit/:id', auth.isAuthenticated(), function (req, res) {

    var id = req.params.id;

    Category.findOne({ _id: id })
      .exec(function (err, category) {

        Category.find({category: {$exists: false}})
          .exec(function (err, categories) {
            res.render('category/edit', { category: category, categories: categories });
          });
      });
  });


  router.post('/edit', auth.isAuthenticated(), function (req, res) {

    var body = req.body;

    body.url = body.url.trim();
    body.hide = body.hide?true:false;

    Category.findByIdAndUpdate(body.id, { $set: body }, function (err, category) {
      res.redirect('/category/' + category.url);
    });

  });


  router.get('/create', auth.isAuthenticated(), function (req, res) {

    Category.find({category: {$exists: false}})
      .exec(function (err, categories) {
        res.render('category/create', {categories: categories});
      });

  });


  router.post('/create', auth.isAuthenticated(), function (req, res) {

    var body = req.body;

    body.url = body.url.trim();

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