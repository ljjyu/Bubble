const db = require("../models/index"),
    Notice = db.notice,
    Branch = db.branch,
    Op = db.Sequelize.Op;

exports.getAllNotices = async (req, res) => {
    try {
	    //const [notices] = await db.query('SELECT noticeNumber, title, writeDate, contents FROM notice');
        //res.render('showNotice', { notices });
        data = await Notice.findAll({order: [['created_at', 'DESC']]});
        res.render("showNotice", { notices: data });
    } catch (err) {
	    console.error('Error fetching notices:', err); //오류 확인차
        res.status(500).send({
            message: err.message
        });
    }
};
//삭제
exports.deleteNotice = async (req, res) => {
    const noticeId = req.params.noticeNumber;
    const user = req.session.user;
    try {
        const branch = await Branch.findOne({ where: { branchName: user.branchName } });
        const notice = await Notice.findOne({ where: { noticeNumber: noticeId, subscriberName: branch.branchName } });
        if (!notice) {
            req.flash('error', 'Notice not found or you do not have permission to delete this notice.');
            return res.redirect('/showNotice');
        }
        await Notice.destroy({where: { noticeNumber: noticeId }});
        req.flash('success', 'Notice deleted successfully.');
        res.redirect('/showNotice');
    } catch (err) {
        req.flash('error', 'An error occurred while deleting the notice.');
        res.redirect('/showNotice');
    }
};
