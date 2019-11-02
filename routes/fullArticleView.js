const express = require("express");
const router = express.Router();
// Setup multer-uploader
const upload = require("../modules/multer-uploader");
const verifyAuthenticated = require("../modules/verify-auth.js");
const userDao = require("../modules/userDao");

router.get("/article", async function (req, res) {
    const allArticles = await userDao.loadAllArticles();
    const context={
        articles: allArticles
    }
   
    res.render("article", context);
});

router.get("/fullArticleView", function(req, res) {
    userDao.getComments
    res.render("fullArticleView");
});

router.post("/fullArticleView", upload.single("imageFile"), verifyAuthenticated, async function(req, res) {
    const textBody = req.body;
    const context = {
        comments: textBody.comment
    };
    res.render("fullArticleView", context);
});

module.exports = router;