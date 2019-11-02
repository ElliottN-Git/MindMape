// Setup express router
const express = require("express");
const router = express.Router();

// Setup multer-uploader
const upload = require("../modules/multer-uploader");

// Setup fs
const fs = require("fs");

// Setup required modules
const userProcess = require("../modules/user-process");
const userDao = require("../modules/userDao");

// Route handlers
// -------------------------------------------------------------------------

router.get("/signup", function(req, res) {

    // let context;
    // if(req.cookies["details"]){
    //     const userCookie = req.cookies["details"];
    //     context = {
    //         message: req.query.message,
    //         name: userCookie.name,
    //         address: userCookie.address,
    //         phoneNum: userCookie.phoneNum
    //     };
 
    // } else {
    //     context = {
    //         message: req.query.message
    //     };
    // }

    res.render("signUp"); //context object commented out for testing
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
router.post("/signup", upload.single("imageFile"), function(req, res) {
    const fileInfo = req.file;
    console.log(fileInfo);
    const userInfo = req.body;

    // Move the image into the images folder
    const oldFileName = fileInfo.path;
    const newFileName = `./public/images/${fileInfo.originalname}`;
    fs.renameSync(oldFileName, newFileName);

    //TODO convert uploaded image to thumbnail-size.

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
        avatarId: fileInfo.originalname,
        personalDescription: userInfo.personal,
        imageUrl: newFileName
    };
    //output to console for testing
    console.log(newUser);
    //confirms all fields are properly filled out and the input is valid
    //If username is taken will throw error - need to improve error handling so it's not just
    //blank page with the message
    if(userProcess.validateUserData(newUser)) {
        //sends to the user data access object to create new user in db
        userDao.createUser(newUser);
        req.session.user = req.body;
        const user = req.session.user;
        // Redirect to the userProfile page
        res.render("userProfile", user);
    }
});



// -------------------------------------------------------------------------

module.exports = router;