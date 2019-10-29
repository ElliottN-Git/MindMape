const express = require("express");
const router = express.Router();

const testDao = require("../modules/test-dao.js");

const verifyAuthenticated = require("../modules/verify-auth.js");

router.get("/", verifyAuthenticated, async function(req, res) {

    res.render("home");
});

module.exports = router;