var price = document.querySelector("#price");
var btn = document.querySelector("button");
var select = document.querySelector("#currency");

btn.addEventListener("click", function() {
  var currency = select.value;

  console.log(currency);
  var XHR = new XMLHttpRequest();

  XHR.onreadystatechange = function () {
    if (XHR.readyState == 4 && XHR.status == 200) {
      var obj = JSON.parse(XHR.responseText);
      price.innerHTML = obj.bpi[currency].symbol + obj.bpi[currency].rate;
      // price.textContent = obj.bpi[currency].rate + ' ' + obj.bpi[currency].code;
    }
  };

  XHR.open("GET", "https://api.coindesk.com/v1/bpi/currentprice.json");
  XHR.send();
});
