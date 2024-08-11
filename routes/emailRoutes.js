const express = require('express');
const app = express();
const subscriberRouter = require('./routes/subscriber');
const emailRouter = require('./routes/emailRoutes');

// JSON 및 URL-encoded 데이터 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 라우터 설정
app.use('/subscribers', subscriberRouter);
app.use('/email', emailRouter);

// 서버 시작
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
