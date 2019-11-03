//Client-side js for event handling

//select username entry and error message elements
const enteredUserName = document.querySelector("#txtUName");
const usernameTakenElement = document.querySelector("#usernameTaken");

//event handler for username entry input
enteredUserName.addEventListener("keyup", function() {
    checkUniqueUsername(enteredUserName.value);
});


//Check username is unique
async function checkUniqueUsername(username) {

    let response = await fetch(`http://localhost:3000/checkusernametaken?username=${username}`);
    let isTaken = await response.json();

    if(isTaken == true) {
        usernameTakenElement.style.display = "block";
    } else {
        usernameTakenElement.style.display = "none";
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
    console.log(selectedImgName);

    const radioButton = document.querySelector(`#${selectedImgName}`);
    console.log(radioButton);

    if(alreadySelected && alreadySelected != parentLI) {
        alreadySelected.classList.toggle("selected");
        parentLI.classList.toggle("selected");
    } else {
        parentLI.classList.toggle("selected");
        imgUploadDiv.classList.toggle("d-none");
    }
});

    //check password re-enter box on sign-up page
    $('#password, #confirm-password').on('keyup', function () {
        if ($('#password').val() == $('#confirm-password').val()) {
            $('#message').html('Matching').css('color', 'green');
        } else 
            $('#message').html('Not Matching').css('color', 'red');
    });
