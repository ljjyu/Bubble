const db = require("../models/index"),
    Reservation = db.reservation,
    Op = db.Sequelize.Op;

exports.getUserUsingPage = async (req, res) => {
    try {
        data = await Reservation.findAll();
        const reservations = await Reservation.findAll();

        if (!reservations.length) {
            return res.render('user/userUsing', { reservations: [] });
        }

        const currentTime = moment().tz('Asia/Seoul');

        const userReservations = await Promise.all(reservations.map(async (reservation) => {
            const { machineType, machineNum, reservationDate } = reservation;
            const operationTime = 15;

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

        res.render('user/userUsing', { reservations: userReservations });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: '사용자 예약 정보를 불러오는 중 오류가 발생했습니다.'
        });
    }
};

