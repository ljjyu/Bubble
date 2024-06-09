const db = require("../models/index"),
    Reservation = db.reservation,
    Op = db.Sequelize.Op;
const moment = require('moment-timezone');

exports.getUserUsingPage = async (req, res) => {
    try {
        data = await Reservation.findAll();
        // 세션에서 예약 정보를 가져옴
        const reservations = req.session.reservations || [];

        // 예약 정보가 없을 경우 빈 배열 반환
        if (!reservations.length) {
            return res.render('user/userUsing', { reservations: [] });
        }

        // 현재 시간
        const currentTime = moment().tz('Asia/Seoul');

        // 예약 정보를 형식에 맞게 변환하고 잔여 시간 계산
        const userReservations = await Promise.all(reservations.map(async (reservation) => {
            const { machineType, machineNum, reservationDate } = reservation;

            // 예약한 세탁기의 작동 시간 (분 단위로 가정)
            const operationTime = 15;

            // 예약 시작 시간과 현재 시간 사이의 차이를 계산하여 잔여 시간 계산
            const startDateTime = moment(reservationDate).tz('Asia/Seoul');
            const elapsedTime = currentTime.diff(startDateTime, 'minutes');
            const remainingTime = operationTime - elapsedTime;

            return {
                id: `${machineType}${machineNum}`,
                machineType,
                machineNum,
                reservationDate: moment(reservationDate).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
                remainingTime: remainingTime > 0 ? moment().startOf('day').add(remainingTime, 'minutes').format('HH:mm:ss') : '00:00:00'
            };
        }));

        // 렌더링할 페이지와 데이터
        res.render('user/userUsing', { reservations: userReservations });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: '사용자 예약 정보를 불러오는 중 오류가 발생했습니다.'
        });
    }
};

