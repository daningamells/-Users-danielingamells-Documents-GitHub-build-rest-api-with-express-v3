'use strict';

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ReviewSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    postedOn: {
      createdAt: {
        type: Date,
        default: Date.now
      }
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: {
      type: String,
    }
});

var Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;
