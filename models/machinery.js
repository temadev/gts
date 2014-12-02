'use strict';

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var machineryModel = function () {

  var machinerySchema = Schema({
    title: { type: String, required: true },
    url: { type: String, unique: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    content: String,
    images: [String],
    price: Number,
    params: [
      {
        name: String,
        value: String
      }
    ],
    region: [
      {
        name: String,
        smena: { type: String, default: '4 часа' }
      }
    ],
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

  machinerySchema.pre('save', function (next) {
    var machinery = this;

    if (!machinery.created) {
      machinery.created_at = Date.now();
    }
    machinery.updated_at = Date.now();

    //Continue with the save operation
    next();
  });

  return mongoose.model('Machinery', machinerySchema);
};

module.exports = new machineryModel();