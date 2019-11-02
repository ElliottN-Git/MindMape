const express = require("express");
const router = express.Router();

const verifyAuthenticated = require("../modules/verify-auth.js");

router.get("/", verifyAuthenticated, function(req, res) {
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

module.exports = router;