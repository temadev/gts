'use strict';

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var pageModal = function () {

  var pageModal = Schema({
    title: { type: String, required: true },
    url: { type: String, unique: true },
    content: String,
    seo: {
      title: String,
      keywords: String,
      description: String,
      content: String,
      canonical: String
    },
    created_at: Date,
    updated_at: Date,
    status: Boolean
  });

  pageModal.pre('save', function (next) {
    var page = this;

    if (!page.created) {
      page.created_at = Date.now();
    }
    page.updated_at = Date.now();

    //Continue with the save operation
    next();
  });

  return mongoose.model('Page', pageModal);
};

module.exports = new pageModal();