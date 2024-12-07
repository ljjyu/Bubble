const amqp = require('amqplib');
const db = require('../../models/index');
const Report = db.Report;

const consumeFromQueue = async (queue) => {
    try {
        const connection = await amqp.connect('amqp://rabbitmq:5672');
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, { durable: true });

        console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

	if (msg !== null) {
            try {
                const report = JSON.parse(msg.content.toString());
                console.log('Received report:', report);

		const requiredFields = ['reviewID', 'category', 'reportedBy', 'branchID'];
                const missingFields = requiredFields.filter(field => !report[field]);

                if (missingFields.length > 0) {
                    throw new Error(`Missing required fields in report: ${missingFields.join(', ')}`);
                }

                await Report.create(report);
                console.log('Report saved to DB:', report);

                channel.ack(msg);
            } catch (error) {
                console.error('Error processing message:', error);
                channel.nack(msg);
            }
        });
    } catch (error) {
        console.error('Error in RabbitMQ consumer:', error);
    }
};

module.exports = { consumeFromQueue };
