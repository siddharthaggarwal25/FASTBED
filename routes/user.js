const express = require("express");
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require("../utils/expressError");
const { isSignedIn, isLoggedIn } = require("../middleware");

router.get('/user/login', isSignedIn, (req, res) => {
    res.render('user/login');
})

router.get('/user/register', isSignedIn, (req, res) => {
    res.render('user/register');
});

router.post('/user/login', isSignedIn, passport.authenticate('local', { failureFlash: true, failureRedirect: "/user/login" }), (req, res) => {
    req.flash('success', "Welcome back!!");
    res.redirect('/home');
});

router.post('/user/register', isSignedIn, catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) {
                req.flash('error', err)
                console.log(err);
                throw new ExpressError(err, 400);
            } else {
                req.flash('success', 'successfully registered')
                res.redirect('/user/hospital/show');
            }
        })
    } catch (e) {
        req.flash('error', e.message);
        console.log(e.message);
        res.redirect("/user/register");


    }
}));

router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            req.flash('error', err)
            return next(err);
        }
        req.flash('success', 'Thanks for Visiting ..')
        res.redirect('/home');
    });
});




module.exports = router;