
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


//Determine selected avatar image
const avatarList = document.querySelector("#avatarOptions");

avatarList.addEventListener("click", function(e) {
    const alreadySelected = document.querySelector(".imageli.selected");
    const selectedLIImg = e.target;
    if(alreadySelected && alreadySelected != selectedLIImg.parentElement) {
        return;
    } else {

        const parentLI = selectedLIImg.parentElement;
        parentLI.classList.toggle("selected");
    }
});



// // item selection
//     $('li').click(function () {
//         $(this).toggleClass('selected');
//         if ($('li.selected').length == 0)
//             $('.select').removeClass('selected');
//         else
//             $('.select').addClass('selected');
//         counter();
//     });

//     // all item selection
//     $('.select').click(function () {
//         if ($('li.selected').length == 0) {
//             $('li').addClass('selected');
//             $('.select').addClass('selected');
//         }
//         else {
//             $('li').removeClass('selected');
//             $('.select').removeClass('selected');
//         }
//         counter();
//     });

//     // number of selected items
//     function counter() {
//         if ($('li.selected').length > 0)
//             $('.send').addClass('selected');
//         else
//             $('.send').removeClass('selected');
//         $('.send').attr('data-counter', $('li.selected').length);
//     }