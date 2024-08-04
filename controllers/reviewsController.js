const db = require("../models/index"),
    Review = db.Review,
    Op = db.Sequelize.Op;

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({order: [['created_at', 'DESC']]});
        res.render("reviews/getReviews", {reviews});
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};
// 폼 입력이 가능한 웹 페이지 렌더링
exports.getReviewsPage = (req, res) => {
    res.render("reviews/writeReviews");
};
// 넘겨받은 POST 데이터 저장 및 처리
exports.saveReviews = async (req, res) => {
	try {
	    const { name, review, rating } = req.body;
        // 로그인된 사용자의 정보를 가져옵니다.
        const user = req.session.user;
        const subscriberName = user ? user.name : 'Unknown User';
        // 입력값 유효성 검사
        if (!name || !review || !rating) {
            req.flash('error', 'All fields are required.');
            return res.redirect('/reviews/writeReviews');
        }
        await Review.create({
            name,
            review,
            rating,
            subscriberName,
            created_at: new Date()
        });
            res.redirect("/reviews/getReviews");
        } catch (err) {
            req.flash('error', 'An error occurred while saving the review.');
            res.redirect('/reviews/writeReviews');
        }
};
// 찜 추가/삭제 함수
exports.addFavorites = async (req, res) => {
    // 로그인된 사용자의 정보를 가져옵니다.
    const user = req.session.user;
    const userName = user ? user.name : 'Unknown User';
    try {
        // favorites 테이블에서 해당 사용자와 리뷰 ID로 존재하는지 확인
        const favorite = await favorites.findOne({ where: { userName: userName, reviewID: reviewID } });

        if (favorite) {
            // 존재하면 삭제
            await favorite.destroy();
            res.status(200).json({ message: '즐겨찾기에서 삭제되었습니다.' });
        } else {
            // 존재하지 않으면 추가
            await favorites.create({ userName: userName, reviewID: reviewID });
            res.status(200).json({ message: '즐겨찾기에 추가되었습니다.' });
        }
    } catch (err) {
        req.flash('error', 'An error occurred while saving the review favorites.');
        res.redirect('/reviews/getReviews');
    }
};
