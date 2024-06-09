const db = require("../models/index"),
    Notice = db.notice,
    Op = db.Sequelize.Op;

exports.getAllNotices = async (req, res) => {
    try {
	//const [notices] = await db.query('SELECT noticeNumber, title, writeDate, contents FROM notice');
        //res.render('showNotice', { notices });
        data = await Notice.findAll();
        console.log(data);
        res.render("manager/showNotice", {notices: data});
    } catch (err) {
	console.error('Error fetching notices:', err); //오류 확인차
        res.status(500).send({
            message: err.message
        });
    }
};
