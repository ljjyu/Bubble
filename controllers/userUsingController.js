const moment = require('moment-timezone');
const db = require("../models/index"),
    Reservation = db.reservation,
    Op = db.Sequelize.Op;

exports.getUserUsingPage = (req, res) => {
    try {
        // 세션에서 예약 정보를 가져옴
        const reservations = req.session.reservations || [];

        // 예약 정보가 없을 경우 빈 배열 반환
        if (!reservations.length) {
            return res.render('user/userUsing', { reservations: [] });
        }

        // 예약 정보를 형식에 맞게 변환
        const userReservations = reservations.map(reservation => {
            const { machineType, machineNum, reservationDate, remainingTime } = reservation;
            return {
                id: `${machineType}${machineNum}`,
                machineType,
                machineNum,
                reservationDate: moment(reservationDate).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
                remainingTime: remainingTime ? moment(remainingTime, 'HH:mm:ss').format('HH:mm:ss') : null
            };
        });

        // 렌더링할 페이지와 데이터
        res.render('user/userUsing', { reservations: userReservations });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: '사용자 예약 정보를 불러오는 중 오류가 발생했습니다.'
        });
    }
};
