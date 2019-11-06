// Setup express router
const express = require("express");
const router = express.Router();

// Setup multer-uploader
const upload = require("../modules/multer-uploader");

// Setup fs
const fs = require("fs");

// Setup jimp
const jimp = require("jimp");

// Setup required modules
const verifyAuthenticated = require("../modules/verify-auth.js");
const userDao = require("../modules/userDao");

// Route handlers
// -------------------------------------------------------------------------


router.get("/userProfile", verifyAuthenticated, async function(req, res) {
    const context = {
        user: req.session.user,
        profilePage: true
    }
    res.render("userProfile", context);
});

router.post("/updateUserProfile", verifyAuthenticated, async function(req, res) {
    const updatedUser = req.body;
    const userId = req.session.user.userId

    await userDao.updateUserData(updatedUser, userId);
    const updatedSession = await userDao.retrieveUserDataById(userId);
    req.session.user = updatedSession;
    const context = {
        loggedIn: true,
        user: req.session.user,
        message: "Successfully updated your profile."
    }
    res.render("userProfile", context);
});

router.post("/changeAvatar", verifyAuthenticated, upload.single("imageFile"), async function(req, res) {
    const fileInfo = req.file;
    if(fileInfo == undefined) {
        const context = {
            loggedIn: true,
            user: req.session.user,
            message: "No new avatar selected!"
        }
    res.render("userProfile", context);
    }

    const userId = req.session.user.userId

    // Move the image into the images folder
        const oldFileName = fileInfo.path;
        const newFileName = `./public/images/${fileInfo.originalname}`;
        fs.renameSync(oldFileName, newFileName);

    //Convert uploaded image to thumbnail-size.
        const image = await jimp.read(newFileName);
        image.resize(256, jimp.AUTO);
        await image.write(`./public/images/thumbnails/${fileInfo.originalname}`);
        
        const avatarId = fileInfo.originalname;

    //delete full-sized image
        fs.unlinkSync(newFileName);

    //update the user in the database
        await userDao.updateUserAvatar(avatarId, userId);

        const updatedSession = await userDao.retrieveUserDataById(userId);
        req.session.user = updatedSession;
        const context = {
            loggedIn: true,
            user: req.session.user,
            message: "Successfully updated your avatar."
        }
        res.render("userProfile", context);
});
// -------------------------------------------------------------------------


module.exports = router;