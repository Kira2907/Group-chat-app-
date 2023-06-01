const path = require('path');
const express = require('express');
const usersController = require('../controllers/User');
const router = express.Router();

router.get('/sign-up', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'sign-up.html'));
 });

router.post('/signup', usersController.signup);

module.exports = router;
