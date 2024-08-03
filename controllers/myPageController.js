
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
