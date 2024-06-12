const db = require("../models/index"),
    Reservation = db.reservation,
    Op = db.Sequelize.Op;

exports.getUserReservations = async (req, res) => {
    try {
        // createdAt을 기준으로 내림차순 정렬
        data = await Reservation.findAll({order: [['created_at', 'DESC']]});
        console.log(data);
        res.render("user/userHome", {reservations: data, layout: 'userLayout' });
    } catch (err) {
        res.status(500).send({
        message: err.message
        });
    }
};
