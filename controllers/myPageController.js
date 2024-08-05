const db = require("../models/index"),
    Review = db.Review,
    favorites = db.favorites,
    Op = db.Sequelize.Op;

exports.getAllMyPage = async (req, res) => {
    try {
        // 로그인된 사용자의 정보를 가져옵니다.
        const user = req.session.user;
        const userName = user ? user.name : 'Unknown User';
        res.render("myPage/showMyPage", {userName});
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};

exports.getALLMyFavorites = async (req, res) => {
    try {
        // 로그인된 사용자의 정보를 가져옵니다.
        const user = req.session.user;
        const userName = user ? user.name : 'Unknown User';

        const favoriteReviews = await favorites.findAll({
            where: { userName : userName },
            include: [{
                model: Review,
                as: 'review1',
                required: true
            }]
        });

        res.render("myPage/getMyFavorites", { favorites : favoriteReviews});
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};