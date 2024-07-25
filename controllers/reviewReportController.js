const db = require("../models/index"),
    Report = db.Report,
    Review = db.Review,
    Branch = db.branch;

exports.getReports = async (req, res) => {
    try {
        const user = req.session.user;
        if (!user || user.role !== 'admin') {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/reviews/getReviews');
        }
        const branch = await Branch.findOne({ where: { branchName: user.branchName } });

	if (!branch) {
            req.flash('error', 'Branch not found.');
            return res.redirect('/reviews/getReviews');
        }
        const reports = await Report.findAll({
            include: [
                {
                    model: Review,
                    as: 'review',
                    where: { branchID: branch.branchID },
                    include: [
                        {
                            model: Branch,
                            as: 'branch'
                        }
                    ]
                }
            ],
            order: [['reported_at', 'DESC']]
        });
        res.render("reviews/reports", {
            reports,
            user
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

