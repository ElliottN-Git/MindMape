// Setup express router
const express = require("express");
const router = express.Router();

// Setup multer-uploader
const upload = require("../modules/multer-uploader");

// Setup fs
const fs = require("fs");

// Setup required modules
const userDao = require("../modules/userDao");
const verifyAuthenticated = require("../modules/verify-auth.js");

// Route handlers
// -------------------------------------------------------------------------

router.get("/writeArticle", verifyAuthenticated, async function(req, res) {

    
    res.render("writeArticle");
});



router.post("/writeArticle", upload.single("wysiwyg"), async function(req, res) {
    const title = req.body.title;
    const body = req.body.wysiwyg;
    const user = req.session.user;
    const writeArticle = await userDao.createArticle(user.userId, title, body, user.username);
    res.render("home");
});



// -------------------------------------------------------------------------

module.exports = router;