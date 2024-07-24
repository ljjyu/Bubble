const amqp = require('amqplib');
const RABBITMQ_URL = 'amqp://localhost'; // RabbitMQ 서버 URL
const QUEUE_NAME = 'inquiries';
const db = require("../models/index");
const Qna = db.qna,
    Branch = db.branch;

// 소비자 함수 정의
const startConsumer = async () => {
    try {
        // RabbitMQ에 연결
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: false });

        console.log(' [RabbitMQ] Waiting for messages in %s. To exit press CTRL+C', QUEUE_NAME);

        // 메시지 소비
        channel.consume(QUEUE_NAME, async (msg) => {
            if (msg !== null) {
                const inquiry = JSON.parse(msg.content.toString());
                console.log(' [x] Received message:', inquiry);

                // 데이터베이스에 답장 저장
                try {
                    await Qna.update(
                        { answer: inquiry.answer }, // 답장 내용
                        { where: { qnaNumber: inquiry.qnaNumber } }
                    );

                    // 메시지 확인 및 큐에서 제거
                    channel.ack(msg);
                    console.log(' [x] Message processed successfully:', inquiry.qnaNumber);
                } catch (dbError) {
                    console.error('Database error:', dbError);
                    // 실패한 경우 메시지를 재큐로 재전송
                    channel.nack(msg, false, true);
                }
            }
        }, { noAck: false });

    } catch (error) {
        console.error('Error in consumer:', error);
    }
};

module.exports = { startConsumer };

