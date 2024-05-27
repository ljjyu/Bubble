const httpStatus = require("http-status-codes");

// 에러 처리를 위한 미들웨어
exports.logErrors = (error, req, res, next) => {
    console.error(error.stack); // 에러 스택 로깅
    next(error);
};
// 페이지 부재 시 404 상태 코드 응답
exports.respondNoResourceFound = (req, res) => {
    let errorCode = httpStatus.NOT_FOUND;
    res.status(errorCode);
    res.send(`${errorCode} | The page does not exist!`);
    /*res.sendFile(`./public/${errorCode}.html`, { // 텍스트 메시지 대신 파일로 응답
        root: "./"
    });*/
};
// 요청 처리를 중단시킨 내부 에러에 대한 로깅과 응답
exports.respondInternalError = (error, req, res, next) => {
    let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
    console.log(`ERROR occurred: ${error.stack}`);
    res.status(errorCode);
    res.send(`${errorCode} | Sorry, our application is experiencing a problem!`);
};
// 앞에서 처리되지 못한 모든 요청 처리
exports.pageNotFoundError = (req, res) => {
    let errorCode = httpStatus.NOT_FOUND;
    res.status(errorCode);
    res.render("error");
};

// 내부 서버 에러 처리
exports.internalServerError = (error, req, res, next) => {
    let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
    console.log(`ERROR occurred: ${error.stack}`);
    res.status(errorCode);
    res.send(`${errorCode} | Sorry, our application is taking a nap!`);
};