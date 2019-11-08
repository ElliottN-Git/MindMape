const express = require("express");
const router = express.Router();
// Setup multer-uploader
const upload = require("../modules/multer-uploader");
const verifyAuthenticated = require("../modules/verify-auth.js");
const userDao = require("../modules/userDao");

const profanityFilter = require("../modules/profanityFilter-db");

router.get("/article", async function (req, res) {
    const allArticles = await userDao.loadAllArticles();

    for(let i = 0; i < allArticles.length; i++) {
        const censoredTitle = profanityFilter.replaceBannedWords(allArticles[i].title);
        allArticles[i].title = censoredTitle;

        const censoredArticle = profanityFilter.replaceBannedWords(allArticles[i].content);
        allArticles[i].content = censoredArticle;
    }

    const context = {
        articles: allArticles,
        articlePage: true
    }

    res.render("article", context);
});

//route handler for the censored article
router.post("/censoredArticle", async function (req, res) {
    let context;

    // Retrieve clicked article id number
    const articleId = req.body.articleId;

    // Loading linked article details then apply profanity filter.
    let details = await userDao.loadArticleDetails(articleId);

    const censoredArticleTitle = profanityFilter.replaceBannedWords(details.title);
    details.title = censoredArticleTitle;

    const censoredArticleContent = profanityFilter.replaceBannedWords(details.content);
    details.content = censoredArticleContent;

    // Loading linked comments (if there is) then apply profanity filter.
    const commentsAll = await userDao.loadComments(articleId);
    
    for(let i = 0; i < commentsAll.length; i++) {
        const censoredComments = profanityFilter.replaceBannedWords(commentsAll[i].content);
        commentsAll[i].content = censoredComments;
    }

    if(req.session.user) {
        const userDetail = req.session.user;
        context = {
            comments: commentsAll,
            articleDetail: details,
            user: userDetail
        };
    } else {
        context = {
            comments: commentsAll,
            articleDetail: details
        };
    };

    res.render("fullArticleView", context);
});

//route handler for the un-censored article
router.post("/article", async function (req, res) {
    // const clickedArticleId = req.body.articleId;
    // const articleDetail = await userDao.loadArticleDetails(clickedArticleId);

    let context;
    const articleId = req.body.articleId;
    const commentsAll = await userDao.loadComments(articleId);
    const details = await userDao.loadArticleDetails(articleId);
    if(req.session.user) {
        const userDetail = req.session.user;
        context = {
            comments: commentsAll,
            articleDetail: details,
            user: userDetail
        };
    } else {
        context = {
            comments: commentsAll,
            articleDetail: details
        };
    };
    
    res.render("fullArticleView", context);
});

//route handler for the creating a comment
router.post("/createComment", async function (req, res) {
    const user = req.session.user;
    const body = req.body;
    await userDao.createComment(user.userId, user.username, user.avatarId, body.articleId, body.content);
    const commentsAll = await userDao.loadComments(body.articleId);
    
    const details = await userDao.loadArticleDetails(body.articleId);
    const context = {
                comments: commentsAll,
                articleDetail: details
            };
    res.render("fullArticleView", context);
});

//route handler for the creating a reply comment
router.post("/createReply", async function (req, res) {
    const user = req.session.user;
    const jsonString = req.body.parent+'"}';
    const content = req.body["reply"];
    const reply = JSON.parse(jsonString);
    await userDao.setParent(reply.commentId);
    
    await userDao.createReply(user.userId, user.username, user.avatarId, reply.articleId, reply.commentId, content);
    const commentsAll = await userDao.loadComments(reply.articleId);
    const details = await userDao.loadArticleDetails(reply.articleId);
    const context = {
                comments: commentsAll,
                articleDetail: details
            };
    res.render("fullArticleView", context);
});

router.post("/deleteComment", async function (req, res) {
    const commentId = req.body.commentId;
    const articleId = await userDao.getArticleId(commentId);
    await userDao.deleteComment(commentId);

    
    const noparent = await userDao.getCommentsNoReply();
    for (let i = 0; i < noparent.length; i++) {
        const setNo = await userDao.setNoParent(noparent[i]);
        const parent = await setNo;
    }
    
    const commentsAll = await userDao.loadComments(articleId);
    const details = await userDao.loadArticleDetails(articleId);
    const context = {
                comments: commentsAll,
                articleDetail: details
            };
    res.render("fullArticleView", context);
});


router.get("/userArticleHistory", async function (req, res) {
    const user = req.session.user;
    const allArticles = await userDao.loadArticlesById(user.userId);
    const context = {
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
    const title = newArticle.title;
    const id = newArticle.articleId;
    const content = newArticle.wysiwyg;
    await userDao.updateArticle(id, title, content);
    const user = req.session.user;
    const allArticles = await userDao.loadArticlesById(user.userId);
    
    const context={
        articles: allArticles,
        user: user
    };
   
    res.render("userArticleHistory", context);
});

// router.get("/fullArticleView", function(req, res) {
    
//     // userDao.getComments(articleId);
//     res.render("fullArticleView");
// });

// router.post("/fullArticleView", upload.single(), async function(req, res) {
//     const textBody = req.body;
//     const context = {
//         comments: textBody.comment
//     };
//     res.render("fullArticleView", context);
// });

module.exports = router;