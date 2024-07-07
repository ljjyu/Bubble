const db = require("../models/index"),
    Reservation = db.reservation,
    Machine = db.machine,
    Branch = db.branch,
    Op = db.Sequelize.Op;

exports.getUserReservations = async (req, res) => {
    try {
        // createdAt을 기준으로 내림차순 정렬
        const data = await Reservation.findAll({
            order: [['created_at', 'DESC']],
            include: {
                model: db.machine,
                as: 'machine' // Machine 모델을 include
            }
        });
        res.render("user/userHome", {reservations: data});
    } catch (err) {
        res.status(500).send({
        message: err.message
        });
    }
};
