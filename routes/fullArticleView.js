const express = require("express");
const router = express.Router();
// Setup multer-uploader
const upload = require("../modules/multer-uploader");

router.get("/fullArticleView", function(req, res) {

    res.render("fullArticleView");
});

router.post("/fullArticleView", upload.single("imageFile"), async function(req, res) {
    const textBody = req.body;
    console.log(textBody.comment);
    const context = {
        text: textBody.comment
    };
    res.render("fullArticleView", context);
});

module.exports = router;