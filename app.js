if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const session = require('express-session');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');    
const userRoutes = require('./routes/user');
const hospitalRoutes = require('./routes/hospital');
const extraRoutes = require('./routes/extra');
const ExpressError = require('./utils/expressError');
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
mongoose.connect('mongodb://127.0.0.1:27017/p2')
    .then(() => {
        console.log('connected to databse');
    })
    .catch((e) => {
        console.log('not connected to databse', e);
    })
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.currentuser=req.session.passport;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
});
app.use('/', userRoutes);
app.use('/', hospitalRoutes);
app.use('/', extraRoutes);

app.all('*', (req, res, next) => {
    next (new ExpressError('Page not found', 404));
});

app.use((err, req, res ,next) => {
    if (!err.status) {
        err.status = 500;
    }
    if (!err.message) {
        err.message = 'oh ,no something went wrong';
    }
    res.render('error', { err });

});

app.listen(3000, () => {
    console.log('connected to port 3000');
});