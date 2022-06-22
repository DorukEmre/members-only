const express = require('express');
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const Message = require('../models/Message');
const User = require('../models/User')

router.get('/',(req, res) => {
  Message
    .find()
    .exec((err, results) => {
      if (err) next(err); 
      res.render('index', { title: 'Home', error: err, data: results });
  })
})
router.get("/log-out", (req, res) => {
  req.logout(function (err) {
    if (err) next(err); 
    res.redirect("/");
  });
});

router.post("/signup", (req, res, next) => {
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
        res.redirect("/");
      });
  });
});

router.post("/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

router.post("/newpost",(req, res, next) => {

});

router.post("/joinclub",(req, res, next) => {

});

router.put('/...', (request, response) => {
})

router.delete('/...', (request, response) => {
})


module.exports = router;