const path = require('path');
const express = require('express');
const usersController = require('../controllers/User');
const messageController = require('../controllers/chatapp');

const router = express.Router();

router.get('/sign-up', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'sign-up.html'));
});

router.post('/signup', usersController.signup);

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.post('/login', usersController.login);

router.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'chatapp.html'));
});

router.get('/messages', messageController.authenticateToken, messageController.getAllMessages);

router.post('/messages', messageController.authenticateToken, messageController.addMessage);

router.get('/create-group', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'group.html'));
});

router.post('/group', messageController.createGroup);

router.get('/group', messageController.getUserGroups);

router.get('/group/:groupId/messages', messageController.getGroupMessages);

router.post('/group/:groupId/messages', messageController.sendMessage);

module.exports = router; 