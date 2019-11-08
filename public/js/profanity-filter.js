//submit button on write article page
const censorArticleBtn = document.querySelector("#censorArticleBtn");

censorArticleBtn.addEventListener("click", function() {
    const titleInput = document.querySelector("#title");
    const titleStr = titleInput.value;
    const censoredTitle = replaceBannedWords(titleStr);
    titleInput.value = censoredTitle;

    //For some reason doesn't get tinyMCE's innerHTML on first try,
        //the triggerSave() method fixes it.
    tinyMCE.triggerSave();
    const articleWYSIWYG = document.querySelector("#full-featured-non-premium");
    const articleContent = articleWYSIWYG.value;
    const censoredArticle = replaceBannedWords(articleContent);

    tinyMCE.activeEditor.setContent(censoredArticle);
});

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
