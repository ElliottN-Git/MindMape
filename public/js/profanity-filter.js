//submit button on write article page
const censorArticleBtn = document.querySelector("#censorArticleBtn");

postArticleBtn.addEventListener("click", function() {
    let titleStr = document.querySelector("#title").value;
    replaceBannedWords(titleStr);

    //For some reason doesn't get innerHTML on first try, only after page is reloaded?
        //Looks like the triggerSave() method fixes it.
    tinyMCE.triggerSave();
    let articleContent = document.querySelector("#full-featured-non-premium").value;
    // console.log(document.querySelector("#full-featured-non-premium"));
    const censoredArticle = replaceBannedWords(articleContent);

    tinyMCE.triggerSave();

    const tinyMCE = document.querySelector("#tinymce");
    console.log(tinyMCE);
    tinyMCE.innerHTML = censoredArticle;

    tinyMCE.triggerSave();

    // articleContent = censoredArticle;
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
    console.log(censoredString);
    return censoredString;
}
