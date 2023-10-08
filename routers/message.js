const express = require('express');
const { createMessage } = require('../controllers/message');
const { authenticate } = require('../controllers/middlewares/auth');
const router = express.Router();
router.post("/create-message", authenticate, createMessage);
module.exports.messageRouter = router;
