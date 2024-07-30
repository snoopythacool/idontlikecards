// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function() {

    const errorText = document.getElementById("error")
  
    const usernameInput = document.getElementById("username")
    const emailInput = document.getElementById("email")
    const passwordInput = document.getElementById("password")
    const passwordVerificationInput = document.getElementById("passwordverify")
  
    const loginAnchor = document.getElementById("register")
  
    function removeError() {
      errorText.textContent = ""
    }
  
    function displayError(msg) {
      errorText.textContent = "Error: " + msg
    }
  
    loginAnchor.addEventListener("click", () => {
      removeError()
      if(!(emailInput.value != "" && passwordInput.value != "" && usernameInput.value != "")) {
        displayError("Please enter a value")
      }
      else if(passwordVerificationInput.value == passwordInput.value) {
        // change display based on id
        fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: usernameInput.value, 
            email: emailInput.value, 
            password: passwordInput.value
          })
        })
        .then((response) => {
          if (!response.ok) {
            response.text().then(
              (responseText) => {displayError(responseText)}
            )
          }
  
          return response;
        })
        .then((response) => {
          window.location.href = "/"
        });
      } else {
        displayError("The password doesn't match")
      }
    })
  
  });
  
  