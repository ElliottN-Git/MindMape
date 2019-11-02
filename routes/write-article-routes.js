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



router.post("/writeArticle", upload.single("imageFile"), async function(req, res) {

    const body = req.body.wysiwyg;
    const user = req.session.user;
    const writeArticle = await userDao.createArticle(user.userId, body);
    res.render("home");
});

router.get("/article", verifyAuthenticated, async function (req, res) {
    const user = req.session.user;
    const bodyContext = await userDao.loadArticlesById(user.userId);
    const context={
        body: bodyContext
    }
   
    res.render("article", context);
});



// -------------------------------------------------------------------------

module.exports = router;