const express = require('express')
const session = require("express-session");
const passport = require("passport");
const bodyParser= require('body-parser')
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const compression = require('compression');
const helmet = require('helmet');

const { format, differenceInMinutes, differenceInHours, differenceInDays } = require('date-fns')

require('dotenv').config()
const PORT = 2200

require('./passport'); //passport.js

const indexRouter = require('./routes/indexRouter');

const mongoDb = process.env.DB_STRING;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
// Check if connection to db has succeeded
// '.once' means event called only once (first time the when the mongoose connection is opened)
// '.on' means the event will be called every time it occurs
db.once('open', _ => {
  console.log('Connected to database on MongoDB')
})
db.on("error", console.error.bind(console, "MongoDB connection error:"));

    
const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(compression()); //Compress all routes
app.use(helmet());

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
// Set date-fns variables to a local available to all scripts in any EJS page
app.locals.format = format;
app.locals.differenceInDays = differenceInDays;
app.locals.differenceInHours = differenceInHours;
app.locals.differenceInMinutes = differenceInMinutes;

app.use('/', indexRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  // res.render("error", { title: "Error", error: error.array() })
});

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT} http://localhost:${PORT}/`)
})

module.exports = app;