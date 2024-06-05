const express = require('express');
const router = express.Router();

router.get('/getmachine', (req, res, next) => {
    req.flash("info", "관리자 페이지에 오신 것을 환영합니다.");
    res.end();
});

module.exports = router;