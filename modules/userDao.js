const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");
const { QueryTypes } = require('sequelize');
const crypto = require("./crypto");
const makeArray = require("./make-array");

async function retrieveUserDataById(id) {
    const db = await dbPromise;

    const userData = await db.query(SQL`
        select * from users
        where userid = ${id}`);
    return userData[0];
}

async function retrieveAllUserData() {
    const db = await dbPromise;

    const allUserData = await db.query(SQL`select * from users`);
    return allUserData[0];
}

//Check if a username is already taken in the database
async function checkUserName(username) {
    const db = await dbPromise;
    const getUsername = await db.query(SQL`
    SELECT username FROM users
    WHERE username = ${username}`);

    if (getUsername[1] != 0) {
        return true;
    } else {
        return false;
    }
}

//Check if an email is already taken in the database
async function checkEmail(email) {
    const db = await dbPromise;
    const getEmail = await db.query(SQL`
    SELECT email FROM users
    WHERE email = ${email}`);

    if (getEmail[1] != 0) {
        return true;
    } else {
        return false;
    }
}

//Function called by login-routes when user enters their username and password
async function authenticateLogin(username, password) {

    const db = await dbPromise;
    const getUser = await db.query(SQL`
    SELECT * FROM users WHERE username = ${username}`);
    if (getUser[1] == 0) {
        console.log("Auth failed: User not found");
        return false;
    } else {
        const dbHashedPassWord = getUser[0][0].pwordhash; //Note the getUser objects are must be named the same as in the db (case sensitive - .powrdHash won't work)
        const enteredHashedPassWord = crypto.sha512(password, getUser[0][0].pwordsalt);
        if (dbHashedPassWord === enteredHashedPassWord.passwordHash) {
            return getUser[0][0];
        } else {
            return false;
        }
    }
}

// retrieve userdata using username <- to be used for createUser
async function retrieveUserDataByUsername(username) {
    const db = await dbPromise;

    const userData = await db.query(SQL`
        select * from users
        where username = ${username}`);

    return userData[0];
}


async function createUser(newUserData) {
    const db = await dbPromise;

    //Salt and hash password
    //Stores only salt and hashed password
    const saltedHashedPword = crypto.saltHashPassword(newUserData.password);

    try {
        await db.query(SQL`
        INSERT INTO users (username, pwordSalt, pwordHash, fname, lname, dob, gender, email, phoneNum, avatarid, country, personalDescription) VALUES (
            ${newUserData.username}, 
            ${saltedHashedPword.salt},
            ${saltedHashedPword.passwordHash},
            ${newUserData.fname},
            ${newUserData.lname},
            ${newUserData.dob},
            ${newUserData.gender},
            ${newUserData.email},
            ${newUserData.phoneNum},
            ${newUserData.avatarid},
            ${newUserData.country},
            ${newUserData.personalDescription}            
        )`)
    } catch (error) {
        console.error('DB error:', error);
    }
    const user = await retrieveUserDataByUsername(newUserData.username);
    return user;
}

async function updateUserData(userData, userid) {
    const db = await dbPromise;

    await db.query(SQL`
        UPDATE users
        SET username = ${userData.username},
        fname = ${userData.fname},
        lname = ${userData.lname},
        email = ${userData.email},
        phoneNum = ${userData.phonenum},
        country = ${userData.country},
        dob = ${userData.DOB},
        gender = ${userData.gender},
        personalDescription = ${userData.personal}
        WHERE userid = ${userid}`);
}

async function updateUserAvatar(avatarid, userid) {
    const db = await dbPromise;

    await db.query(SQL`
        UPDATE users
        SET avatarid = ${avatarid}
        WHERE userid = ${userid}`);
}

async function deleteUserData(userid) {
    const db = await dbPromise;
    await db.query(SQL`
        delete from comments
        where userid = ${userid}`);
    await db.query(SQL`
        delete from articles
        where userid = ${userid}`);
    await db.query(SQL`
        delete from users
        where userid = ${userid}`);

    return "Deleted";
}

