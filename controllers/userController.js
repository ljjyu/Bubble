"use strict";

exports.showIndex = (req, res) => {
    res.render("user/userHome", { layout: 'userLayout' });
};
exports.showIndex1 = (req, res) => {
    res.render("user/userMain", {user: req.session.user, layout: 'userLayout' });
};
exports.showIndex2 = (req, res) => {
    res.render("user/userReserve", { layout: 'userLayout' });
};
