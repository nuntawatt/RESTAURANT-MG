let getAllInputBox = document.querySelectorAll(".inputBx");
let submitSignupBtn = document.querySelector(".submitSignup");
// ---------------- 
let getFirstNameInput = document.querySelector("#firstnameInput");
let getLastNameInput = document.querySelector("#lastnameInput");
let getPwdInput = document.querySelector("#passwordInput");
let getEmailInput = document.querySelector("#emailInput");
let getErrEmailTx = getEmailInput.parentElement.querySelector(".errTx");
let getPhoneInput = document.querySelector("#phoneInput");
let getErrPhoneTx = getPhoneInput.parentElement.querySelector(".errTx");
let acceptTheOffer = document.querySelector("#acceptTheOffer");

// Prevents entry into the signup page after the user has finished logging in. (after signup)
function IfUserAlreadyRegister(){
  // Check if there is a token or not.
  let getToken = JSON.parse(localStorage.getItem("token")) || null
  let getAllUser = JSON.parse(localStorage.getItem("userDataStorage")) || null
  if(getToken != null && getAllUser != null){
      // Verify the token is true.
    let checkTokenIsReal = getAllUser.filter((data) => data.id == getToken)
    if(checkTokenIsReal != 0){
      window.location.href = "/index.html"
    }
  }
}

IfUserAlreadyRegister()

function generateTokenToAuthentication(userData){
   let getUserDataID = userData.id
   let getAllUserData = JSON.parse(localStorage.getItem("userDataStorage")) || null
   if(getAllUserData != null){
         let checkTokenIsReal = getAllUserData.filter((data) => data.id == getUserDataID )
         if(checkTokenIsReal.length !=0){
             let createToken = localStorage.setItem("token",JSON.stringify(getUserDataID))
             window.location.href = "/index.html"
             location.reload();
         }else{
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Something went wrong. Please contact the staff at the contact page.",
            showConfirmButton: false,
            timer: 1500
          });
         }
   }else{
    Swal.fire({
      position: "center",
      icon: "warning",
      title: "Something went wrong. Please contact the staff at the contact page.",
      showConfirmButton: false,
      timer: 1500
    });
   }
   
}

function generateIDUser() {
  let characterID = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  let buildID = "";

  for (i = 0; i <= 13; i++) {
    let randomNumber = Math.floor(Math.random() * characterID.length);
    buildID += characterID[randomNumber];
  }
  return buildID;
}

function checkEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

function checkAllInput() {
  let inputSuccess = [];
  getAllInputBox.forEach((allInputBx) => {
    let getErrTx = allInputBx.querySelector(".errTx");
    let getInputValue = allInputBx.querySelector("input");

    if (getInputValue.value == null || getInputValue.value == "") {
      getErrTx.innerHTML = "Please fill in information";
      inputSuccess.push(false);
    } else {
      getErrTx.innerHTML = "";
      inputSuccess.push(true);
    }
  });
  let successAll = inputSuccess.every((t) => t == true);
  return successAll;
}

async function handleSignup(userData) {
    try {
        // Show loading
        Swal.fire({
            title: 'Creating your account...',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await fetch('http://localhost:5000/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        // Save token
        localStorage.setItem('userToken', data.token);

        // Success message
        await Swal.fire({
            icon: 'success',
            title: 'Welcome!',
            text: 'Your account has been created successfully',
            timer: 1500,
            showConfirmButton: false
        });

        // Reset form
        resetInputValue();

        // Redirect
        window.location.href = '/index.html';
    } catch (error) {
        if (error.message.includes('duplicate')) {
            getErrEmailTx.innerHTML = 'This email is already registered';
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.message,
                confirmButtonColor: '#ff6b6b'
            });
        }
    }
}

function resetInputValue() {
    getFirstNameInput.value = ""
    getLastNameInput.value = ""
    getPwdInput.value = ""
    getEmailInput.value = ""
    getPhoneInput.value = ""
    acceptTheOffer.checked = false
}


submitSignupBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    
    // Reset error messages
    getErrEmailTx.innerHTML = "";
    getErrPhoneTx.innerHTML = "";

    if (checkAllInput()) {
        const isNumeric = (string) => /^[+-]?\d+(\.\d+)?$/.test(string);
        let inputSuccess = [];

        // Validate email
        if (!checkEmail(getEmailInput.value)) {
            getErrEmailTx.innerHTML = "Please enter a valid email address";
            inputSuccess.push(false);
        } else {
            inputSuccess.push(true);
        }

        // Validate phone
        if (!isNumeric(getPhoneInput.value) || getPhoneInput.value.length !== 10) {
            getErrPhoneTx.innerHTML = "Please enter a valid 10-digit phone number";
            inputSuccess.push(false);
        } else {
            inputSuccess.push(true);
        }

        // Check terms acceptance
        if (!acceptTheOffer.checked) {
            Swal.fire({
                icon: "warning",
                title: "Terms & Conditions",
                text: "Please accept our terms and conditions to continue",
                confirmButtonColor: '#ff6b6b'
            });
            inputSuccess.push(false);
        } else {
            inputSuccess.push(true);
        }

        // If all validations pass
        if (inputSuccess.every(v => v === true)) {
            const userData = {
                firstName: getFirstNameInput.value,
                lastName: getLastNameInput.value,
                email: getEmailInput.value,
                password: getPwdInput.value,
                phone: getPhoneInput.value
            };

            await handleSignup(userData);
        }
    }
});
