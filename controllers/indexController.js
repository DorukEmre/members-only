const passport = require("passport");
const bcrypt = require("bcryptjs");

const User = require('../models/User');
const Message = require('../models/Message');

exports.home = (req, res) => {
  Message
    .find()
    .exec((err, results) => {
      if (err) next(err); 
      res.render('index', { title: 'Home', error: err, data: results });
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
          lastName: req.body.lastname,
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