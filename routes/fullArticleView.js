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

router.post("/article", async function (req, res) {
    const clickedArticleId = req.body.articleId;
    const articleDetail = await userDao.loadArticleDetails(clickedArticleId);

    res.render("fullArticleView", articleDetail);
});

router.get("/userArticleHistory", async function (req, res) {
    const user = req.session.user;
    const allArticles = await userDao.loadArticlesById(user.userId);
    const context={
        articles: allArticles
    };
   
    res.render("userArticleHistory", context);
});

router.post("/userArticleHistory", async function (req, res) {
    const clickedArticleId = req.body.articleId;
    const articleDetail = await userDao.loadArticleDetails(clickedArticleId);
    res.render("fullArticleView", articleDetail);
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

router.post("/updateArticle", upload.single(), async function (req, res) {
    const newArticle = req.body;
    console.log(newArticle.title);
    const update = await userDao.updateArticle(newArticle.id, newArticle.title, newArticle.wysiwyg)
    // const deleteArticle = await userDao.deleteArticle(articleId);
    const user = req.session.user;
    const allArticles = await userDao.loadArticlesById(user.userId);
    
    const context={
        articles: allArticles,
        user: user
    };
   
    res.render("userArticleHistory", context);
});

router.get("/fullArticleView", function(req, res) {
    
    // userDao.getComments(articleId);
    res.render("fullArticleView");
});

router.post("/fullArticleView", upload.single(), async function(req, res) {
    const textBody = req.body;
    const context = {
        comments: textBody.comment
    };
    res.render("fullArticleView", context);
});

module.exports = router;