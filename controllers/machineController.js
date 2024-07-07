const db = require("../models/index"),
    Machine = db.machine,
    Op = db.Sequelize.Op;

exports.getAllMachines = async (req, res) => {
    const branchID = req.query.branchID || 0;
    try {
        const branches = await Branch.findAll();
        let machines;
        if (branchID > 0) {
            machines = await Machine.findAll({ where: { branchID: branchID } });
        } else {
            machines = await Machine.findAll();
        }
        console.log(machines);
        res.render("manager/getMachine", {
            user: req.session.user,
            machines: machines,
            branches: branches,
             selectedBranch: branchID
        });
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};
