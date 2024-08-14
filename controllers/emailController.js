const nodemailer = require('nodemailer');
const crypto = require('crypto');
const db = require('../models/index');
const Subscriber = db.subscriber;
const TempSubscriber = db.tempSubscriber;
const Branch = db.branch; // Branch 모델 추가
const Machine = db.machine; // Machine 모델 추가

// 이메일 주소와 비밀번호를 코드에 직접 설정합니다.
const EMAIL_USER = 'coin.bubblebubble@gmail.com';
const EMAIL_PASS = 'your-app-password'; // 생성한 앱 비밀번호를 입력하세요.

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

exports.sendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;
        const code = crypto.randomInt(100000, 999999); // 6자리 인증 코드
        const expiresAt = Date.now() + 15 * 60 * 1000; // 15분 후 만료

        // 임시 테이블에서 데이터베이스에 저장
        await TempSubscriber.update(
            { verificationCode: code, verificationExpires: expiresAt },
            { where: { email } }
        );

        await transporter.sendMail({
            from: EMAIL_USER,
            to: email,
            subject: '이메일 인증 코드',
            text: `인증 코드: ${code}`
        });

        res.status(200).send('인증 코드가 이메일로 전송되었습니다.');
    } catch (err) {
        console.error('sendVerificationCode 에러:', err);
        res.status(500).send({ message: '서버 오류가 발생했습니다.' });
    }
};

exports.verifyCode = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;

        const tempSubscriber = await TempSubscriber.findOne({ where: { email } });

        if (!tempSubscriber) {
            return res.status(400).send('유효하지 않은 이메일입니다.');
        }

        if (tempSubscriber.verificationCode !== parseInt(verificationCode, 10)) {
            return res.status(400).send('인증 코드가 일치하지 않습니다.');
        }

        if (Date.now() > tempSubscriber.verificationExpires) {
            return res.status(400).send('인증 코드가 만료되었습니다.');
        }

        // 인증 완료 후 메인 테이블에 사용자 정보 저장
        const newSubscriber = await Subscriber.create({
            name: tempSubscriber.name,
            email: tempSubscriber.email,
            password: tempSubscriber.password,
            role: tempSubscriber.role,
            phoneNumber: tempSubscriber.phoneNumber,
            cardNumber: tempSubscriber.cardNumber,
            branchName: tempSubscriber.branchName,
            address: tempSubscriber.address
        });

        if (newSubscriber.role === 'admin') {
            const newBranch = await Branch.create({
                branchName: newSubscriber.branchName,
                address: newSubscriber.address,
                manager: newSubscriber.email
            });

            const machines = [];
            for (let i = 1; i <= 4; i++) {
                machines.push({ type: 'washer', state: 'available', branchID: newBranch.branchID });
                machines.push({ type: 'dryer', state: 'available', branchID: newBranch.branchID });
            }
            await Machine.bulkCreate(machines);
        }

        // 임시 테이블에서 사용자 정보 삭제
        await TempSubscriber.destroy({ where: { email } });

        res.status(200).send('이메일 인증이 완료되었습니다.');
    } catch (err) {
        console.error('verifyCode 에러:', err);
        res.status(500).send({ message: '서버 오류가 발생했습니다.' });
    }
};












       










