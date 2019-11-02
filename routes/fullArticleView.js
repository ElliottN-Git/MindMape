const express = require("express");
const router = express.Router();

const verifyAuthenticated = require("../modules/verify-auth.js");

router.get("/", verifyAuthenticated, function(req, res) {
    console.log(req.session.user);
    if(req.session.user) {
        context = {
            homePage: true,
            user: req.session.user
        }
    } else {
        context = {
            homePage: true,
            notLogged: true,
            message: "please log in"
        }
    }
    
    res.render("home", context);
});

router.get("/fullArticleView", function(req, res) {

    res.render("fullArticleView");
});

module.exports = router;