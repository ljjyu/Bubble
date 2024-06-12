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
    const { name, review, rating } = req.body;
    if (!req.user || !req.user.email) {
        req.flash('error', 'User not authenticated.');
        return res.redirect('/reviews/writeReviews');
    }
    
	const userEmail = req.user.email;

	try {
            // 입력값 유효성 검사
             if (!name || !review || !rating) {
                req.flash('error', 'All fields are required.');
                return res.redirect('/reviews/writeReviews');
             }
            await Review.create({
                name,
                review,
                rating,
		userEmail,
                created_at: new Date()
            });
            res.redirect("/reviews/getReviews");
        } catch (err) {
            req.flash('error', 'An error occurred while saving the review.');
            res.redirect('/reviews/writeReviews');
        }
};
//삭제
exports.deleteReview = async (req, res) => {
    const reviewId = req.params.id;
    try {
        const review = await Review.findByPk(reviewId);

        if (!review) {
            req.flash('error', 'Review not found.');
            return res.redirect('/reviews/getReviews');
        }

        if (req.user.role !== 'admin' && req.user.email !== review.userEmail) {
            req.flash('error', 'Unauthorized action.');
            return res.redirect('/reviews/getReviews');
        }

        await Review.destroy({ where: { id: reviewId } });
        req.flash('success', 'Review deleted successfully.');
        res.redirect('/reviews/getReviews');
    } catch (err) {
        req.flash('error', 'An error occurred while deleting the review.');
        res.redirect('/reviews/getReviews');
    }
};
