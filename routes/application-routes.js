const express = require("express");
const router = express.Router();
// Setup multer-uploader
const upload = require("../modules/multer-uploader");
const userDao = require("../modules/userDao");

const profanityFilter = require("../modules/profanityFilter-db");
const verifyAuthenticated = require("../modules/verify-auth.js");

router.get("/", async function(req, res) {
    const allArticles = await userDao.loadAllArticles();

    for(let i = 0; i < allArticles.length; i++) {
        const censoredTitle = profanityFilter.replaceBannedWords(allArticles[i].title);
        allArticles[i].title = censoredTitle;

        const censoredArticle = profanityFilter.replaceBannedWords(allArticles[i].content);
        allArticles[i].content = censoredArticle;
    }

    let context;

    if(req.session.user) {
        context = {
            articles: allArticles,
            homePage: true,
            user: req.session.user
        }
    } else {
        context = {
            articles: allArticles,
            homePage: true,
            notLogged: true,
            message: "Please log in"
        }
    }
    
    res.render("home", context);
});


module.exports = router;