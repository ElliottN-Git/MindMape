const enteredUserName = document.querySelector("#txtUName");
console.log(enteredUserName);
enteredUserName.addEventListener("keyup", checkUniqueUserName());

//Check username is unique 
async function checkUniqueUserName() {
    let response = await fetch(`http://localhost:3000/signup`);
    let signUpJSON = await response.json();
    console.log(signUpJSON);
    console.log(signUpJSON.userName);
}
