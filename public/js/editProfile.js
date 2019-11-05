    //To edit user profile
    const editbtn = document.querySelector("#editprofile");
    console.log(editbtn);
    const savebtn = document.querySelector("#savebtn");
   
    const fnametd = document.querySelector("#fnametd");
    const lnametd = document.querySelector("#lnametd");
    const emailtd = document.querySelector("#emailtd");
    const gendertd = document.querySelector("#gendertd");
    const countrytd = document.querySelector("#countrytd");
    const phonetd = document.querySelector("#phonetd");

    editbtn.addEventListener("click", function() {
        console.log("clicked");
        tdToTextInput(fnametd);
        tdToTextInput(lnametd);
        tdToTextInput(emailtd);
        tdToTextInput(gendertd);
        tdToTextInput(countrytd);
        tdToTextInput(phonetd);
        editbtn.disabled = true;
    });
       
    function tdToTextInput (tdElement){
        tdElement.innerHTML = `<input type="text" id="${tdElement.id}Input" value="${tdElement.innerHTML}">`;
    }

    savebtn.addEventListener("click", function() {
  
        tdToTextInput(fnametd);
        tdToTextInput(lnametd);
        tdToTextInput(emailtd);
        tdToTextInput(gendertd);
        tdToTextInput(countrytd);
        tdToTextInput(phonetd);
        editbtn.disabled = true;
    });
       
    function tdToSaveProfile (tdElement){
        tdElement.innerHTML = `<input type="text" id="${tdElement.id}Input" value="${tdElement.innerHTML}">`;
    }