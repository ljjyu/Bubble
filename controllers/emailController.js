const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../models/index');
const Subscriber = db.subscriber; // 구독자 모델

// 이메일 전송을 위한 transporter 설정
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'coin.bubblebubble@gmail.com',  // 인증에 사용할 이메일 주소
        pass: 'oepq lqjc chdh hymn'     // 해당 이메일 계정의 비밀번호
    }
});

// 이메일 인증 코드 전송
exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    try {
        // 이메일이 데이터베이스에 존재하는지 확인
        const existingSubscriber = await Subscriber.findOne({ where: { email } });

        if (!existingSubscriber) {
            return res.status(404).json({ message: '회원가입된 이메일 주소가 아닙니다.' });
        }

        // 인증 코드 생성
        const verificationCode = crypto.randomBytes(4).toString('hex'); // 4바이트 길이의 코드

        // 인증 코드와 만료일 저장 (예: 1시간 후 만료)
        await Subscriber.update({
            verificationCode,
            verificationExpires: Date.now() + 3600000
        }, { where: { email } });

        // 인증 코드 전송 링크 생성
        const verificationUrl = `http://34.47.118.94/verification?code=${verificationCode}`;

        // 이메일 전송 설정
        const mailOptions = {
            to: email,
            from: 'coin.bubblebubble@gmail.com',
            subject: '이메일 인증 코드',
            text: `인증 코드를 입력하려면 다음 링크를 클릭하세요:\n` +
                `${verificationUrl}\n\n` +
                `해당 링크는 1시간 동안만 유효합니다.`
        };

        // 이메일 전송
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: '이메일 인증 코드가 전송되었습니다.' });
    } catch (error) {
        console.error('이메일 전송 오류:', error);
        res.status(500).json({ message: '이메일 전송 중 오류가 발생했습니다.' });
    }
};

// 이메일 인증 코드 확인
exports.verifyCode = async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        const subscriber = await Subscriber.findOne({
            where: {
                email,
                verificationCode,
                verificationExpires: { [db.Sequelize.Op.gt]: Date.now() }
            }
        });

        if (!subscriber) {
            return res.status(400).json({ message: '유효하지 않거나 만료된 인증 코드입니다.' });
        }

        // 이메일 인증 완료 처리
        await Subscriber.update(
            { isVerified: true },
            { where: { email } }
        );

        res.status(200).json({ message: '이메일 인증이 완료되었습니다.' });
    } catch (error) {
        console.error('인증 코드 확인 오류:', error);
        res.status(500).json({ message: '인증 코드 확인 중 오류가 발생했습니다.' });
    }
};







