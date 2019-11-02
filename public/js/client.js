

//Client-side js for event handling
const enteredUserName = document.querySelector("#txtUName");
const usernameTakenElement = document.querySelector("#usernameTaken");

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


// item selection
    $('li').click(function () {
        $(this).toggleClass('selected');
        if ($('li.selected').length == 0)
            $('.select').removeClass('selected');
        else
            $('.select').addClass('selected');
        counter();
    });

    // all item selection
    $('.select').click(function () {
        if ($('li.selected').length == 0) {
            $('li').addClass('selected');
            $('.select').addClass('selected');
        }
        else {
            $('li').removeClass('selected');
            $('.select').removeClass('selected');
        }
        counter();
    });

    // number of selected items
    function counter() {
        if ($('li.selected').length > 0)
            $('.send').addClass('selected');
        else
            $('.send').removeClass('selected');
        $('.send').attr('data-counter', $('li.selected').length);
    }

    //check password re-enter box on sign-up page
    $('#password, #confirm-password').on('keyup', function () {
        if ($('#password').val() == $('#confirm-password').val()) {
            $('#message').html('Matching').css('color', 'green');
        } else 
            $('#message').html('Not Matching').css('color', 'red');
    });