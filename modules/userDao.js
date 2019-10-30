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

async function checkUserName(userName) {
    const db = await dbPromise;
    const getUsername = await db.get(SQL`
    SELECT username FROM users
    WHERE username = ${userName}`);
    return getUsername;
    // if(getUsername == undefined) {
    //     return false;
    // } else {
    //     return true;
    // }
}

async function authenticateLogin(username, password) {
    const testPwordHash = crypto.sha512("testpword", "abe7a99ea2ca7d0a");
    console.log(testPwordHash);


    const db = await dbPromise;
    const getUser = await db.get(SQL`
    SELECT * FROM users WHERE @username = "${username}"`);

    console.log(getUser);

    const dbHashedPassWord = getUser.pwordHash;
    console.log(dbHashedPassWord);
    const enteredHashedPassWord = crypto.sha512(password, getUser.pwordSalt);
    console.log(enteredHashedPassWord);

    if(dbHashedPassWord === enteredHashedPassWord.passwordHash) {
        return getUser;
    }
}

async function createUser(newUserData) {
    const db = await dbPromise;

    //Salt and hash password
    //Store only salt and hashed password
    //TODO two password input fields with string comparison on passwords
    const saltedHashedPword = crypto.saltHashPassword(newUserData.password);
    console.log(`Salt is: ${saltedHashedPword.salt}`);
    console.log(`Hashed pword is: ${saltedHashedPword.passwordHash}`);


    await db.run(SQL`
        INSERT INTO users (username, pwordSalt, pwordHash, fname, lname, dob, gender, email, phoneNum, avatarId, country) VALUES (
            ${newUserData.username}, 
            ${saltedHashedPword.salt},
            ${saltedHashedPword.passwordHash},
            ${newUserData.fname},
            ${newUserData.lname},
            ${newUserData.dob},
            ${newUserData.gender},
            ${newUserData.email},
            ${newUserData.phoneNum},
            ${newUserData.country},
            ${newUserData.personalDescription},
            ${newUserData.imageUrl}
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