// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function() {

  fetch('/api/logout')
  .then((response) => {
    window.location.href = "/"
  });

});

