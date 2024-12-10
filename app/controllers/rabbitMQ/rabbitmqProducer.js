const amqp = require('amqplib');
const RabbitmqWrapper = require("./rabbitMQ");

const sendToQueue = async (queue, message) => {
    try {
        //const connection = await amqp.connect('amqp://localhost');
        //const channel = await connection.createChannel();
        //await channel.assertQueue(queue, { durable: true });

	const rabbitmq = new RabbitmqWrapper(process.env.RABBITMQ_URL, queue);
	await rabbitmq.setup();

        const parsedMessage = JSON.parse(message);
        
	const requiredFields = ['reviewID', 'category', 'reportedBy', 'branchID'];
        const missingFields = requiredFields.filter(field => !parsedMessage[field]);

        if (missingFields.length > 0) {
            throw new Error(`Missing required fields in message: ${JSON.stringify(parsedMessage)}`);
        }

        //channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
        //console.log(`Message sent to queue ${queue}: ${message}`);
        await rabbitmq.sendToQueue(parsedMessage);
	setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error('Error sending message to RabbitMQ:', error);
    }
};

module.exports = { sendToQueue };

