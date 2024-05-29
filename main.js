const port = 80, // 포트 번호 지정
    http = require("http"),
    httpStatus = require("http-status-codes");

// 애플리케이션 서버가 지정한 포트를 수신하도록 설정
app.listen(port);
console.log(`The server has started and is listening on port number: ${port}`);

