const db = require("../models/index"),
    Machine = db.machine,
    Branch = db.branch,
    Op = db.Sequelize.Op;

exports.getAllMachines = async (req, res) => {
    const subscriberBranchName = req.session.user.branchName;
    try {
        const branch = await Branch.findAll({ where: { branchName: subscriberBranchName } });
        // branch가 존재하는지 확인합니다.
        if (!branch) {
            res.status(404).send({
                 message: '해당 branch를 찾을 수 없습니다.'
            });
        }
        machines = await Machine.findAll({ where: { branchID: branch.branchID } });
        res.render("manager/getMachine", {
            user: req.session.user,
            machines: machines,
            selectedBranch: branch.branchID
        });
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};
