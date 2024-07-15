const db = require("../models/index"),
    Machine = db.machine,
    Reservation = db.reservation,
    Op = db.Sequelize.Op;

exports.getUserUsingPage = async (req, res) => {
    try {
        // 1시간 전 시간을 계산합니다.
        const oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);

        // 로그인된 사용자의 정보를 가져옵니다.
        const user = req.session.user;
        const subscriberName = user ? user.name : 'Unknown User';

        const reservations = await Reservation.findAll({
            where: {
                reservationDate: {
                    [Op.gt]: oneHourAgo
                },
                subscriberName: subscriberName
            },
            order: [['created_at', 'DESC']],
            include: [{
                model: db.machine,
                as: 'machine',
                include: {
                     model: db.branch,
                    as: 'branch3'
                }
            }]
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
