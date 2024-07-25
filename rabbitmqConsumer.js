const amqp = require('amqplib');
const db = require('./models/index');
const Report = db.Report;

const consumeFromQueue = async (queue) => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async (msg) => {
        if (msg !== null) {
            const report = JSON.parse(msg.content.toString());
            // 신고 내역을 데이터베이스에 저장
            await Report.create(report);
            channel.ack(msg);
        }
    });
};

module.exports = { consumeFromQueue };
