const db = require("../models/index"),
    Review = db.Review,
    Branch = db.branch,
    Op = db.Sequelize.Op;

exports.getAllReviews = async (req, res) => {
    try {
        const user = req.session.user;
        const reviews = await Review.findAll({
            include: [
                {
                    model: Branch,
                    as: 'branch'
                }
            ],
            order: [['created_at', 'DESC']]
        });
        res.render("reviews/getReviews", {
            reviews,
            user
        });
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};
// 폼 입력이 가능한 웹 페이지 렌더링
exports.getReviewsPage = async (req, res) => {
    try {
        const branches = await Branch.findAll();
        const user = req.session.user;
        res.render("reviews/writeReviews", {
            branches,
            user // 사용자 정보를 템플릿으로 전달
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
// 넘겨받은 POST 데이터 저장 및 처리
exports.saveReviews = async (req, res) => {
	try {
	    const { name, review, rating, branchSelect } = req.body;
        // 로그인된 사용자의 정보를 가져옵니다.
        const user = req.session.user;
        const subscriberName = user ? user.name : 'Unknown User';
        // 입력값 유효성 검사
        if (!name || !review || !rating || !branchSelect) {
            req.flash('error', 'All fields are required.');
            return res.redirect('/reviews/writeReviews');
        }
        await Review.create({
            name,
            review,
            rating,
            subscriberName,
            branchID : branchSelect,
            createdAt: new Date()
        });
            res.redirect("/reviews/getReviews");
        } catch (err) {
            req.flash('error', 'An error occurred while saving the review.');
            res.redirect('/reviews/writeReviews');
        }
};
//삭제
/*exports.deleteReview = async (req, res) => {
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
};*/
