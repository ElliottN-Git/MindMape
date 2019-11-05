// Setup express router
const express = require("express");
const router = express.Router();

// Setup required modules
const verifyAuthenticated = require("../modules/verify-auth.js");
const userDao = require("../modules/userDao");

// Route handlers
// -------------------------------------------------------------------------


router.get("/userProfile", verifyAuthenticated, async function(req, res) {
    const context = {
        user: req.session.user
    }
    res.render("userProfile", context);
});

router.post("/updateUserProfile", verifyAuthenticated, async function(req, res){
    //TODO userDao.updateUser
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
    // console.log(context);
    res.render("userProfile", context);
});
// -------------------------------------------------------------------------


module.exports = router;