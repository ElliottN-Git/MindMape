// Setup express router
const express = require("express");
const router = express.Router();

// Setup required modules
const verifyAuthenticated = require("../modules/verify-auth.js");

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
    const context = {
        user: req.session.user
    }
    res.render("userProfile", context);
});
// -------------------------------------------------------------------------


module.exports = router;