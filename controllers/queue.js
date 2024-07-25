// queue.js
const Bull = require('bull');
const Redis = require('ioredis');

// Redis 클라이언트 설정
const redisClient = new Redis({
    host: 'localhost',
    port: 6379
});

// Bull 큐 생성
const reservationQueue = new Bull('reservation', {
    redis: redisClient
});

module.exports = reservationQueue;
