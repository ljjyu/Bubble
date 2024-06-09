const db = require('../models/index'); // 모델 파일의 적절한 경로로 수정하세요
const Reservation = db.reservation;
const moment = require('moment-timezone'); // 시간대를 맞추기 위해 moment-timezone 사용

exports.getUserUsingPage = async (req, res) => {
    try {
        const userId = req.user.id; // 사용자 ID를 가져옴

        const reservations = await Reservation.findAll({
            where: {
                userId: userId
            }
        });

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

        res.render('userUsing', { reservations: userReservations });
    } catch (err) {
        res.status(500).send({
            message: '사용자 예약 정보를 불러오는 중 오류가 발생했습니다.'
        });
    }
};
