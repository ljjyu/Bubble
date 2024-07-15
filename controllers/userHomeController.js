const db = require("../models/index"),
    Reservation = db.reservation,
    Machine = db.machine,
    Branch = db.branch,
    Op = db.Sequelize.Op;

exports.getUserReservations = async (req, res) => {
    try {
         // 로그인된 사용자의 정보를 가져옵니다.
         const user = req.session.user;
         const subscriberName = user ? user.name : 'Unknown User';

        // createdAt을 기준으로 내림차순 정렬
        const data = await Reservation.findAll({
            where: {
                subscriberName: subscriberName
            },
            order: [['created_at', 'DESC']],
            include: [{
                model: db.machine,
                as: 'machine',
                include: {
                    model: db.branch,
                    as: 'branch'
                }
            }]
        });
        res.render("user/userHome", {reservations: data});
    } catch (err) {
        res.status(500).send({
        message: err.message
        });
    }
};
