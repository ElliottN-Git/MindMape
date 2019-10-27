// Setup express router
const express = require("express");
const router = express.Router();
const upload = require("../modules/multer-uploader");
const fs = require("fs");
const userProcess = require("../modules/user-process");

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

    res.render("signUp", context);
});

router.post("/signup", upload.single("imageFile"), function(req, res) {
    const fileInfo = req.file;
    const userInfo = req.body;

    // Move the image into the images folder
    const oldFileName = fileInfo.path;
    const newFileName = `./public/images/${fileInfo.originalname}`;
    fs.renameSync(oldFileName, newFileName);

    // Store the new pokemon to the data file
    const newUser = {
        fname: userInfo.fname,
        lname: userInfo.lname,
        dob: userInfo.DOB,
        gender: userInfo.gender,
        email: userInfo.email,
        phNum: userInfo.phoneNum,
        country: userInfo.country,
        imageUrl: fileInfo.originalname
    };
    userProcess.validateUserData(newUser);

    // Redirect to the admin page
    res.redirect("/userProfile");

    
    // let detailsCookie = {
    //     name: req.body.name,
    //     address: req.body.address,
    //     phoneNum: req.body.phoneNum
    // };

    // res.cookie("details", detailsCookie);

    // if(detailsCookie.name == "" || detailsCookie.address == "" || detailsCookie.phoneNum =="") {
    //     res.redirect(`/login?message=Details saved for later`);
    // } else {
    //     res.redirect(`/userProfile`);
    // }
});

// Show the details stored in the cookie
router.get("/userProfile", function(req, res) {

    // const userCookie = req.cookies["details"];
    // const context = {
    //     name: userCookie.name,
    //     address: userCookie.address,
    //     phoneNum: userCookie.phoneNum
    // };
    
    res.render("userProfile");
});

// -------------------------------------------------------------------------

module.exports = router;