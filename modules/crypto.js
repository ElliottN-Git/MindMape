// Setup crypto
const crypto = require('crypto');

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
const genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
const sha512 = function(password, salt){
    const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    const value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value  //these two values are to be stored in users in DB
    };
};

function saltHashPassword(userpassword) {
    const salt = genRandomString(16); /** Gives us salt of length 16 */
    const passwordData = sha512(userpassword, salt);

    //TODO remove -- testing only!
    console.log('UserPassword = '+userpassword);
    console.log('nSalt = '+passwordData.salt);
    console.log('Passwordhash = '+passwordData.passwordHash);

    return {
        salt: passwordData.salt,
        passwordHash: passwordData.passwordHash
    };
}

//Test to show that the hashed and salted password is different each time even for the same password
//saltHashPassword('MYPASSWORD');
//saltHashPassword('MYPASSWORD');

// sha512(userPasswordInput, saltFromDB) compared to storedHashedPword.

module.exports = {
    saltHashPassword,
    sha512
};