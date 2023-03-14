document.getElementById("show-hide").addEventListener("click", (e) => {
  const passwordField = document.getElementById("password");
  if (passwordField.type == "password") {
    passwordField.type = "text";
    document.getElementById("eye1").style.display = "none";
    document.getElementById("eye2").style.display = "block";
  } else {
    passwordField.type = "password";
    document.getElementById("eye2").style.display = "none";
    document.getElementById("eye1").style.display = "block";
  }
});
