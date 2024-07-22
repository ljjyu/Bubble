const db = require("../models/index"),
    Machine = db.machine,
    Reservation = db.reservation,
    moment = require('moment'),
    Op = db.Sequelize.Op;

exports.getUserUsingPage = async (req, res) => {
    try {
        // 30분 후 시간을 계산합니다.
        const thirtyMinutesLater = moment().add(30, 'minutes').toDate();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);

        // 로그인된 사용자의 정보를 가져옵니다.
        const user = req.session.user;
        const subscriberName = user ? user.name : 'Unknown User';

        const reservations = await Reservation.findAll({
            where: {
                reservationDate: {
                    [Op.gt]: thirtyMinutesLater
                },
                subscriberName: subscriberName
            },
            order: [['created_at', 'DESC']],
            include: {
                model: Machine,
                as: 'machine'
            },
            order: [['created_at', 'DESC']]
        });

        // 렌더링할 페이지와 데이터
        res.render('user/userUsing', { reservations: reservations });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: '사용자 예약 정보를 불러오는 중 오류가 발생했습니다.'
        });
    }
};
