const RabbitmqWrapper = require("./rabbitMQ");
const db = require("../../models/index");
const { Op } = require("sequelize");

const url = "amqp://localhost";
const queue = "qna_chat";
const conn = new RabbitmqWrapper(url, queue);

const qnaChat = db.qnaChat;
const branch = db.branch;
const subscriber = db.subscriber;

module.exports = {
  // 메시지 보내기
  send_message: async (req, res) => {
    try {
      const { recipient, message, branchID } = req.body;
      const senderEmail = req.session.user.email;
      const userRole = req.session.user.role;
      const branchName = req.session.user.branchName;
      const branchRecord = await branch.findOne({ where: { branchName } });

      if (userRole === 'admin') {
        if (!recipient) {
          return res.status(400).json({ result: "error", message: "Receiver Email is required for admin." });
        }
        // 메시지를 RabbitMQ와 데이터베이스에 저장
        await conn.send_message({ msg: message, senderEmail, receiverEmail: recipient, branchID: branchRecord.branchID });
        try {
          await qnaChat.create({ chatting: message, senderEmail, receiverEmail: recipient, branchID: branchRecord.branchID });
          res.json({ result: "both" });
        } catch (dbErr) {
          console.error('Failed to save message to database:', dbErr);
          res.status(500).json({ result: "error", message: "Message saved to RabbitMQ, database save failed." });
        }

      } else if (userRole === 'user') {
        if (!branchID || !recipient) {
          return res.status(400).json({ result: "error", message: "Branch ID and Receiver Email are required for user." });
        }
        // 메시지를 RabbitMQ와 데이터베이스에 저장
        await conn.send_message({ msg: message, senderEmail, receiverEmail: recipient, branchID });
        try {
          await qnaChat.create({ chatting: message, senderEmail, receiverEmail: recipient, branchID });
          res.json({ result: "both" });
        } catch (dbErr) {
          console.error('Failed to save message to database:', dbErr);
          res.status(500).json({ result: "error", message: "Message saved to RabbitMQ, database save failed." });
        }
      } else {
        res.status(400).json({ result: "error", message: "Invalid user role." });
      }
    } catch (err) {
      console.error('Message sending failed:', err);
      res.status(500).json({ result: "error", message: "Message sending failed." });
    }
  },

  // 채팅 페이지 렌더링
  renderChatPage: async (req, res) => {
    try {
      const userSession = req.session.user.email;
      const userRole = req.session.user.role;
      const branchName = req.session.user.branchName;

      if (userRole === 'admin') {
        const branchRecord = await branch.findOne({ where: { branchName } });
        const branchID = branchRecord.branchID;
        const chatLogs = await qnaChat.findAll({ where: { branchID }, order: [['createdAt', 'ASC']] });
        const branches = await branch.findAll({ attributes: ['branchID', 'branchName'] });
        res.render('manager/getQnaChat', {
          chatLogs,
          branches,
          userRole,
          branchID,
          userEmail: userSession
        });
      } else {
        const chatLogs = await qnaChat.findAll({ where: { senderEmail: userSession }, order: [['createdAt', 'ASC']] });
        const branches = await branch.findAll({});
        res.render('user/userQnaChat', {
          chatLogs,
          branches,
          userRole
        });
      }
    } catch (err) {
      console.error('Error rendering chat page: ', err);
      res.status(500).send('Internal Server Error');
    }
  },

  // 맞춤 채팅 기록 불러오기
  getChatLogs: async (req, res) => {
    try {
      const userRole = req.session.user.role;
      let chatLogs;

      if (userRole === 'admin') {
        const branchName = req.session.user.branchName;
        const branchRecord = await branch.findOne({ where: { branchName } });
        const branchID = branchRecord.branchID;
        chatLogs = await qnaChat.findAll({ where: { branchID }, order: [['createdAt', 'ASC']] });
      } else {
        const { branchID } = req.query;
        if (!branchID) {
          throw new Error("Branch ID is required.");
        }
        chatLogs = await qnaChat.findAll({ where: { branchID }, order: [['createdAt', 'ASC']] });
      }

      res.json({ chatLogs });
    } catch (err) {
      console.error('Error fetching chat logs:', err);
      res.status(500).json({ result: "error", message: err.message });
    }
  },

  // 메시지 받기
  recv_message: async (req, res) => {
    try {
      const messages = [];
      await conn.setup();

      const consumeMessages = new Promise((resolve, reject) => {
        const startTime = Date.now();
        conn.channel.consume(queue, (msg) => {
          if (msg !== null) {
            messages.push(JSON.parse(msg.content.toString()));
            conn.channel.ack(msg);

            if (messages.length >= 100) {
              conn.channel.cancel(); // 소비 중지
              resolve(messages);
            }
          }

          if (Date.now() - startTime > 5000) {
            conn.channel.cancel(); // 소비 중지
            resolve(messages);
          }
        }, { noAck: false });
      });

      const resultMessages = await consumeMessages;
      res.json({ messages: resultMessages });
    } catch (err) {
      console.error('Error receiving message:', err);
      res.status(500).json({ result: 'error' });
    }
  },

  // 관리자 이메일 반환
  getManagerEmail: async (req, res) => {
    try {
      const { branchID } = req.query;
      const branchRecord = await branch.findOne({ where: { branchID }});
      const branchName = branchRecord.branchName;
      const subscriberRecord = await subscriber.findOne({ where: { branchName, role: 'admin' }});
      res.json({ managerEmail: subscriberRecord.email });
    } catch (err) {
      console.error('Error fetching manager email:', err);
      res.status(500).json({ result: "error", message: "Failed to fetch manager email." });
    }
  }
};
