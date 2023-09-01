
const express = require("express");
const router = express.Router();
const Hospital = require("../models/hospital");
const { validateHospital } = require("../middleware");
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

router.get('/user/hospital/register', isLoggedIn, async (req, res) => {
    res.render("hospital/register");
});

router.post('/user/hospital/register', isLoggedIn, upload.array('image'), validateHospital, catchAsync(async (req, res) => {
    try {
        const username = req.session.passport.user;
        const { email, beds, about, address, phoneNo, name } = req.body;
        const hospital = new Hospital({ email, beds, about, address, phoneNo, name, username });
        hospital.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
        const data = await hospital.save();
        res.redirect("/user/hospital/show");
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/user/hospital/register');
    }
}));

router.get("/user/hospital/show", catchAsync(async (req, res) => {
    const hosp = await Hospital.find();
    res.render('hospital/show', { hosp });
}));

router.get('/user/hospital/show/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const hospital = await Hospital.findById(id);
    res.render("hospital/showone", { hospital });
}));

router.get('/user/hospital/show/:id/appoint', isLoggedIn, (req, res) => {
    const { id } = req.params;
    res.render('hospital/appoint', { id });

});
router.post('/user/hospital/show/:id/appoint', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const hospital = await Hospital.findByIdAndUpdate(id);
    hospital.request.push(data);
    await hospital.save();
    req.flash('success', 'Your booking is done insititue will contact you soon.');
    res.redirect(`/user/hospital/show/${id}`);
});

router.get('/user/hospital/show/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const hospital = await Hospital.findById(id);
    res.render('hospital/edit', { hospital });
}));

router.post('/user/hospital/show/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const { images, username } = await Hospital.findById(id);
    const data = req.body;
    const hospital = await Hospital.findByIdAndUpdate(id, { images: images, username: username, ...data })
    console.log(hospital);
    await hospital.save();
    res.redirect(`/user/hospital/show/${id}`);
}));


router.get('/user/hospital/show/:id1/:id2/delete', async (req, res) => {
   try{ console.log('hoowwww');
    const { id1, id2 } = req.params;
    console.log(id1.id2);
      const val =await Hospital.updateOne( {id1}, { $pull: { request : id2 }});
    res.redirect(`/user/hospital/show/${id1}`);
}catch(e){
    res.send(e);
}
})

module.exports = router;