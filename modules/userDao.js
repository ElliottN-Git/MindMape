const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");
const crypto = require("./crypto");
const makeArray = require("./make-array");

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

//Check if an email is already taken in the database
async function checkEmail(email) {
    const db = await dbPromise;
    const getEmail = await db.get(SQL`
    SELECT email FROM users
    WHERE email = ${email}`);

    if(getEmail != undefined) {
        return true;
    } else {
        return false;
    }
}

//Function called by login-routes when user enters their username and password
async function authenticateLogin(username, password) {

    const db = await dbPromise;
    const getUser = await db.all(SQL`
    SELECT * FROM users WHERE username = ${username}`);

    const dbHashedPassWord = getUser[0].pwordHash;

    const enteredHashedPassWord = crypto.sha512(password, getUser[0].pwordSalt);

    if(dbHashedPassWord === enteredHashedPassWord.passwordHash) {
        return getUser;
    } else {
        return false;
    }
}

async function createUser(newUserData) {
    const db = await dbPromise;

    //Salt and hash password
    //Stores only salt and hashed password
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

async function updateUserData(userData, userId) {
    const db = await dbPromise;

    await db.run(SQL`
        UPDATE users
        SET username = ${userData.username},
        fname = ${userData.fname},
        lname = ${userData.lname},
        email = ${userData.email},
        phoneNum = ${userData.phonenum},
        country = ${userData.country},
        gender = ${userData.gender}
        WHERE userId = ${userId}`);
}

async function updateUserAvatar(avatarId, userId) {
    const db = await dbPromise;

    await db.run(SQL`
        UPDATE users
        SET avatarId = ${avatarId}
        WHERE userId = ${userId}`);
}

async function deleteUserData(user) {
    const db = await dbPromise;

    await db.run(SQL`
        delete from users
        where id = ${user.id}`);
}

//articles from here.
//maybe create another Dao js for tidying in the future.

async function createArticle(userId, title, contents, username) {
    const db = await dbPromise;
    await db.run(SQL`
        INSERT INTO articles (title, content, userId, username, created_At) VALUES (
            ${title},
            ${contents},
            ${userId},
            ${username},
            datetime('now')                 
        )`);
}

// will add something like 'modified at' later
async function updateArticle(id, title, content) {
    const db = await dbPromise;
    // await db.run(SQL`update articles set title = '${title}', content = '${content}' where articleId = ${id}`);
    // await db.run(SQL`update articles set content = '${content}' where articleId = ${id}`);
    let data = [title, content, id];
    let sql = `UPDATE articles
                SET title = '${title}',
                content = '${content}'
                WHERE articleId = ${id};`;
    db.run(sql, data, function(err) {
    if (err) {
        return console.error(err.message);
    }
    console.log(`Row(s) updated: ${this.changes}`);
    });
    
}

async function deleteArticle(articleId) {
    const db = await dbPromise;

    await db.run(SQL`
        delete from articles
        where articleId = ${articleId}`);
}

async function loadArticleDetails(articleId) {
    const db = await dbPromise;

    const articleDetails = await db.all(SQL`
    SELECT * FROM articles WHERE articleId = ${articleId}`);
    return articleDetails[0];
}

async function loadArticlesById(userId) {
    const db = await dbPromise;

    const userArticle = await db.all(SQL`
    SELECT * FROM articles WHERE userId = ${userId} ORDER BY created_At DESC`);
    return userArticle;
}

async function loadAllArticles() {
    const db = await dbPromise;

    const articles = await db.all(SQL`
    SELECT * FROM articles ORDER BY created_At DESC`);
    return articles;
}

// testing
async function getComments(articleId) {
    const db = await dbPromise;
    const getComments = await db.all(SQL`
    SELECT * FROM comments WHERE articleId = ${articleId} ORDER By created_At DESC`);
    const commentsArray = makeArray(getComments);
    return commentsArray;
}

async function createComment(userId, content, articleId, parentCommentId) {
    const db = await dbPromise;
    if(parentCommentId) {
        await db.run(SQL`
        INSERT INTO comments (userId, articleId, replyTo_Id content, created_At) VALUES (
            ${userId},
            ${articleId},
            ${parentCommentId},
            ${content},
            datetime('now')
        )`);
    } else {
        await db.run(SQL`
        INSERT INTO comments (userId, articleId, content, created_At) VALUES (
            ${userId},
            ${articleId},
            ${content},
            datetime('now')
        )`);
    }
    
    
}

// Export functions.
module.exports = {
    retrieveUserDataById,
    retrieveAllUserData,
    authenticateLogin,
    createUser,
    updateUserData,
    updateUserAvatar,
    deleteUserData,
    checkUserName,
    checkEmail,
    createArticle,
    deleteArticle,
    updateArticle,
    loadArticleDetails,
    loadArticlesById,
    loadAllArticles,
    createComment,
    getComments
};