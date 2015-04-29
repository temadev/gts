'use strict';

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var categoryModel = function () {

  var categorySchema = Schema({
    title: { type: String, required: true },
    url: { type: String, unique: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    content: String,
    image: String,
    seo: {
      title: String,
      keywords: String,
      description: String,
      content: String,
      canonical: String
    },
    hide: Boolean,
    created_at: Date,
    updated_at: Date
  });

  categorySchema.pre('save', function (next) {
    var category = this;

    if (!category.created) {
      category.created_at = Date.now();
    }
    category.updated_at = Date.now();

    //Continue with the save operation
    next();
  });

  return mongoose.model('Category', categorySchema);
};

module.exports = new categoryModel();