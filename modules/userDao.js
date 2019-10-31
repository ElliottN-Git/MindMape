const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");
const crypto = require("./crypto");

async function retrieveUserDataById(id) {
    const db = await dbPromise;

    const userData = await db.get(SQL`
        select * from users
        where userId = ${id}`);

    return userData;
}

async function retrieveAllUserData() {
    const db = await dbPromise;

    const allUserData = await db.all(SQL`select * from users`);
    return allUserData;
}

//Check if a username is already taken in the database
async function checkUserName(username) {
    const db = await dbPromise;
    const getUsername = await db.get(SQL`
    SELECT username FROM users
    WHERE username = ${username}`);

    if(getUsername != undefined) {
        return true;
    } else {
        return false;
    }
}

//Function called by login-routes when user enters their username and password
//TODO validate that the username exists first - call to checkuserName() above
//TODO testing to ensure the hashing is working properly

async function authenticateLogin(username, password) {

    const db = await dbPromise;
    const getUser = await db.all(SQL`
    SELECT * FROM users WHERE username = ${username}`);

    const dbHashedPassWord = getUser[0].pwordHash;

    const enteredHashedPassWord = crypto.sha512(password, getUser[0].pwordSalt);

    if(dbHashedPassWord === enteredHashedPassWord.passwordHash) {
        console.log("passwords match!");
        return getUser;
    } else {
        console.log("passwords DON'T match");
        return false;
    }
}

async function createUser(newUserData) {
    const db = await dbPromise;

    //Salt and hash password
    //Store only salt and hashed password
    //TODO two password input fields with string comparison on passwords
    const saltedHashedPword = crypto.saltHashPassword(newUserData.password);

    await db.run(SQL`
        INSERT INTO users (username, pwordSalt, pwordHash, fname, lname, dob, gender, email, phoneNum, avatarId, country, personalDescription) VALUES (
            ${newUserData.username}, 
            ${saltedHashedPword.salt},
            ${saltedHashedPword.passwordHash},
            ${newUserData.fname},
            ${newUserData.lname},
            ${newUserData.dob},
            ${newUserData.gender},
            ${newUserData.email},
            ${newUserData.phoneNum},
            ${newUserData.avatarId},
            ${newUserData.country},
            ${newUserData.personalDescription}            
        )`)
}

async function updateUserData(userData) {
    const db = await dbPromise;

    await db.run(SQL`
        update users
        set stuff = ${userData.stuff}
        where id = ${userData.id}`);
}

async function deleteUserData(id) {
    const db = await dbPromise;

    await db.run(SQL`
        delete from users
        where id = ${id}`);
}

// Export functions.
module.exports = {
    retrieveUserDataById,
    retrieveAllUserData,
    authenticateLogin,
    createUser,
    updateUserData,
    deleteUserData,
    checkUserName
};