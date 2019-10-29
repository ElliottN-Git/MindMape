const fs = require("fs");
const userDao = require("../modules/userDao");

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
    //Commented out for testing signup details to database
    // if (!user.password) {
    //     throw "no password!";
    // }
    if (!user.dob) {
        throw "No date of birth!";
    }
    if (!user.imageUrl) {
        throw "No imageUrl!";
    }
    if (!user.email) {
        throw "No email!";
    }
    if (user.gender === undefined) {
        throw "Undefined gender!";
    }
    if (user.country === undefined) {
        throw "Undefined country!";
    }
    if (isNaN(user.phoneNum)) {
        throw "Supplied phone number is not a number!";
    }

    if(userDao.checkUserName(user.username) == user.username) {
        throw message = "Username already taken!";
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