const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('../models/index');
const Subscriber = db.subscriber;
const Branch = db.branch;
const Machine = db.machine;
const Op = db.Sequelize.Op;

// 모든 구독자 조회
exports.getAllSubscribers = async (req, res) => {
    try {
        const data = await Subscriber.findAll();
        res.render("subscribers/getSubscriber", { subscribers: data });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// 회원가입 페이지 렌더링
exports.getSubscriptionPage = (req, res) => {
    res.render("subscribers/subscriber");
};

// 회원가입 처리
exports.saveSubscriber = async (req, res) => {
    try {
        const { name, email, password, role, phoneNumber, cardNumber, branchName, address } = req.body;

        // 이메일 중복 확인
        const existingSubscriber = await Subscriber.findOne({ where: { email } });

        // 이메일 인증이 필요한 경우 처리
        if (existingSubscriber && !existingSubscriber.isVerified) {
            return res.status(400).send({ message: "이메일 인증이 필요합니다." });
        }

        // 이메일이 이미 등록된 경우 처리
        if (existingSubscriber && existingSubscriber.password) {
            return res.status(400).send({ message: "이미 등록된 이메일 주소입니다." });
        }

        // 비밀번호 길이 확인
        if (password.length < 8) {
            return res.status(400).send({ message: "비밀번호는 8자리 이상이어야 합니다." });
        }

        // 관리자 역할일 때 지점명과 주소 확인
        if (role === 'admin' && (!branchName || !address)) {
            return res.status(400).send({ message: "관리자 역할을 선택하셨습니다. 지점명과 주소를 입력해 주세요." });
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        if (role === 'admin') {
            // 지점명 중복 확인
            const existingBranch = await Branch.findOne({ where: { branchName } });
            if (existingBranch) {
                return res.status(400).send({ message: "이미 등록된 지점명입니다." });
            }

            // 새 지점 생성
            const newBranch = await Branch.create({
                branchName,
                address,
                manager: email
            });

            // 기계 추가
            const machines = [];
            for (let i = 1; i <= 4; i++) {
                machines.push({ type: 'washer', state: 'available', branchID: newBranch.branchID });
                machines.push({ type: 'dryer', state: 'available', branchID: newBranch.branchID });
            }
            await Machine.bulkCreate(machines);
        }

        // 구독자 정보 업데이트
        await Subscriber.upsert({
            name,
            email,
            password: hashedPassword,
            role,
            phoneNumber,
            cardNumber,
            branchName: role === 'admin' ? branchName : null,
            address: role === 'admin' ? address : null,
        });

        res.redirect("/");
    } catch (err) {
        console.error('회원가입 처리 중 오류 발생:', err);
        res.status(500).send({ message: err.message });
    }
};




