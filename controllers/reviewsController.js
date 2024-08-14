const db = require("../models/index"),
    Review = db.Review,
    favorites = db.favorites,
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
        const user = req.session.user; // 세션에서 사용자 정보 가져오기
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
exports.deleteReview = async (req, res) => {
    const reviewId = req.params.id;
    const user = req.session.user;
    try {
        const branch = await Branch.findOne({ where: { branchName: user.branchName } });
        const review = await Review.findOne({ where: { id: reviewId, branchID: branch.branchID } });
        if (!review) {
            req.flash('error', 'Review not found or you do not have permission to delete this review.');
            return res.redirect('/reviews/getReviews');
        }
        await Review.destroy({where: { id: reviewId }});
        req.flash('success', 'Review deleted successfully.');
        res.redirect('/reviews/getReviews');
    } catch (err) {
        req.flash('error', 'An error occurred while deleting the review.');
        res.redirect('/reviews/getReviews');
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
