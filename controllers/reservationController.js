const db = require("../models/index"),
    Reservation = db.reservation,
    Op = db.Sequelize.Op;

exports.getAllReservations = async (req, res) => {
    try {
        data = await Reservation.findAll();
        console.log(data);
        res.render("getReservation", {reservations: data});
    } catch (err) {
        res.status(500).send({
        message: err.message
        });
    }
};