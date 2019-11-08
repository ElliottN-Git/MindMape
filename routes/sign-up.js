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
const userProcess = require("../modules/user-process");
const userDao = require("../modules/userDao");

// Route handlers
// -------------------------------------------------------------------------

router.get("/signup", function(req, res) {
    const context = {
        signUpPage: true,
    }

    res.render("signUp", context);
});

//route handler for querying the database for username from client.js via fetch
router.get("/checkusernametaken", async function(req, res) {
    const username = req.query.username;
    const dbCheckIsTaken = await userDao.checkUserName(username);

    res.json(dbCheckIsTaken);
});

//route handler for querying the database for email from client.js via fetch
router.get("/checkemailtaken", async function(req, res) {
    const email = req.query.email;
    const dbCheckIsTaken = await userDao.checkEmail(email);

    res.json(dbCheckIsTaken);
});



//Submission of signup page 
//calls userDao.createUser() to save details in mindMAPE-db
router.post("/signup", upload.single("imageFile"), async function(req, res) {
    const userInfo = req.body;
    let avatarId = null;
    if(!req.file) { 
        if(req.body.avatar) {
            avatarId = `${req.body.avatar}`;
        } else {
            avatarId = "avatar_default.png";
        }
    } else {
        const fileInfo = req.file;
    
    // Move the image into the images folder
        const oldFileName = fileInfo.path;
        const newFileName = `./public/images/${fileInfo.originalname}`;
        fs.renameSync(oldFileName, newFileName);

    //Convert uploaded image to thumbnail-size.
        const image = await jimp.read(newFileName);
        image.resize(256, jimp.AUTO);
        await image.write(`./public/images/thumbnails/${fileInfo.originalname}`);
        avatarId = fileInfo.originalname;

    //delete full-sized image
        fs.unlinkSync(newFileName);
    }

    // Store the new user to the data file
    const newUser = {
        username: userInfo.userName,
        password: userInfo.password,
        fname: userInfo.fname,
        lname: userInfo.lname,
        dob: userInfo.DOB,
        gender: userInfo.gender,
        email: userInfo.email,
        phoneNum: userInfo.phoneNum,
        country: userInfo.country,
        avatarId: avatarId,
        personalDescription: userInfo.personal,
    }
    //output to console for testing
    // console.log(newUser);

    //Confirms all fields are properly filled out and the input is valid
    try {
        userProcess.validateUserData(newUser);
    } catch(err) {
        context = {
            message: err
        }
        res.render("signup", context);
    }
    //sends to the user data access object to create new user in db
        userDao.createUser(newUser);
        req.session.user = newUser;
        const userProfile = req.session.user;
        context = {
            user: userProfile
        };
    // Redirect to the userProfile page
        res.render("userProfile", context);
});



// -------------------------------------------------------------------------

module.exports = router;