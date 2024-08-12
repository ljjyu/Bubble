const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('../models/index');
const Subscriber = db.subscriber;
const Branch = db.branch;
const Machine = db.machine;
const emailController = require('./emailController'); // 이메일 인증 기능을 가져옵니다.

exports.getAllSubscribers = async (req, res) => {
    try {
        const data = await Subscriber.findAll();
        res.render("subscribers/getSubscriber", { subscribers: data });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getSubscriptionPage = (req, res) => {
    res.render("subscribers/subscriber");
};

exports.saveSubscriber = async (req, res) => {
    try {
        const { name, email, password, role, phoneNumber, cardNumber, branchName, address, verificationCode } = req.body;

        // 인증 코드 검증
        const subscriber = await Subscriber.findOne({ where: { email } });
        if (subscriber && subscriber.verificationCode === parseInt(verificationCode, 10) && Date.now() <= subscriber.verificationExpires) {
            // 인증 코드가 유효하면, 비밀번호를 해시하고 회원가입을 진행합니다.
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            if (role === 'admin') {
                if (!branchName || !address) {
                    return res.status(400).send({ message: "관리자 역할을 선택하셨습니다. 지점명과 주소를 입력해 주세요." });
                }

                const existingBranch = await Branch.findOne({ where: { branchName } });
                if (existingBranch) {
                    return res.status(400).send({ message: "이미 등록된 지점명입니다." });
                }

                const newBranch = await Branch.create({
                    branchName,
                    address,
                    manager: email
                });

                const machines = [];
                for (let i = 1; i <= 4; i++) {
                    machines.push({ type: 'washer', state: 'available', branchID: newBranch.branchID });
                    machines.push({ type: 'dryer', state: 'available', branchID: newBranch.branchID });
                }
                await Machine.bulkCreate(machines);
            }

            await Subscriber.create({
                name,
                email,
                password: hashedPassword,
                role,
                phoneNumber,
                cardNumber,
                branchName: role === 'admin' ? branchName : null,
                address: role === 'admin' ? address : null,
                verified: true
            });

            // 인증 코드와 만료 시간 초기화
            await Subscriber.update(
                { verificationCode: null, verificationExpires: null },
                { where: { email } }
            );

            res.send("회원가입이 완료되었습니다.");
        } else {
            res.status(400).send('유효하지 않거나 만료된 인증 코드입니다.');
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};







