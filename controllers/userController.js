"use strict";

/*exports.showIndex = (req, res) => {
    res.render("user/userHome");
};*/
exports.showIndex1 = (req, res) => {
    res.render("user/userMain", {{user: req.session.user});
};
/*exports.showIndex2 = (req, res) => {
    res.render("user/userReserve");
};*/