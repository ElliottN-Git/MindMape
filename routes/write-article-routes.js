// Setup express router
const express = require("express");
const router = express.Router();

// Setup multer-uploader
const upload = require("../modules/multer-uploader");


// Setup required modules
const userDao = require("../modules/userDao");
const verifyAuthenticated = require("../modules/verify-auth.js");

// Route handlers
// -------------------------------------------------------------------------

router.get("/writeArticle", verifyAuthenticated, async function(req, res) {
    const context = {
        writePage: true
    }
    
    res.render("writeArticle", context);
});

router.post("/editArticle", async function(req, res) {
    const user = req.session.user;
    const articleId = req.body.articleId;
    const articleDetail = await userDao.loadArticleDetails(articleId);
    if(user.userId == articleDetail.userId){
        const context = {
            content: articleDetail.content,
            title: articleDetail.title,
            articleId: articleDetail.articleId
        };
        res.render("writeArticle", context);
    }
    
});

router.post("/writeArticle", upload.single("wysiwyg"), async function(req, res) {
    const title = req.body.title;
    const body = req.body.wysiwyg;
    const user = req.session.user;
    const writeArticle = await userDao.createArticle(user.userId, title, body, user.username);
    
    res.redirect("./article");
});


router.post('/upload', upload.single('file'), function(req, res) {
    
    res.json({
    "location": '\/uploads\/' + req.file.filename
    });
    
});



// -------------------------------------------------------------------------

module.exports = router;