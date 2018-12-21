const auth = require('basic-auth');
const User = require("../models/user");

// middleware using basic-auth to authenticate headers fron postman
function headerAuthentication(req, res, next){
    const user = auth(req);
    if(user){
        const emailAddress = user.name;
        const password = user.pass;
        if(emailAddress && password){
            User.authenticate(emailAddress, password, function(error, user){
              if(error || !user){
                  let err = new Error('Invalid credentials')
                  err.status = 401;
                  return next(err);
              }
              req.session.userId = user._id;
              return next();
            })
        } else {
            const error = new Error('Both email and password are required');
            error.status = 403;
            return next(error);
        }
    } else {
    const error = new Error('Could not validate user');
    error.status = 403;
    return next(error);
  }
}

module.exports.headerAuthentication = headerAuthentication
