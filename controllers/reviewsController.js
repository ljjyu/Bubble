const db = require("../models/index"),
    Review = db.Review,
    Branch = db.branch,
    Report = db.Report,
    Op = db.Sequelize.Op;

const { sendToQueue } = require('../rabbitmqProducer');

exports.getAllReviews = async (req, res) => {
    const branchID = req.query.branchID || 0;
    try {
        const user = req.session.user;
        const reviews = await Review.findAll({
            include: [
                {
                    model: Branch,
                    as: 'branch'
                },
		        {
                    model: Report,
                    as: 'reports'
                }
            ],
            order: [['created_at', 'DESC']]
        });
        const branches = await Branch.findAll();
        let branchReview;
        if (branchID > 0) {
            branchReview = await Review.findAll({ where: { branchID: branchID } });
        } else {
            branchReview = await Review.findAll();
        }
        res.render("reviews/getReviews", {
            reviews,
            user,
            branchReview: branchReview,
            branches: branches,
            selectedBranch: branchID
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
exports.deleteReview = async (req, res) => {
    const reviewId = req.params.id;
    const user = req.session.user;
    try {
        const branch = await Branch.findOne({ where: { branchName: user.branchName } });
        const review = await Review.findOne({ where: { id: reviewId, branchID: branch.branchID } });
        if (!review) {
            req.flash('error', 'You do not have permission to delete this review.');
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

//신고 
exports.reportReview = async (req, res) => {
    try {
        const { reviewID, category, reason } = req.body;
        const user = req.session.user;

        console.log('Received data:', { reviewID, category, reason });

        if (!reviewID || !category || (category === '기타' && !reason)) {
            req.flash('error', 'All fields are required.');
            return res.redirect('/reviews/getReviews');
        }

        const review = await Review.findOne({ where: { id: reviewID } });

        if (!review) {
            req.flash('error', 'Review not found.');
            return res.redirect('/reviews/getReviews');
        }

        const reportReason = category === '기타' ? reason : category;

        const newReport = await Report.create({
            reviewID,
            category,
            reason: reportReason,
            reporterName: user.name,
            reportedBy: user.email,
            branchID: review.branchID,
            reported_at: new Date()
        });

        console.log('New Report:', newReport);

        req.flash('success', 'Review reported successfully.');
        res.redirect('/reviews/getReviews');
    } catch (err) {
        console.error('Error reporting review:', err);
        req.flash('error', 'An error occurred while reporting the review.');
        res.redirect('/reviews/getReviews');
    }
};

