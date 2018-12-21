"use strict";

const express = require("express");
const router = express.Router();

const mid = require('../middleware/index');

const Course = require("../models/course");
const Review = require("../models/review");

// GET /api/courses
// returns all courses
router.get('/', (req, res, next) => {
  Course.find({},{ _id: 1, title: 1 }, (error, courses) => {
    if (error) {
    error.state = 404;
    return next(error);
  } else {
    res.json(courses);
    res.status(200);
    }
  });
});

// GET /api/courses/:courseId
// returns a single course based on params.courseId
router.get('/:courseId', (req, res, next) => {
  const courseId = req.params.courseId;
  Course.findById(courseId)
  .populate('user', 'fullName')
  .populate({ path: 'reviews', model: Review })
  .exec(function (error, course) {
    if (error) {
      return next(error);
    } else {
      res.json(course);
      res.status(200);
    }
  });
});

// POST /api/courses/
// creates a new course (if user is authenticated)
router.post('/', mid.headerAuthentication, (req, res, next) => {
 if (req.body.title && req.body.description) {
   let estimatedTime = req.body.estimatedTime;
   if(estimatedTime === undefined){
       estimatedTime = '';
   }
   let materialsNeeded = req.body.materialsNeeded;
   if(materialsNeeded === undefined){
       materialsNeeded = '';
   }
   //Creating the course based on submitted data
   Course.create({
        user: req.session.userId,
        title: req.body.title,
        description: req.body.description,
        estimatedTime: estimatedTime,
        materialsNeeded: materialsNeeded
   }, function(error, course){
       //If there is an error handle it
       if(error){
           error.status = 400;
           return next(error);
       }
       //Reset the location header, and return no content
       res.redirect('/', 201);
   });
 } else {
   const error = new Error('Title and description are required');
   error.status = 401;
   return next(error);
 }
});

// PUT /api/courses/:courseId
// updates a given course (if user is authenticated)
router.put('/:courseId', mid.headerAuthentication, (req, res, next) => {
  const courseId = req.params.courseId;
  Course.findById(courseId, (error, course) => {
    if (!course) {
      const error = new Error('Sorry we can not find that course');
      error.status = 400;
      return next(error);
    } else {
      console.log(req.body);
      course.set(req.body);
      course.save(function(error, updatedCourse){
        if(error){
            error.status = 400;
            return next(error);
          }
        return res.status(204).send();
      });
    }
  });
});

// POST /api/courses/:courseId/reviews
// creates a new course review (if user is authenticated)
router.post('/:courseId/reviews', mid.headerAuthentication, (req, res, next) => {
  const courseId = req.params.courseId;
  let desc = req.body.review;
  if(desc === undefined){
      desc = '';
  }
  Course.findById(courseId, (error, course) => {
    if (!course) {
      const error = new Error('Sorry we can not find that course');
      error.status = 400;
      return next(error);
    } else if (course.user._id.equals(req.session.userId)) {
        let err = new Error('User who created this course cannot review it');
        err.status = 400;
        return next(err);
    } else {
      Review.create({
        rating: req.body.rating,
        review: desc
      }, (error, review) => {
        if(error){
          return next(error);
        } else {
          let courseReviews = course.reviews;
          console.log(courseReviews);
          courseReviews.push(review._id);
          course.save(function(error, updatedCourse){
            if(error){
            return next(error);
          }
            res.redirect(`/api/courses/${updatedCourse._id}`, 201);
          })
        }
      });
    }
  });
});

module.exports = router;
