const express = require("express");
const router = express.Router();

const userDb = require("../modules/user-db.js");
const userDao = require("../modules/userDao.js");

router.use(function(req, res, next) {
    res.locals.user = req.session.user;
    next();
});

router.get("/login", function(req, res) {

    res.locals.message = req.query.message;
    res.render("login");

});

router.post("/login", function(req, res) {

    const username = req.body.username;
    const password = req.body.password;

    console.log(`Username entered: ${username}`);
    console.log(`Password entered: ${password}`);
    
    //const user = userDb.getUserWithCredentials(username, password);

    const user = userDao.authenticateLogin(username, password);

    if (user) {
        // Auth success - add the user to the session, and redirect to the homepage.
        req.session.user = user;
        res.redirect("/userProfile?message=Login successful");
    }
    else {
        // Auth fail
        res.redirect("./login?message=Authentication failed!");
    }
});

router.get("/logout", function(req, res) {
    if (req.session.user) {
        delete req.session.user;
    }
    res.redirect("./login?message=Successfully logged out!");
});

module.exports = router;