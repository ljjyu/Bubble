const TempSubscriber = require('../models/tempSubscriber'); // 경로 확인
const nodemailer = require('nodemailer');

module.exports = {
    sendVerificationCode: async (req, res) => {
        try {
            const { email } = req.body;

            // 이메일 유효성 검사
            const tempSubscriber = await TempSubscriber.findOne({ where: { email } });

            if (!tempSubscriber) {
                return res.status(400).send('유효하지 않은 이메일입니다.');
            }

            // 인증 코드 생성
            const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6자리 인증 코드
            const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10분 유효

            // 인증 코드 업데이트
            await TempSubscriber.update({
                verificationCode,
                verificationExpires
            }, { where: { email } });

            // 이메일 발송 설정
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'your-email@gmail.com',
                    pass: 'your-email-password'
                }
            });

            const mailOptions = {
                from: 'your-email@gmail.com',
                to: email,
                subject: '인증 코드',
                text: `인증 코드: ${verificationCode}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).send('이메일 전송 오류');
                }
                res.status(200).send('인증 코드가 이메일로 전송되었습니다.');
            });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    verifyCode: async (req, res) => {
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

            // 인증 완료 후 TempSubscriber의 isVerified를 true로 설정
            await TempSubscriber.update(
                { isVerified: true },
                { where: { email } }
            );

            res.status(200).send('인증이 성공적으로 완료되었습니다.');
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    }
};










       










