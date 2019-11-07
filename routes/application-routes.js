const express = require("express");
const router = express.Router();

const verifyAuthenticated = require("../modules/verify-auth.js");

router.get("/", verifyAuthenticated, function(req, res) {
    if(req.session.user) {
        context = {
            articlePage: true,
            loggedIn: true,
            user: req.session.user
        }
    } else {
        context = {
            articlePage: true,
            loggedIn: false,
            message: "please log in"
        }
    }
    
    res.render("article", context);
});

module.exports = router;