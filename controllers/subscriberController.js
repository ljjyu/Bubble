const db = require("../models/index"),
    Subscriber = db.subscriber,
    Branch = db.branch,
    Machine = db.machine,
    Op = db.Sequelize.Op,
    bcrypt = require('bcrypt'),
    saltRounds = 10;

exports.getAllSubscribers = async (req, res) => {
    try {
        data = await Subscriber.findAll();
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
// 넘겨받은 POST 데이터 저장 및 처리
exports.saveSubscriber = async (req, res) => {
    try {
        const { name, email, password, role, phoneNumber, cardNumber, branchName, address } = req.body;
        const existingSubscriber = await Subscriber.findOne({where: { email: email }});
        let existingBranchName;
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
        if (role === 'admin' && (!branchName || !address)) {
            return res.status(400).send({
                message: "관리자 역할을 선택하셨습니다. 지점명과 주소를 입력해 주세요."
            });
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds); // 비밀번호 해싱
        // 새로운 지점 생성
        if (role === 'admin') {
            const [existingBranch, newBranch] = await Promise.all([ // 병렬 처리
                branchName ? Subscriber.findOne({ where: { branchName: branchName } }) : null,
                Branch.create({
                    branchName: branchName,
                    address: address,
                    manager: email
                })
            ]);
            if (existingBranch) {
                return res.status(400).send({
                    message: "이미 등록된 지점명입니다."
                });
            }
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

         res.redirect("/");
    } catch (err) {
        return res.status(500).send({
            message: err.message
        });
    }
};
