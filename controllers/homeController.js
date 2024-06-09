"use strict";

exports.showIndex = (req, res) => {
    res.render("index");
};
exports.showIndex2 = (req, res) => {
    res.render("userMain", { user: req.session.user });
};




