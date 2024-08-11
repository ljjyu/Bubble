const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.post('/send-verification-code', emailController.sendVerificationCode);
router.post('/verify-code', emailController.verifyCode);

module.exports = router;





