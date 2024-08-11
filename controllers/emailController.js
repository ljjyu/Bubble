const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../models/index');
const Subscriber = db.subscriber;

// 이메일로 인증 코드 전송
exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    try {
        // 이메일이 데이터베이스에 존재하는지 확인
        const subscriber = await Subscriber.findOne({ where: { email } });

        if (!subscriber) {
            return res.status(404).json({ message: '해당 이메일로 가입된 계정이 없습니다.' });
        }

        // 인증 코드 생성
        const code = crypto.randomBytes(3).toString('hex').toUpperCase();

        // 인증 코드와 만료일 저장
        await Subscriber.update(
            { verificationCode: code, isVerified: false },
            { where: { email } }
        );

        // 이메일 전송 설정
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password'
            }
        });

        const mailOptions = {
            to: email,
            from: 'your-email@gmail.com',
            subject: '이메일 인증 코드',
            text: `이메일 인증 코드는 다음과 같습니다: ${code}`
        };

        // 이메일 전송
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: '인증 코드가 이메일로 전송되었습니다.' });
    } catch (error) {
        console.error('이메일 전송 오류:', error);
        res.status(500).json({ message: '이메일 전송 중 오류가 발생했습니다.' });
    }
};

// 이메일 인증 코드 검증
exports.verifyCode = async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        // 이메일과 인증 코드 확인
        const subscriber = await Subscriber.findOne({
            where: {
                email,
                verificationCode,
                isVerified: false
            }
        });

        if (!subscriber) {
            return res.status(400).json({ message: '인증 코드가 유효하지 않거나 이메일이 확인되지 않았습니다.' });
        }

        // 인증 완료 및 인증 코드 삭제
        await Subscriber.update(
            { isVerified: true, verificationCode: null },
            { where: { email } }
        );

        res.status(200).json({ message: '인증이 성공적으로 완료되었습니다.' });
    } catch (error) {
        console.error('인증 오류:', error);
        res.status(500).json({ message: '인증 중 오류가 발생했습니다.' });
    }
};

