const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User')

const index_controller = require('../controllers/indexController');


/* GET home page. */
router.get('/', index_controller.home);

// GET request to log-out.
router.get("/log-out", index_controller.logout);

// POST request to sign-up.
router.post("/signup", index_controller.signup);

// POST request to log-in.
router.post("/login", index_controller.login);
  

router.post("/newpost",(req, res, next) => {

});

router.post("/joinclub",(req, res, next) => {

});

router.put('/...', (request, response) => {
})

router.delete('/...', (request, response) => {
})


module.exports = router;