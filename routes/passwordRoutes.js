const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');
const changepwController = require('../controllers/changepwController');

// 비밀번호 재설정 이메일 전송 라우트
router.post('/send-reset-email', passwordController.sendResetEmail);

// 비밀번호 재설정 라우트
router.post('/reset-password/:token', passwordController.resetPassword);

// 비밀번호 재설정 페이지 렌더링
router.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    res.render('resetPassword', { token });
});


// 마이페이지-비밀번호 변경
router.post("/", changepwController.changePassword);

module.exports = router;

