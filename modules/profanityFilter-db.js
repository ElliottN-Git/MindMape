const bannedWords = require("./banned-words-regex-module");

//Checks the input string against the bannedWords regex 
// and returns true if any matches are found or false if not.
function isProfane(string) {
    const matches = string.match(bannedWords);
    if(matches != null) {
        return true;
    } else {
        return false;
    }
}

//Replaces any words that match bannedWords regex with "****"
function replaceBannedWords(string) {
    let censoredString = string.replace(bannedWords, "****");
    return censoredString;
}

module.exports = {
    isProfane,
    replaceBannedWords
};