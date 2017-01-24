'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Website Schema
 */
var WebsiteSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  url: {
    type: String,
    required: 'URL cannot be blank',
    unique: true
  },
  checks: {
    type: Number,
    default: 1
  },
  lastChecked: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Website', WebsiteSchema);
