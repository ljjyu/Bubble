const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');

// 비밀번호 재설정 이메일 전송 라우트
router.post('/send-reset-email', passwordController.sendResetEmail);

// 비밀번호 재설정 라우트
router.post('/reset-password/:token', passwordController.resetPassword);

// 비밀번호 재설정 페이지 렌더링
router.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    res.render('resetPassword', { token });
});

module.exports = router;

