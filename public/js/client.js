//Client-side js for event handling
const enteredUserName = document.querySelector("#txtUName");
console.log(enteredUserName.value);

enteredUserName.addEventListener("keyup", checkUniqueUsername(enteredUserName.value));


//Check username is unique 
async function checkUniqueUsername(username) {
    console.log(username);
    // let response = await fetch(`http://localhost:3000/signup?username=`);
    // let signUpJSON = await response.json();
    // console.log(signUpJSON);
    // console.log(signUpJSON.userName);
    // return signUpJSON;
}
