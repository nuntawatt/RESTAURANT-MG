let getAllInputBox = document.querySelectorAll(".login .inputBx")
let submitLoginBtn = document.querySelector(".submitLogin")
let getEmailInput = document.querySelector("#emailInput")
let getPwdInput = document.querySelector("#pwdInput")
let getEmailInputErrTx = getEmailInput.parentElement.querySelector(".errTx")
let getPwdInputErrTx = getPwdInput.parentElement.querySelector(".errTx")

// Prevents entry into the login page after the user has finished logging in. (after login)
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
  


async function handleLogin(email, password) {
    try {
        // Show loading
        Swal.fire({
            title: 'Logging in...',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Save token
        localStorage.setItem('userToken', data.token);

        // Success message
        await Swal.fire({
            icon: 'success',
            title: 'Welcome back!',
            text: 'Login successful',
            timer: 1500,
            showConfirmButton: false
        });

        // Redirect
        window.location.href = '/index.html';
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: error.message,
            confirmButtonColor: '#ff6b6b'
        });
    }
}

function checkAllInput(){
    let inputSuccess = []
   getAllInputBox.forEach((inputBx) =>{
    let getInputBx = inputBx.querySelector("input")
    let getErrTx = inputBx.querySelector(".errTx")
    
    if(getInputBx.value == "" || getInputBx.value == null){
        getErrTx.innerHTML = "Please fill in information";
       inputSuccess.push(false);
    }
    else{
        getErrTx.innerHTML = ""
        inputSuccess.push(true);
    }
   })
   let checkInputSuccess = inputSuccess.every((t) => t == true)
   return checkInputSuccess;
}


submitLoginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    
    if (checkAllInput()) {
        // Reset error messages
        getEmailInputErrTx.innerHTML = "";
        getPwdInputErrTx.innerHTML = "";
        
        // Get input values
        const email = getEmailInput.value;
        const password = getPwdInput.value;
        
        // Attempt login
        await handleLogin(email, password);
    }
});