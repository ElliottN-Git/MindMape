
//Client-side js for event handling
const enteredUserName = document.querySelector("#txtUName");
const usernameTakenElement = document.querySelector("#usernameTaken");
console.log(enteredUserName);

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

//Check email is unique
async function checkUniqueUsername(email) {

    let response = await fetch(`http://localhost:3000/checkemailtaken?username=${email}`);
    let isTaken = await response.json();

    if(isTaken == true) {
        usernameTakenElement.style.display = "block";
    } else {
        usernameTakenElement.style.display = "none";
    }
}


//Determine selected avatar image
const avatarList = document.querySelector("#avatarOptions");
const imgUploadDiv = document.querySelector("#imageUpload");

avatarList.addEventListener("click", function(e) {
    console.log(imgUploadDiv);

    const alreadySelected = document.querySelector(".imageli.selected");
    const selectedLIImg = e.target;
    const parentLI = selectedLIImg.parentElement;

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
