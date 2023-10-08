const express = require('express');
const { authenticate } = require('../controllers/middlewares/auth');
const { createUser, getLoggedInUser, loginUser, logoutUser, getUserByPhone } = require('../controllers/user');
const router = express.Router();

router.post("/create-user", createUser);
router.post("/login-user", loginUser);
router.get("/logout-user", logoutUser);
router.get("/get-logged-in-user", authenticate, getLoggedInUser);
router.get("/get-user-by-phone/:phone", authenticate, getUserByPhone);

module.exports.userRouter = router;