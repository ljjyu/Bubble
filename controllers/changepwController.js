"use strict";

const bcrypt = require('bcrypt');
const db = require("../models/index");
const Subscriber = db.subscriber;

exports.changePassword = async (req, res) => {
    try {
        const { currentPw, newPw } = req.body;
        const userEmail = req.session.user.email;

        // 사용자의 이메일로 DB에서 사용자 정보 찾기
        const user = await Subscriber.findOne({ where: { email: userEmail } });

        if (!user) {
            return res.json({ success: false, message: "사용자를 찾을 수 없습니다." });
        }

        // 현재 비밀번호 확인
        const isMatch = await bcrypt.compare(currentPw, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "현재 비밀번호가 일치하지 않습니다." });
        }

        // 새 비밀번호 해싱
        const hashedNewPw = await bcrypt.hash(newPw, 10);

        // 비밀번호 업데이트
        user.password = hashedNewPw;
        await user.save();

        return res.json({ success: true, message: "비밀번호가 변경되었습니다." });

    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "비밀번호 변경 중 오류가 발생했습니다." });
    }
};

