'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * WebsiteCheck Schema
 */
var WebsiteCheckSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  url: String,
  stats: {
    resourceNumber: Number,
    totalSize: Number,
    totalTime: Number,
    slowestRequest: Number,
    fastestRequest: Number,
    avgTime: String
  },
  resources: [
    {
      resourceNumber: Number,
      url: String,
      path: String,
      latency: Number,
      time: Number,
      size: Number,
      resourceType: String,
      speed: String
    }
  ]
});

mongoose.model('WebsiteCheck', WebsiteCheckSchema);
