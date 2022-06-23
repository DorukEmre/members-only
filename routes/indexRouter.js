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
  
// POST request to create a new message.
router.post("/newpost", index_controller.newpost);

// POST request to join the club.
router.post("/joinclub", index_controller.joinclub);

router.put('/...', (req, res) => {
})

router.delete('/...', (req, res) => {
})


module.exports = router;