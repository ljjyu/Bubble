const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

// 이메일 인증 코드 전송 요청 라우트
router.post('/send-verification-code', emailController.sendVerificationCode);

// 이메일 인증 코드 검증 라우트
router.post('/verify-code', emailController.verifyCode);

// 인증 페이지 렌더링 (기존 이메일 인증 폼을 포함할 수 있습니다)
router.get('/verification', (req, res) => {
    res.render('verification'); // verification.ejs 파일을 렌더링
});

module.exports = router;

