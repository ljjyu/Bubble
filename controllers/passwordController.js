const crypto = require('crypto');
const bcrypt = require('bcrypt');
const saltRounds = 10; // 해싱 라운드 수
const nodemailer = require('nodemailer');
const db = require('../models/index');
const Subscriber = db.subscriber; // 구독자 모델

// 비밀번호 재설정 이메일 전송
exports.sendResetEmail = async (req, res) => {
    const { resetEmail } = req.body;

    try {
        // 이메일이 데이터베이스에 존재하는지 확인
        const subscriber = await Subscriber.findOne({ where: { email: resetEmail } });

        if (!subscriber) {
            return res.status(404).json({ message: '해당 이메일로 가입된 계정이 없습니다.' });
        }

        // 기존 비밀번호 재설정 요청 무효화
        await Subscriber.update(
            { resetPasswordToken: null, resetPasswordExpires: null },
            { where: { email: resetEmail } }
        );

        // 비밀번호 재설정 토큰 생성
        const token = crypto.randomBytes(20).toString('hex');

        // 토큰과 만료일 저장 (예: 1시간 후 만료)
        await Subscriber.update(
            { resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 },
            { where: { email: resetEmail } }
        );

        // 비밀번호 재설정 링크 생성
        const resetUrl = `http://34.64.46.65/password/reset-password/${token}`;

        // 이메일 전송 설정
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'coin.bubblebubble@gmail.com',
                pass: 'oepq lqjc chdh hymn'
            }
        });

        const mailOptions = {
            to: resetEmail,
            from: 'coin.bubblebubble@gmail.com',
            subject: '비밀번호 재설정 요청',
            text: `비밀번호를 재설정하려면 다음 링크를 클릭하세요:\n` +
          `${resetUrl}\n\n` +
          `해당 링크는 1시간 동안만 유효합니다.`
        };

        // 이메일 전송
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: '이메일을 전송했습니다.' });
    } catch (error) {
        console.error('이메일 전송 오류:', error);
        res.status(500).json({ message: '이메일 전송 중 오류가 발생했습니다.' });
    }
};

// 비밀번호 재설정
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // 토큰과 만료일 확인
        const subscriber = await Subscriber.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [db.Sequelize.Op.gt]: Date.now() }
            }
        });

        if (!subscriber) {
            return res.status(400).json({ message: '비밀번호 재설정 링크가 유효하지 않거나 만료되었습니다.'});
        }

        // 새 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // 비밀번호 업데이트
        await Subscriber.update(
            { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null },
            { where: { email: subscriber.email } }
        );

        res.status(200).json({ message: '비밀번호가 성공적으로 재설정되었습니다.'});
    } catch (error) {
        console.error('비밀번호 재설정 오류:', error);
        res.status(500).json({ message: '비밀번호 재설정 중 오류가 발생했습니다.'});
    }
};

