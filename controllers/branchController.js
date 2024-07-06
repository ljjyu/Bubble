const db = require('../models'),
    Branch = db.Branch;

exports.getBranches = async (req, res) => {
    try {
        const branches = await Branch.findAll({
            attributes: ['branchName']
        });
        res.json(branches);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
};