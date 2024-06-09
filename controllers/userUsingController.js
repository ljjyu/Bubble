const db = require("../models/index");
const Reservation = db.reservation;
const moment = require('moment-timezone');

exports.getUserUsingPage = async (req, res) => {
    try {
        // 현재 로그인한 사용자의 ID 가져오기
        const userId = req.user.id;

        // 사용자의 예약 정보 가져오기
        const reservations = await Reservation.findAll({
            where: {
                userId: userId
            }
        });

        // 예약 정보가 없을 경우 빈 배열 반환
        if (!reservations.length) {
            return res.render('userUsing', { reservations: [] });
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

        res.render('userUsing', { reservations: userReservations });
    } catch (err) {
        console.error(err); // 오류 로그 출력
        res.status(500).send({
            message: '사용자 예약 정보를 불러오는 중 오류가 발생했습니다.'
        });
    }
};