//articles queries
async function createArticle(userid, title, contents, username) {
    const db = await dbPromise;
    await db.query(SQL`
        INSERT INTO articles (title, content, userid, username, created_At) VALUES (
            ${title},
            ${contents},
            ${userid},
            ${username},
            CURRENT_TIMESTAMP                 
        )`);
}

// will add something like 'modified at' later
//Potential bugs here due to SQL query changed
async function updateArticle(id, title, content) {
    const db = await dbPromise;
    let data = [title, content, id];
    let sql = `UPDATE articles
                SET title = '${title}',
                content = '${content}'
                WHERE articleid = ${id};`;
    db.query(sql, data, function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Row(s) updated: ${this.changes}`);
    });

}

async function deleteArticle(articleid) {
    const db = await dbPromise;


    await db.query(SQL`
        delete from comments
        where articleid = ${articleid}`);
    await db.query(SQL`
        delete from articles
        where articleid = ${articleid}`);

}

async function loadArticleDetails(articleid) {
    const db = await dbPromise;

    const articleDetails = await db.query(SQL`
    SELECT * FROM articles WHERE articleid = ${articleid}`);
    return articleDetails[0][0];
}

async function loadArticlesById(userid) {
    const db = await dbPromise;

    const userArticle = await db.query(SQL`
    SELECT * FROM articles WHERE userid = ${userid} ORDER BY created_At DESC`);
    return userArticle[0];
}

async function loadAllArticles() {
    const db = dbPromise;

    const articles = await db.query(SQL`
    SELECT * FROM articles ORDER BY created_At DESC`);
    return articles[0];
}
//---------WITH COULD-SQL-CONNECTOR-----------//
// const { Connection, Request } = require('tedious');
// const { Connector } = require('@google-cloud/cloud-sql-connector');

// const connector = new Connector();
// const clientOpts = connector.getTediousOptions({
//     instanceConnectionName: 'neon-reporter-395414:europe-west2:mindmape',
//     ipType: 'PUBLIC'
// });
// const connection = new Connection({
//     // Please note that the `server` property here is not used and is only defined
//     // due to a bug in the tedious driver (ref: https://github.com/tediousjs/tedious/issues/1541)
//     // With that in mind, do not try to change this value since it will have no
//     // impact in how the connector works, this README will be updated to remove
//     // this property declaration as soon as the tedious driver bug is fixed
//     server: '0.0.0.0',
//     authentication: {
//         type: 'default',
//         options: {
//             userName: 'sqlserver',
//             password: ']Q*J@=aP[b88"#kX',
//         },
//     },
//     options: {
//         ...clientOpts,
//         // Please note that the `port` property here is not used and is only defined
//         // due to a bug in the tedious driver (ref: https://github.com/tediousjs/tedious/issues/1541)
//         // With that in mind, do not try to change this value since it will have no
//         // impact in how the connector works, this README will be updated to remove
//         // this property declaration as soon as the tedious driver bug is fixed
//         port: 9999,
//         database: 'mindmape',
//     },
// });

// connection.connect(err => {
//     if (err) { throw err; }
//     let result;
//     const req = new Request('SELECT GETUTCDATE()', (err) => {
//         if (err) { throw err; }
//     })
//     req.on('error', (err) => { throw err; });
//     req.on('row', (columns) => { result = columns; });
//     req.on('requestCompleted', () => {
//         console.table(result);
//     });
//     connection.execSql(req);
// });


// async function loadAllArticles() {
//     const req = new Request('SELECT * FROM articles ORDER BY created_At DESC', (err) => {
//         if (err) { throw err; }
//     })
//     req.on('error', (err) => { throw err; });
//     req.on('row', (columns) => { result = columns; });
//     req.on('requestCompleted', () => {
//         console.table(result);
//     });
//     connection.execSql(req);
// }

// connection.close();
// connector.close();

//----------------------------//


async function getarticleid(commentid) {
    const db = await dbPromise;
    const getarticleid = await db.query(SQL`
    SELECT articleid FROM comments WHERE commentid = ${commentid}`);
    return getarticleid[0].articleid;
}

async function loadComments(articleid) {
    const db = await dbPromise;
    const getComments = await db.query(SQL`
    SELECT * FROM comments WHERE articleid = ${articleid} ORDER By created_At DESC`);
    const commentsArray = makeArray(getComments);
    return commentsArray[0];
}

async function createComment(userid, username, avatarid, articleid, content) {
    const db = await dbPromise;
    await db.query(SQL`
    INSERT INTO comments (userid, username, avatarid, articleid, content, created_At, isParent) VALUES (
        ${userid},
        ${username},
        ${avatarid},
        ${articleid},
        ${content},
        CURRENT_TIMESTAMP,
        0
    )`);

}

async function createReply(userid, username, avatarid, articleid, parentCommentId, content) {
    const db = await dbPromise;

    await db.query(SQL`
    INSERT INTO comments (userid, username, avatarid, articleid, replyTo_Id, content, created_At, isParent) VALUES (
        ${userid},
        ${username},   
        ${avatarid},         
        ${articleid},
        ${parentCommentId},
        ${content},
        CURRENT_TIMESTAMP,
        0
    )`);

}

async function setParent(commentid) {
    const db = await dbPromise;

    await db.query(SQL`
        UPDATE comments
        SET isParent = 1
        WHERE commentid = ${commentid}`);


    // let data = [commentid];
    // let sql = `UPDATE comments
    //             SET isParent = 1
    //             WHERE commentid = ${commentid};`;
    // db.query(sql, data, function(err) {
    // if (err) {
    //     return console.error(err.message);
    // }
    // console.log(`Row(s) updated: ${this.changes}`);
    // });
}

async function noReply(commentid) {
    const db = await dbPromise;

    await db.query(SQL`
        UPDATE comments
        SET isParent = 0
        WHERE commentid = ${commentid}`);

    // let data = [commentid];
    // let sql = `UPDATE comments
    //             SET isParent = 0
    //             WHERE commentid = ${commentid};`;
    // db.query(sql, data, function(err) {
    // if (err) {
    //     return console.error(err.message);
    // }
    // console.log(`Row(s) updated: ${this.changes}`);
    // });
}

async function deleteComment(commentid) {
    const db = await dbPromise;
    await db.query(SQL`
    delete from comments
    where replyTo_Id = ${commentid}`);
    await db.query(SQL`
    delete from comments
    where commentid = ${commentid}`);

    // let data = [commentid];
    // let sql = `delete from comments WHERE commentid = ${commentid};`;
    // db.query(sql, data, function(err) {
    // if (err) {
    //     return console.error(err.message);
    // }
    // console.log(`Row(s) updated: ${this.changes}`);
    // });
}

async function setNoParent(commentid) {
    const db = await dbPromise;


    let sql = `UPDATE comments
                SET isParent = 0;`;
    db.query(sql, function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Row(s) updated: ${this.changes}`);
    });

    await db.query(SQL`
    update comments set isParent = 1 where (select replyTo_Id from comments as c where c.replyTo_Id = comments.commentid)`);
}

async function getCommentsNoReply() {
    const db = await dbPromise;
    const getParent = await db.query(SQL`
    SELECT commentid from comments except SELECT s.commentid from comments as s, comments as i where s.commentid = i.replyTo_Id;`);
    const parentsArray = makeArray(getParent[0]);
    return parentsArray;
}

async function isParent(commentid) {
    const db = await dbPromise;
    const getParent = await db.query(SQL`
    SELECT isParent from comments where commentid = ${commentid};`);
    return getParent[0];
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
    getarticleid,
    setParent,
    noReply,
    setNoParent,
    getCommentsNoReply,
    isParent,
    retrieveUserDataByUsername
};