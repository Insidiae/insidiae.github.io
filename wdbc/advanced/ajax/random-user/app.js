var url = "https://randomuser.me/api/";
var avatar = document.querySelector("#avatar");
var fname = document.querySelector("#fullname");
var uname = document.querySelector("#username");
var mail = document.querySelector("#email");
var city = document.querySelector("#city");
var btn = document.querySelector("#btn");


btn.addEventListener("click", function() {
  fetch(url)
  .then(checkRequest)
  .then(parseJSON)
  .then(updateProfile)
  .catch(displayError);
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function checkRequest(req) {
  if(!req.ok) {
    throw Error(req.status)
  }
  return req;
}

function parseJSON(res) {
  return res.json().then(function(data) {
    return data.results[0];
  });
}

function updateProfile(data) {
  avatar.src = data.picture.medium;
  fname.textContent = capitalize(data.name.first) + ' ' + capitalize(data.name.last);
  uname.textContent = data.login.username;
  mail.textContent = data.email;
  city.textContent = capitalize(data.location.city);
}

function displayError(err) {
  console.log(err);
}