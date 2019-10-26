const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function createTestData(testData) {
    const db = await dbPromise;

    const result = await db.run(SQL`
        insert into test (stuff) values(${testData.stuff})`);

    testData.id = result.lastID;
}

async function retrieveUserDataById(id) {
    const db = await dbPromise;

    const testData = await db.get(SQL`
        select * from users
        where userId = ${id}`);

    return testData;
}

async function retrieveAllUserData() {
    const db = await dbPromise;

    const allTestData = await db.all(SQL`select * from users`);

    return allTestData;
}

async function createUser(newUserData) {
    const db = await dbPromise;

    await db.run(SQL`
        INSERT INTO users (username, pwordSalt, pwordHash, fname, lname, age, gender, email, ph_Num, avatarId, country) VALUES (
            ${newUserData.username}
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
    createTestData,
    retrieveUserDataById,
    retrieveAllUserData,
    createUser,
    updateUserData,
    deleteUserData
};