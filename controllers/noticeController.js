const db = require('../models/index'); // 모델을 불러옴
const Notice = db.notice; // Notice 모델

// 공지사항 작성 페이지 렌더링 함수
exports.getNoticePage = (req, res) => {
    res.render('manager/getNotice'); // getNotice.ejs 렌더링
};

// 공지사항 작성 함수
exports.createNotice = async (req, res) => {
    try {
        const { subject, contents } = req.body;

        // 로그인된 사용자의 정보를 가져옵니다.
        const user = req.session.user;
        const branchName = user ? user.branchName : 'Unknown User';

	    // 공지사항 저장
        const newNotice = await Notice.create({
	        title: subject,
            contents: contents,
            subscriberName: branchName
        });

	res.redirect('/manager/getNotice');
    } catch (error) {
        res.status(500).json({ message: '공지사항을 저장하는 중 오류가 발생했습니다.', error: error.message });
    }
};
