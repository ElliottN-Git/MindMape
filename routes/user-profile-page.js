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
    const userid = req.session.user.userid

    await userDao.updateUserData(updatedUser, userid);
    const updatedSession = await userDao.retrieveUserDataById(userid);
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

    const userid = req.session.user.userid

    // Move the image into the images folder
        const oldFileName = fileInfo.path;
        const newFileName = `./public/images/${fileInfo.originalname}`;
        fs.renameSync(oldFileName, newFileName);

    //Convert uploaded image to thumbnail-size.
        const image = await jimp.read(newFileName);
        image.resize(256, jimp.AUTO);
        await image.write(`./public/images/thumbnails/${fileInfo.originalname}`);
        
        const avatarid = fileInfo.originalname;

    //delete full-sized image
        fs.unlinkSync(newFileName);

    //update the user in the database
        await userDao.updateUserAvatar(avatarid, userid);

        const updatedSession = await userDao.retrieveUserDataById(userid);
        req.session.user = updatedSession;
        const context = {
            loggedIn: true,
            user: req.session.user,
            message: "Successfully updated your avatar."
        }
        res.render("userProfile", context);
});


router.post("/deleteProfile", verifyAuthenticated, async function(req, res) {
    await userDao.deleteUserData(req.session.user.userid);

    if (req.session.user) {
        delete req.session.user;
    }

    context = {
        user: null,
        loggedIn: false,
        message: "Your profile has been deleted."
    }

    res.render("home", context);
});
// -------------------------------------------------------------------------


module.exports = router;