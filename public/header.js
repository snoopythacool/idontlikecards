function getUser() {
  return fetch('/api/auth/')
  .then((response) => {
      if (!response.ok) {
        return false
      } else {
        return response.json();
      }
  })
}

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function() {

    const loginSpan = document.getElementById("loginlink");
    const profileSpan = document.getElementById("profilelink");
    const profileInfo = document.getElementById("profileinfo");
    const collectionArea = document.getElementById("collectionArea");

    getUser().then((userinfo) => {
      if (!userinfo) {
        loginSpan.style.display = "inline";
        profileSpan.style.display = "none";
      } else {
        loginSpan.style.display = "none";
        profileSpan.style.display = "inline";
        profileInfo.textContent = "USERNAME: " + (userinfo.username) + " | REVIEWS: " + (userinfo.reviews) + " | "
      }
    })

});

