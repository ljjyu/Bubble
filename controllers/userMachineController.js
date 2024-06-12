const db = require("../models/index"),
    Machine = db.machine,
    Op = db.Sequelize.Op;

exports.getUserMachines = async (req, res) => {
    try {
        data = await Machine.findAll();
        console.log(data);
        res.render("user/userMachine", {user: req.session.user, machines: data, layout: 'userLayout'});
    } catch (err) {
        res.status(500).send({
        message: err.message
        });
    }
};