const amqp = require("amqplib");

class RabbitmqWrapper {
  constructor(url, queueName, options) {
    this._url = url;
    this._queueName = queueName;
    this._options = options || {};
    this.channel = undefined;
    this.queue = undefined;
  }

  // 커넥트 생성하고 채널 연결
  async setup() {
    const connect = await amqp.connect(this._url);
    this.channel = await connect.createChannel();
    await this.assertQueue();
  }

  // 채널에 큐를 생성하고 TTL 설정
  async assertQueue() {
    this.queue = await this.channel.assertQueue(this._queueName, {
      durable: true,
      arguments: {
        'x-message-ttl': 60000, // 메시지 TTL: 60초
        'x-expires': 120000 // 큐 만료 시간: 120초
      }
    });
  }

  // 큐에 데이터 보내기
  async sendToQueue(msg) {
    return await this.channel.sendToQueue(this._queueName, this.encode(msg), {
      persistent: true
    });
  }

  // 큐에서 데이터 가져오기
  async recvFromQueue() {
    const message = await this.channel.get(this._queueName, { noAck: false });
    if (message) {
      this.channel.ack(message);
      return message.content.toString();
    } else {
      return null;
    }
  }

  // 문자를 Buffer로 바꿈
  encode(doc) {
    return Buffer.from(JSON.stringify(doc));
  }

  // 메시지 보내기
  async send_message(msg) {
    await this.setup();
    await this.sendToQueue(msg);
  }

  // 메시지 가져오기
  async recv_message() {
    await this.setup();
    return await this.recvFromQueue();
  }
}

module.exports = RabbitmqWrapper;
