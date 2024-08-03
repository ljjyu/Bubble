
exports.getAllMyPage = async (req, res) => {
    try {
        res.render("myPage");
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};
