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
    if (getUser.length == "0") {
        return false;
    } else {
        const dbHashedPassWord = getUser[0].pwordHash;
        const enteredHashedPassWord = crypto.sha512(password, getUser[0].pwordSalt);
        if(dbHashedPassWord === enteredHashedPassWord.passwordHash) {
            return getUser;
        } else {
            return false;
        }
    }
}

// retrieve userdata using username <- to be used for createUser
async function retrieveUserDataByUsername(username) {
    const db = await dbPromise;

    const userData = await db.get(SQL`
        select * from users
        where username = ${username}`);

    return userData;
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
    const user = await retrieveUserDataByUsername(newUserData.username);
    return user;
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

async function deleteUserData(userId) {
    const db = await dbPromise;
    await db.run(SQL`
        delete from comments
        where userId = ${userId}`);
    await db.run(SQL`
        delete from articles
        where userId = ${userId}`);
    await db.run(SQL`
        delete from users
        where userId = ${userId}`);

    return "Deleted";
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
        delete from comments
        where articleId = ${articleId}`);
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

async function getArticleId(commentId) {
    const db = await dbPromise;
    const getArticleId = await db.all(SQL`
    SELECT articleId FROM comments WHERE commentId = ${commentId}`);
    return getArticleId[0].articleId;
}

async function loadComments(articleId) {
    const db = await dbPromise;
    const getComments = await db.all(SQL`
    SELECT * FROM comments WHERE articleId = ${articleId} ORDER By created_At DESC`);
    const commentsArray = makeArray(getComments);
    return commentsArray;
}

async function createComment(userId, username, avatarId, articleId, content) {
    const db = await dbPromise;
    await db.run(SQL`
    INSERT INTO comments (userId, username, avatarId, articleId, content, created_At, isParent) VALUES (
        ${userId},
        ${username},
        ${avatarId},
        ${articleId},
        ${content},
        datetime('now'),
        0
    )`);
         
}

async function createReply(userId, username, avatarId, articleId, parentCommentId, content) {
    const db = await dbPromise;
    
    await db.run(SQL`
    INSERT INTO comments (userId, username, avatarId, articleId, replyTo_Id, content, created_At, isParent) VALUES (
        ${userId},
        ${username},   
        ${avatarId},         
        ${articleId},
        ${parentCommentId},
        ${content},
        datetime('now'),
        0
    )`);
    
}

async function setParent(commentId) {
    const db = await dbPromise;

    await db.run(SQL`
        UPDATE comments
        SET isParent = 1
        WHERE commentId = ${commentId}`);


    // let data = [commentId];
    // let sql = `UPDATE comments
    //             SET isParent = 1
    //             WHERE commentId = ${commentId};`;
    // db.run(sql, data, function(err) {
    // if (err) {
    //     return console.error(err.message);
    // }
    // console.log(`Row(s) updated: ${this.changes}`);
    // });
}

async function noReply(commentId) {
    const db = await dbPromise;

    await db.run(SQL`
        UPDATE comments
        SET isParent = 0
        WHERE commentId = ${commentId}`);

    // let data = [commentId];
    // let sql = `UPDATE comments
    //             SET isParent = 0
    //             WHERE commentId = ${commentId};`;
    // db.run(sql, data, function(err) {
    // if (err) {
    //     return console.error(err.message);
    // }
    // console.log(`Row(s) updated: ${this.changes}`);
    // });
}

async function deleteComment(commentId) {
    const db = await dbPromise;
    await db.run(SQL`
    delete from comments
    where replyTo_Id = ${commentId}`);
    await db.run(SQL`
    delete from comments
    where commentId = ${commentId}`);

    // let data = [commentId];
    // let sql = `delete from comments WHERE commentId = ${commentId};`;
    // db.run(sql, data, function(err) {
    // if (err) {
    //     return console.error(err.message);
    // }
    // console.log(`Row(s) updated: ${this.changes}`);
    // });
}

async function setNoParent(commentId) {
    const db = await dbPromise;


    let sql = `UPDATE comments
                SET isParent = 0;`;
    db.run(sql, function(err) {
    if (err) {
        return console.error(err.message);
    }
    console.log(`Row(s) updated: ${this.changes}`);
    });
    
    await db.run(SQL`
    update comments set isParent = 1 where (select replyTo_Id from comments as c where c.replyTo_Id = comments.commentId)`);
}

async function getCommentsNoReply() {
    const db = await dbPromise;
    const getParent = await db.all(SQL`
    SELECT commentId from comments except SELECT s.commentId from comments as s, comments as i where s.commentId = i.replyTo_Id;`);
    const parentsArray = makeArray(getParent);
    return parentsArray;
}

async function isParent(commentId) {
    const db = await dbPromise;
    const getParent = await db.all(SQL`
    SELECT isParent from comments where commentId = ${commentId};`);
    return getParent;
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
    loadComments,
    createReply,
    deleteComment,
    getArticleId,
    setParent,
    noReply,
    setNoParent,
    getCommentsNoReply,
    isParent,
    retrieveUserDataByUsername
};