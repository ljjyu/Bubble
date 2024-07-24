const amqp = require('amqplib');
const RABBITMQ_URL = 'amqp://localhost'; // RabbitMQ 서버 URL
const QUEUE_NAME = 'inquiries';

const db = require("../models/index");
const Qna = db.qna,
    Branch = db.branch;

exports.saveQuestion = async (req, res) => {
    try {
        const { content, branchID } = req.body;
        const inquiry = { content, branchID, userEmail: req.session.user.email };

        await Qna.create(inquiry);

        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: false });

        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(inquiry)));
        console.log(" [x] Sent %s", inquiry);

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getUserInquiries = async (req, res) => {
    if (!req.session.user || !req.session.user.email) {
        return res.status(401).send('로그인 해주세요');
    }
    const userEmail = req.session.user.email;

    try {
        const inquiries = await Qna.findAll({ where: { userEmail } });
        const branches = await Branch.findAll();
        res.render('user/userQna', { inquiries, branches });
    } catch (error) {
        console.error('Error fetching user inquiries:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getAdminInquiries = async (req, res) => {
    if (!req.session.user || !req.session.user.email) {
        return res.status(401).send('로그인 해주세요');
    }
    const branchName = req.session.user.branchName;
    try {
        const branch = await Branch.findOne({ where: { branchName } });
        const inquiries = await Qna.findAll({ where: { branchID: branch.branchID } });
        const branches = await Branch.findAll();
        res.render('manager/getQna', { inquiries, branches });
    } catch (error) {
        console.error('Error fetching user inquiries:', error);
        res.status(500).send('Internal Server Error');
    }
};


// 답장 페이지 렌더링
exports.qnaReply = async (req, res) => {
    const { qnaNumber } = req.query;
    try {
        const inquiry = await Qna.findOne({ where: {qnaNumber}});
        res.render('manager/qnaReply', { qnaNumber, inquiry });
    } catch (err) {
        console.error('Error fetching inquiry:', error);
        res.status(500).send('Internal Server Error');
    }
};

// 답장 제출
exports.submitReply = async (req, res) => {
    const { qnaNumber, reply } = req.body;

    try {
        await Qna.update({ answer: reply }, { where: { qnaNumber } });

        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: false });

        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify({ qnaNumber, reply })));
        console.log(" [x] Sent %s", { qnaNumber, reply });

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};
