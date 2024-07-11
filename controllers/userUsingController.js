const db = require("../models/index"),
    Reservation = db.reservation,
    Op = db.Sequelize.Op;
const moment = require('moment-timezone');
exports.getUserUsingPage = async (req, res) => {
    try {
        const currentTime = moment();
        const oneHourAgo = currentTime.subtract(1, 'hours').toDate();

        const reservations = await Reservation.findAll({
            where: {
                reservationDate: {
                    [Op.lt]: oneHourAgo
                }
            },
                include: [Machine]
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
