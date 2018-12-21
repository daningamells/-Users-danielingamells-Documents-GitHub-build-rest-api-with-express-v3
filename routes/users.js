"use strict";

const express = require("express");
const router = express.Router();

const mid = require('../middleware/index');
const User = require("../models/user");

// GET /api/users
// returns authenticated user
router.get('/', mid.headerAuthentication, (req, res, next) => {
    User.findById(req.session.userId)
    .exec( function(error, user){
      if(error){
          //If there was an error, send it back to the user
          let err = new Error('Unfortunately, the user could not be found');
          //Should it be 404?
          err.status = 404;
          return next(err);
      } else {
          //If not, then send back the currently authenticated user
          return res.json(user);
      }
    });
});

// POST /api/users
// creates a new user
router.post('/', (req, res, next) => {
    if(req.body.emailAddress && req.body.password && req.body.fullName){
        User.create({
            fullName: req.body.fullName,
            emailAddress: req.body.emailAddress,
            password: req.body.password
        }, function(error, user){
            if(error){
                error.status = 400;
                return next(error);
            }
            res.redirect(201, '/');
        });
    } else {
      let error = new Error('Email, password, and full name are all mandatory')
      error.status = 400;
      return next(error);
    }
})

module.exports = router;
