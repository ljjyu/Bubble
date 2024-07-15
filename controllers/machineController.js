const db = require("../models/index"),
    Machine = db.machine,
    Branch = db.branch,
    Op = db.Sequelize.Op;

exports.getAllMachines = async (req, res) => {
    const subscriberBranchName = req.session.user.branchName;
    try {
        const branch = await Branch.findOne({ where: { branchName: subscriberBranchName } });
        // branch가 존재하는지 확인합니다.
        if (!branch) {
            res.status(404).send({
                 message: '해당 branch를 찾을 수 없습니다.'
            });
        }
        const machines = await Machine.findAll({ where: { branchID: branch.branchID } });
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
// 기계 상태를 needs_repair로 업데이트하는 엔드포인트 추가
exports.reportIssue = async (req, res) => {
    const { machine_id } = req.body;
    try {
        await Machine.update(
            { state: 'needs_repair' }, // 업데이트할 데이터
            {
                where: { machineID: machine_id } // 조건
            }
        );
        res.send({ message: 'Machine status updated to needs_repair' });
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};
