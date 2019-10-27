const fs = require("fs");

function validateUserData(user) {
    if (!user.fname) {
        throw "no first name!";
    }
    if (!user.lname) {
        throw "no last name!";
    }
    if (!user.username) {
        throw "no username!";
    }
    if (!user.password) {
        throw "no password!";
    }
    if (!user.DOB) {
        throw "no date of birth!";
    }
    if (!user.imageUrl) {
        throw "no imageUrl!";
    }
    if (!user.email) {
        throw "no email!";
    }
    if (user.gender === undefined) {
        throw "undefined gender!";
    }
    if (user.country === undefined) {
        throw "undefined country!";
    }
    if (isNaN(user.phoneNum)) {
        throw "Supplied phone number is not a number!";
    }

    return {
        fname: user.fname,
        lname: user.lname,
        imageUrl: user.imageUrl,
        DOB: user.DOB,
        gender: user.gender,
        phoneNum: user.phoneNum,
        email: user.email,
        country: user.country,
        username: user.username,
        password: user.password
    }
}



// Export the following functions so they can be accessed outside of this file by
// using require().
module.exports = {
    validateUserData
};