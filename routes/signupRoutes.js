const express = require('express');
const router = express.Router();
const { signupUser } = require('../controllers/signupController');

router.post('/', signupUser);

module.exports = router;
