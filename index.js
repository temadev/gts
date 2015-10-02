'use strict';

require('dotenv').load();

var kraken = require('kraken-js'),
  app = require('express')(),
  options = require('./lib/spec')(app),
  port = process.env.PORT || 5550;


app.use(kraken(options));


app.listen(port, function (err) {
  console.log('[' + app.settings.env + '] Listening on ' + process.env.HOSTNAME);
});