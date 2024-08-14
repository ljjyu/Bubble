const db = require("../models/index"),
    bcrypt = require('bcrypt'),
    nodemailer = require('nodemailer'),
    crypto = require('crypto'),
    Subscriber = db.subscriber,
    Branch = db.branch,
    Machine = db.machine,
    Op = db.Sequelize.Op,
    saltRounds = 10;

exports.getAllSubscribers = async (req, res) => {
    try {
        const data = await Subscriber.findAll();
        res.render("subscribers/getSubscriber", {subscribers: data});
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};
// 폼 입력이 가능한 웹 페이지 렌더링
exports.getSubscriptionPage = (req, res) => {
    res.render("subscribers/subscriber");
};
const EMAIL_USER = 'coin.bubblebubble@gmail.com';
const EMAIL_PASS = 'oepq lqjc chdh hymn';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});
// 이메일 인증 코드 생성
const generateAuthCode = () => {
    return crypto.randomBytes(3).toString('hex');  // 6자리 인증 코드 생성
};
// 인증 코드를 담을 메모리 저장소
let authCodes = {};
// 이메일 인증 코드 전송
exports.sendAuthCode = async (req, res) => {
    const { email } = req.body;
    const authCode = generateAuthCode();

    authCodes[email] = authCode;

    const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: '이메일 인증 코드',
        text: `이메일 인증 코드: ${authCode}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send({ message: '이메일 전송에 실패했습니다.' });
        } else {
            return res.status(200).send({ message: '인증 코드가 이메일로 전송되었습니다.' });
        }
    });
};
// 넘겨받은 POST 데이터 저장 및 처리
exports.saveSubscriber = async (req, res) => {
    try {
        const { name, email, password, role, phoneNumber, cardNumber, branchName, address, authCode } = req.body;
        const existingSubscriber = await Subscriber.findOne({where: { email: email }});
        // 이메일 인증 코드 확인
        if (!authCodes[email] || authCodes[email] !== authCode) {
            return res.status(400).send({
                message: "인증 코드가 올바르지 않습니다."
            });
        }
        if (existingSubscriber) {
            return res.status(400).send({
                message: "이미 등록된 이메일 주소입니다."
            });
        }
        if (password.length<8) {
            return res.status(400).send({
                message: "비밀번호는 8자리 이상이어야 합니다."
            });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds); // 비밀번호 해싱
        // 새로운 지점 생성
        let newBranch;
        // 새로운 지점 생성
        if (role === 'admin') {
            if (!branchName || !address) {
                return res.status(400).send({
                    message: "지점명과 지점주소를 입력해 주세요."
                });
            }
            if (existingBranch) {
                return res.status(400).send({
                    message: "이미 등록된 지점명입니다."
                });
            }
            const [existingBranch, createdBranch] = await Promise.all([
                branchName ? Subscriber.findOne({ where: { branchName: branchName } }) : null,
                Branch.create({
                    branchName: branchName,
                    address: address,
                    manager: email
                })
            ]);

            newBranch = createdBranch;
            // 세탁기와 건조기 생성 및 저장 (각각 4개씩)
            const machines = [];
            for (let i = 1; i <= 4; i++) {
                machines.push({ type: 'washer', state: 'available', branchID: newBranch.branchID });
                machines.push({ type: 'dryer', state: 'available', branchID: newBranch.branchID });
            }
            await Machine.bulkCreate(machines);
        }

         await Subscriber.create({
             name: name,
             email: email,
             password: hashedPassword,
             role: role,
		     phoneNumber: phoneNumber,
             cardNumber: cardNumber,
             branchName: role === 'admin' ? branchName : null,
             address: role === 'admin' ? address : null
         });
         // 이메일 인증 코드 제거
         delete authCodes[email];

         res.redirect("/");
    } catch (err) {
        return res.status(500).send({
            message: err.message
        });
    }
};
