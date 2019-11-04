//submit button on write article page
const postArticleBtn = document.querySelector("#postArticleBtn");

postArticleBtn.addEventListener("click", function() {
    const titleStr = document.querySelector("#title").value;
    console.log(titleStr);
    replaceBannedWords(titleStr);

    const articleContent = document.querySelector("#full-featured-non-premium").value;
    console.log(articleContent);
    replaceBannedWords(articleContent);
});

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

function replaceBannedWords(string) {
    let censoredString = string.replace(bannedWords, "****");
    console.log(censoredString);
    return censoredString;
}
