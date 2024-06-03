"use strict";
const Subscriber = require('../models/subscriber');
exports.showIndex = (req, res) => {
    res.render("index");
};
authenticate: async (req, res, next) => {
    try {
        let user = await Subscriber.findOne({ where: { email: req.body.email } });
        if (user && user.password === req.body.password) {
        res.locals.redirect = `/${user.getDataValue('id')}`;
        req.flash("success", `${user.fullName}'s logged in successfully!`);
        res.locals.user = user;
        next();
        } else {
            req.flash("error", "Your account or password is incorrect. Please try again or contact your system administrator!");
            res.locals.redirect = "";
            next();
        }
    } catch(err) {
        console.log(`Error logging in user: ${err.message}`);
        next(err);
    }
};


