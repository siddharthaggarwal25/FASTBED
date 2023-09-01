const express =require("express");
const router= express.Router();

router.get('/home', (req, res) => {
    res.render('extra/home');
});

router.get("/about", (req, res) => {
    res.render("extra/about");
});

router.get("/contact", (req, res) => {
    res.render("extra/contact");
});


module.exports=router;