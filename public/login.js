// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function() {

  const errorText = document.getElementById("error")

  const emailInput = document.getElementById("email")
  const passwordInput = document.getElementById("password")

  const loginAnchor = document.getElementById("login")

  function removeError() {
    errorText.textContent = ""
  }

  function displayError(msg) {
    errorText.textContent = "Error: " + msg
  }

  loginAnchor.addEventListener("click", () => {
    removeError()
    if(emailInput.value != "" && passwordInput.value != "") {
      // change display based on id
      fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: emailInput.value, 
          password: passwordInput.value
        })
      })
      .then((response) => {
        if (!response.ok) {
          response.text().then(
            (responseText) => {displayError(responseText)}
          )
        } else {
          window.location.href = "/"
        }
      })
    } else {
      displayError("Please enter a value")
    }
  })

});

