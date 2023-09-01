
const Joi = require('joi');
const ExpressError = require('./utils/expressError');
const Hospital = require('./models/hospital');

hospitalSchema = Joi.object().keys({
    name: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNo: Joi.number().required(),
    about: Joi.string().required(),
    beds: Joi.number().required()
}).required();

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', ' need to login first');
        return res.redirect('/home');
    }
    next();
}

module.exports.isSignedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log(req.isAuthenticated());
        req.flash('error', 'need to logout first');
        return res.redirect('/home');
    }
    next();
}
module.exports.validateHospital = (req, res, next) => {
    try {
        const { name, address, phoneNo, about, email, beds } = req.body;
        const { error } = hospitalSchema.validate({ name, address, phoneNo, about, email, beds });
        if (error) {
            console.log(error);
            throw new ExpressError(error.message, 404);
        } else {
            next();
        }
    } catch (e) {
        console.log(e);
        req.flash('error', e);
        res.redirect('/user/hospital/register');
    }
}


module.exports.isAuthor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const  username  = await Hospital.findById(id);
        console.log(req.user._id);
        console.log(username);
        if (req.user._id == username) {
            return next();
        }
        else {
            req.flash('error', "You are not author ");
            res.redirect('/home');
        }
    } catch (e) {
        req.flash('error', e);
        console.log(e);
        next(e);
    }


}
