//Client-side js for event handling
const enteredUserName = document.querySelector("#txtUName");
const usernameTakenElement = document.querySelector("#usernameTaken");
console.log(enteredUserName);

enteredUserName.addEventListener("keyup", function() {
    checkUniqueUsername(enteredUserName.value)
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
