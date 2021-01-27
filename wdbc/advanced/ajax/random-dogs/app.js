var btn = document.querySelector("#btn");
var img = document.querySelector("#photo");

btn.addEventListener("click", function() {
  var XHR = new XMLHttpRequest();

  XHR.onreadystatechange = function() {
    if (XHR.readyState == 4 && XHR.status == 200) {
      var obj = JSON.parse(XHR.responseText);
      img.src = obj.message;
    }
  };

  XHR.open("GET","https://dog.ceo/api/breeds/image/random");
  XHR.send();
});