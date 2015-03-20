'use strict';


var Page = require('../../models/page')
  , async = require('async')
  , auth = require('../../lib/auth');


module.exports = function (router) {

  router.all('/*', function(req, res, next) {
    if (req.headers.host.match(/^www/) !== null ) {
      var host = 'http://' + req.headers.host.replace(/^www\./, '') + '/page' + req.url;
      res.redirect(301, host);
    } else {
      next();
    }
  });

  router.get('/:url', function (req, res, next) {

    var url = req.params.url;

    Page.findOne({ url: url })
      .exec(function (err, page) {
        if (!page) {
          next();
        }
        if (page) {
          res.render('page/index', { page: page });
        }
      });

  });


  router.get('/edit/:id', auth.isAuthenticated(), function (req, res) {

    var id = req.params.id;

    Page.findOne({ _id: id })
      .exec(function (err, page) {
        res.render('page/edit', { page: page });
      });

  });


  router.post('/edit', auth.isAuthenticated(), function (req, res) {

    var body = req.body;

    Page.findByIdAndUpdate(body.id, { $set: body }, function (err, page) {
      res.redirect('/page/' + page.url);
    });

  });


  router.get('/create', auth.isAuthenticated(), function (req, res) {

    res.render('page/create', new Page());

  });


  router.post('/create', auth.isAuthenticated(), function (req, res) {

    var body = req.body;

    var newPage = new Page(body);

    newPage.save(function (err, page) {
      res.redirect('/page/' + page.url);
    });

  });


  router.post('/remove', auth.isAuthenticated(), function (req, res) {

    Page.findById(req.body.id, function (err, page) {
      page.remove();
      res.json(200);
    });

  });

};