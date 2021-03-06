//Client-side js for event handling

//select username entry and error message elements
const enteredUserName = document.querySelector("#txtUName");
const usernameTakenSpan = document.querySelector("#usernameTaken");
const bannedWordSpan = document.querySelector("#bannedWord");
const signupSubmitBtn = document.querySelector("#submitBtn");

// event handler for username entry input
enteredUserName.addEventListener("keyup", async function() {
    const uNameTaken = await checkUniqueUsername(enteredUserName.value);
    if(uNameTaken) {
        return;
    } else {
        checkUsernameForProfanity(enteredUserName.value);
    }
});

function checkUsernameForProfanity(username) {
    if(isProfane(username)) {
        bannedWordSpan.style.display = "block";
        signupSubmitBtn.disabled = "true";
    } else {
        bannedWordSpan.style.display = "none";
        signupSubmitBtn.disabled = false;
    }
}


//Check username is unique
async function checkUniqueUsername(username) {

    let response = await fetch(`http://localhost:3000/checkusernametaken?username=${username}`);
    let isTaken = await response.json();

    if(isTaken == true) {
        usernameTakenSpan.style.display = "block";
        signupSubmitBtn.disabled = true;
        return true;
    } else {
        usernameTakenSpan.style.display = "none";
        signupSubmitBtn.disabled = false;
        return false;
    }
}

//select email entry and error message elements
const enteredEmail = document.querySelector("#txtEmail");
const emailTakenElement = document.querySelector("#emailTaken");

//event handler for email entry input
enteredEmail.addEventListener("keyup", function() {
    checkUniqueEmail(enteredEmail.value);
});


//Check email is unique
async function checkUniqueEmail(email) {

    let response = await fetch(`http://localhost:3000/checkemailtaken?email=${email}`);
    let isTaken = await response.json();

    if(isTaken == true) {
        emailTakenElement.style.display = "block";
    } else {
        emailTakenElement.style.display = "none";
    }
}

//Personal description
const personalDescTxtArea = document.querySelector("#personal");
//Filters profanity in the personal description on deselection of the textbox
personalDescTxtArea.addEventListener("blur", function() {
    const description = personalDescTxtArea.value;
    const censoredDesc = replaceBannedWords(description);
    personalDescTxtArea.value = censoredDesc;
});

//Clear the image file selected to be uploaded
const clearFileInputBtn = document.querySelector("#clearImgUpload");

clearFileInputBtn.addEventListener("click", function(){
    resetFileInput();
})

function resetFileInput() {
    const filledFileInput = document.querySelector("#inpFile");
    const clearedFileInput = document.createElement("input");
    clearedFileInput.id = "inpFile";
    clearedFileInput.type = "file";
    clearedFileInput.name = "imageFile";
    clearedFileInput.accept = ".png,.jpg,.jpeg,.bmp,.gif";

    filledFileInput.parentNode.replaceChild(clearedFileInput, filledFileInput);
}

//Determine selected avatar image
const avatarList = document.querySelector("#avatarOptions");
const imgUploadDiv = document.querySelector("#imageUpload");

//Toggle class "selected" on clicked avatar for animation
avatarList.addEventListener("click", function(e) {
    resetFileInput();
    

    const alreadySelected = document.querySelector(".imageli.selected");
    const selectedLIImg = e.target;
    const parentLI = selectedLIImg.parentElement;

    const selectedImgName = selectedLIImg.name;
    const radioButton = document.querySelector(`#${selectedImgName}`);

//different avatar is already selected, unselect it and select the avatar that was clicked on
//hides or reveals the image upload div depending on if an avatar is "selected"
    if(alreadySelected && alreadySelected != parentLI) {
        alreadySelected.classList.toggle("selected");
        parentLI.classList.toggle("selected");
        if(radioButton.checked == "true"){
            radioButton.checked = "false";
            imgUploadDiv.classList.remove("hidden");
        } else {
            radioButton.checked = "true";
            imgUploadDiv.classList.add("hidden");
        }
//same avatar was clicked, unselect it and hide the image upload div
    } else {
        parentLI.classList.toggle("selected");
        radioButton.checked = "true"; 
        imgUploadDiv.classList.toggle("hidden");
    }
});

    //check password re-enter box on sign-up page
    $('#password, #confirm-password').on('keyup', function () {
        if ($('#password').val() == $('#confirm-password').val()) {
            signupSubmitBtn.disabled = false;
            $('#message').html('Matching').css('color', 'green');
        } else {
            signupSubmitBtn.disabled = true;
            $('#message').html('Not Matching').css('color', 'red');
        }
    });


