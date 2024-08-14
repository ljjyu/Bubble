const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('../models/index');
const Subscriber = db.subscriber;
const TempSubscriber = db.tempSubscriber;
const Branch = db.branch;
const Machine = db.machine;

async function saveSubscriber(req, res) {
    try {
        const { name, email, password, role, phoneNumber, cardNumber, branchName, address } = req.body;

        // TempSubscriber에서 사용자 정보 조회
        const tempSubscriber = await TempSubscriber.findOne({ where: { email } });

        if (!tempSubscriber) {
            return res.status(400).send({ message: "유효하지 않은 이메일 주소입니다." });
        }

        if (!tempSubscriber.isVerified) {
            return res.status(400).send({ message: "이메일 인증을 완료해야 합니다." });
        }

        const existingSubscriber = await Subscriber.findOne({ where: { email } });

        if (existingSubscriber) {
            return res.status(400).send({ message: "이미 등록된 이메일 주소입니다." });
        }

        if (password.length < 8) {
            return res.status(400).send({ message: "비밀번호는 8자리 이상이어야 합니다." });
        }

        if (role === 'admin' && (!branchName || !address)) {
            return res.status(400).send({ message: "관리자 역할을 선택하셨습니다. 지점명과 주소를 입력해 주세요." });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // TempSubscriber에서 사용자 정보 가져와 Subscriber로 저장
        await Subscriber.create({
            name,
            email,
            password: hashedPassword,
            role,
            phoneNumber,
            cardNumber,
            branchName: role === 'admin' ? branchName : null,
            address: role === 'admin' ? address : null
        });

        // TempSubscriber에서 해당 사용자 정보 삭제
        await TempSubscriber.destroy({ where: { email } });

        res.status(200).send('회원가입이 완료되었습니다.');
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

module.exports = {
    saveSubscriber
};












