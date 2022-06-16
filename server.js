const express = require('express')
const bcrypt = require("bcryptjs");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require('dotenv').config()
const PORT = 2200


const mongoDb = process.env.DB_STRING;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
// Check if connection to db has succeeded
// '.once' means event called only once (first time the when the mongoose connection is opened)
// '.on' means the event will be called every time it occurs
db.once('open', _ => {
  console.log('Connected to database on MongoDB')
})
db.on("error", console.error.bind(console, "mongo connection error"));


const User = mongoose.model(
    "User",
    new Schema({
        username: { type: String, required: true },
        password: { type: String, required: true }
    })
);

passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) { 
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              // passwords match! log user in
              return done(null, user)
            } else {
              // passwords do not match!
              return done(null, false, { message: "Incorrect password" })
            }
        });
      });
    })
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});
    
const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.get('/',(request, response) => {
    db.collection('posts').find().toArray()
    .then(data => {
        response.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
})
app.get("/login", (req, res) => res.render("login"));
app.get("/signup", (req, res) => res.render("signup"));
app.get("/log-out", (req, res) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
});

app.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        // if err, do something
        // otherwise, store hashedPassword in DB
        if (err) {
            return next(err);
        }
        const user = new User({
            username: req.body.username,
            password: hashedPassword
        }).save(err => {
        if (err) { 
            return next(err);
        }
        res.redirect("/");
        });
    });
});

app.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/"
    })
);


app.put('/...', (request, response) => {
})

app.delete('/...', (request, response) => {
})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT} http://localhost:${PORT}/`)
})