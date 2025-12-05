const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleSignIn, refreshToken, logoutUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleSignIn);
router.post('/refresh', refreshToken);
router.post('/logout', logoutUser);

module.exports = router;
