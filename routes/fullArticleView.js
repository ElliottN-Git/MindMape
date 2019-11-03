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

router.post("/article", function (req, res) {
    const clickedArticleId = req.body.articleId;
    // res.locals.query = clickedArticleId;
    const context = {
        articleId: clickedArticleId
    };

    res.render("fullArticleView", context);
});

router.get("/userArticleHistory", async function (req, res) {
    const user = req.session.user;
    const allArticles = await userDao.loadArticlesById(user.userId);
    
    const context={
        articles: allArticles,
        user: user
    };
   
    res.render("userArticleHistory", context);
});

router.post("/editArticle", async function (req, res) {
    const user = req.session.user;
    const articleId = req.body.articleId;
    const articleDetails = await userDao.loadArticleDetails(articleId);
    const context={
        user: user,
        details: articleDetails
    };
   
    res.render("writeArticle", context);
});

router.post("/deleteArticle", async function (req, res) {
    const articleId = req.body.articleId;
    const deleteArticle = await userDao.deleteArticle(articleId);
    const user = req.session.user;
    const allArticles = await userDao.loadArticlesById(user.userId);
    
    const context={
        articles: allArticles,
        user: user
    };
   
    res.render("userArticleHistory", context);
});

router.get("/fullArticleView", function(req, res) {
    console.log(req.query);
    // userDao.getComments(articleId);
    res.render("fullArticleView");
});

router.post("/fullArticleView", upload.single(), async function(req, res) {
    const textBody = req.body;
    console.log(textBody.comment);
    const context = {
        comments: textBody.comment
    };
    res.render("fullArticleView", context);
});

module.exports = router;