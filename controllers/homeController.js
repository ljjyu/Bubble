"use strict";
const db = require("../models/index"),
    Subscriber = db.subscriber,
    passport = require("passport");

exports.showIndex = (req, res) => {
    res.render("index");
};
module.exports = {
    login: (req, res) => {
        res.render("/");
    },
    logout: (req, res, next) => {
        req.logout((err) => {
             req.flash("success", "You have been logged out!");
             res.locals.redirect = "/";
             next();
        });
    }
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
                res.locals.redirect = "/";
                next();
            }
        } catch(err) {
            console.log(`Error logging in user: ${err.message}`);
            next(err);
        }
    }
};



