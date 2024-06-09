const db = require("../models/index"),
    Reservation = db.reservation,
    Subscriber = db.subscriber,
    Machine = db.machine,
    Op = db.Sequelize.Op;

exports.getAllStatistics = async (req, res) => {
    try {
        const [machines, reservations, subscribers] = await Promise.all([
            Machine.findAll(),
            Reservation.findAll(),
            Subscriber.findAll()
            ]);
            console.log({ machines, reservations, subscribers });
            res.render("manager/getStatistic", { machines, reservations, subscribers });
    } catch (err) {
            res.status(500).send({
            message: err.message
            });
        }
};
