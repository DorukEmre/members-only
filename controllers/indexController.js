const passport = require("passport");
const bcrypt = require("bcryptjs");
const { body,validationResult } = require('express-validator');

const User = require('../models/User');
const Message = require('../models/Message');

exports.home = (req, res) => {
  Message
    .find()
    .sort({ timestamp: -1 })
    .populate('author')
    .exec((err, results) => {
      if (err) next(err); 
      res.render('index', { title: 'Home', error: err, messages: results });
  })
}

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) next(err); 
    res.redirect("/");
  });
};

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      // if err, do something
      // otherwise, store hashedPassword in DB
      if (err) next(err); 
      const user = new User({
          username: req.body.username,
          firstName: req.body.firstname,
          password: hashedPassword
      }).save(err => {
        if (err) next(err); 
        res.redirect("/#login");
      });
  });
}

exports.login = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/"
})

exports.newpost_get = (req, res, next) => {
  if (req.user) {
    res.render('newpost', { title: 'Add a new post' });
  } else {    
    res.redirect("/#login");
  }
}

exports.newpost_post = [
  // Validate and sanitize fields.
  body('title', 'Post title must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('message', 'Message invalid.').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => { 
    // Extract the validation errors from a request.
    // const errors = validationResult(req);

    const message = new Message({
      title: req.body.title,
      author: req.user,
      timestamp: new Date(),    
      content: req.body.message    
    })
    
    message.save((err) => {
      if (err) { return next(err); }
        // Message saved. Redirect to home page.
        res.redirect('/');
      });
  }
]

exports.joinclub_get = (req, res, next) => {
  if (req.user) {
    res.render('joinclub', { title: 'Join the club' });
  } else {    
    res.redirect("/#login");
  }
}

exports.joinclub_post = (req, res, next) => {
  if (req.body.clubPasscode === process.env.PASSCODE) {
    User
      .findByIdAndUpdate(
          req.user.id, 
          { membershipStatus: true },
          function (err, docs) {
            if (err) next(err)
          });          
    res.redirect('/');
  } else {
    res.render('joinclub', { title: 'Join the club', message: 'Wrong passcode entry' });
  }
}