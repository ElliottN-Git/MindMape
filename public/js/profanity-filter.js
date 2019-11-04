//Checks the input string against the bannedWords regex 
// and returns true if any matches are found or false if not.
function isProfane(string) {
    const matches = string.match(bannedWords);
    if(matches != null) {
        console.log(`Contains banned word: ${matches}`);
        return true;
    } else {
        console.log(`Doesn't contain banned words`);
        return false;
    }
}
