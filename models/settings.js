'use strict';

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var settingsModel = function () {

  var settingsSchema = Schema({
    title: String,
    type: String,
    value: String,
    created_at: Date,
    updated_at: Date
  });

  settingsSchema.pre('save', function (next) {
    var settings = this;

    if (!settings.created) {
      settings.created_at = Date.now();
    }
    settings.updated_at = Date.now();

    next();
  });

  return mongoose.model('Settings', settingsSchema);
};

module.exports = new settingsModel();