const amqp = require('amqplib');

const sendToQueue = async (queue, message) => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    setTimeout(() => {
        connection.close();
    }, 500);
};

module.exports = { sendToQueue };
