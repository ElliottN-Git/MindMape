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
    const articleid = req.body.articleid; //TODO check this doesn't need to be updated to 'articleid'

    // Loading linked article details then apply profanity filter.
    let details = await userDao.loadArticleDetails(articleid);

    const censoredArticleTitle = profanityFilter.replaceBannedWords(details.title);
    details.title = censoredArticleTitle;

    const censoredArticleContent = profanityFilter.replaceBannedWords(details.content);
    details.content = censoredArticleContent;

    // Loading linked comments (if there is) then apply profanity filter.
    const commentsAll = await userDao.loadComments(articleid);
    
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
    // const clickedarticleid = req.body.articleid;
    // const articleDetail = await userDao.loadArticleDetails(clickedarticleid);

    let context;
    const articleid = req.body.articleid;
    const commentsAll = await userDao.loadComments(articleid);
    const details = await userDao.loadArticleDetails(articleid);
    console.log("articleDetails: " + JSON.stringify(details));
    console.log("articleDetails.title: " + details.title);
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
    await userDao.createComment(user.userid, user.username, user.avatarid, body.articleid, body.content); //TODO Update to lowercase
    const commentsAll = await userDao.loadComments(body.articleid);
    
    const details = await userDao.loadArticleDetails(body.articleid);
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
    await userDao.setParent(reply.commentid);
    
    await userDao.createReply(user.userid, user.username, user.avatarid, reply.articleid, reply.commentid, content);
    const commentsAll = await userDao.loadComments(reply.articleid);
    const details = await userDao.loadArticleDetails(reply.articleid);
    const context = {
                comments: commentsAll,
                articleDetail: details
            };
    res.render("fullArticleView", context);
});

router.post("/deleteComment", async function (req, res) {
    const commentid = req.body.commentid;
    const articleid = await userDao.getarticleid(commentid);
    await userDao.deleteComment(commentid);

    
    const noparent = await userDao.getCommentsNoReply();
    for (let i = 0; i < noparent.length; i++) {
        const setNo = await userDao.setNoParent(noparent[i]);
        const parent = await setNo;
    }
    
    const commentsAll = await userDao.loadComments(articleid);
    const details = await userDao.loadArticleDetails(articleid);
    const context = {
                comments: commentsAll,
                articleDetail: details
            };
    res.render("fullArticleView", context);
});


router.get("/userArticleHistory", async function (req, res) {
    const user = req.session.user;
    console.log("user.userid: " + user.userid);
    const allArticles = await userDao.loadArticlesById(user.userid);
    const context = {
        historyPage: true,
        articles: allArticles
    };
   
    res.render("userArticleHistory", context);
});

router.post("/userArticleHistory", async function (req, res) {
    const clickedarticleid = req.body.articleid;
    const articleDetail = await userDao.loadArticleDetails(clickedarticleid);
    res.render("fullArticleView", articleDetail);
});

router.post("/deleteArticle", async function (req, res) {
    const articleid = req.body.articleid;
    const deleteArticle = await userDao.deleteArticle(articleid);
    const user = req.session.user;
    const allArticles = await userDao.loadArticlesById(user.userid);
    
    const context={
        articles: allArticles,
        user: user
    };
   
    res.render("userArticleHistory", context);
});

router.post("/updateArticle", upload.single(), async function (req, res) {
    const newArticle = req.body;
    const title = newArticle.title;
    const id = newArticle.articleid;
    const content = newArticle.wysiwyg;
    await userDao.updateArticle(id, title, content);
    const user = req.session.user;
    const allArticles = await userDao.loadArticlesById(user.userid);
    
    const context={
        articles: allArticles,
        user: user
    };
   
    res.render("userArticleHistory", context);
});

// router.get("/fullArticleView", function(req, res) {
    
//     // userDao.getComments(articleid);
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