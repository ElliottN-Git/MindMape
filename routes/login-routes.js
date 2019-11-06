const express = require("express");
const router = express.Router();

const userDao = require("../modules/userDao.js");

router.use(function(req, res, next) {
    res.locals.user = req.session.user;
    next();
});

router.get("/login", function(req, res) {
    res.locals.message = req.query.message;
    res.render("login");
});

router.post("/login", async function(req, res) {
 
    const username = req.body.username;
    const password = req.body.password;

    let userdata = userDao.authenticateLogin(username, password);
    let user = await userdata;
    if (user != false) {
        // Auth success - add the user to the session, and render to the homepage.
        req.session.user = user[0];
        context = {
            loggedIn: true,
            user: req.session.user,
            message: "Successfully logged in!"
        };
        res.render("home", context);
    }
    else {
        // Auth fail - redirect user to the login page with a message.
        res.redirect("./login?message=Authentication failed!");
    }
});

router.get("/logout", function(req, res) {
    if (req.session.user) {
        delete req.session.user;
    }

    res.redirect("/");
});

module.exports = router;