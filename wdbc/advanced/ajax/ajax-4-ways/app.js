var url = 'https://ron-swanson-quotes.herokuapp.com/v2/quotes';
var quoteBox = document.querySelector("#quote");

var xhrBtn = document.querySelector("#xhr");
var fetchBtn = document.querySelector("#fetch");
var axiosBtn = document.querySelector("#axios");

xhrBtn.addEventListener("click", XHRRequest);
fetchBtn.addEventListener("click", fetchRequest);
$("#jquery").click(jQueryRequest);
axiosBtn.addEventListener("click", axiosRequest);

function XHRRequest() {
  var XHR = new XMLHttpRequest();
  XHR.onreadystatechange = function () {
    if (XHR.readyState == 4 && XHR.status == 200) {
      var obj = JSON.parse(XHR.responseText);
      quoteBox.textContent = obj[0];
    }
  }
  XHR.open("GET",url);
  XHR.send();
}

function fetchRequest() {
  fetch(url)
  .then(checkRequest)
  .then(parseJSON)
  .then(updateQuote)
  .catch(displayFetchError);
}

function checkRequest(req) {
  if(!req.ok) {
    throw Error(req.status)
  }
  return req;
}

function parseJSON(res) {
  return res.json().then(function(data) {
    return data[0];
  });
}

function updateQuote(data) {
    quoteBox.textContent = data;
  }

function displayFetchError(err) {
    console.log(err);
  }

function jQueryRequest() {
  $.getJSON(url)
  .done(function(data){
    $("#quote").text(data[0]);
  });
}

function axiosRequest() {
  axios.get(url)
  .then(function(res){
    quoteBox.textContent = res.data[0];
  })
  .catch(displayAxiosErrors);
}


function displayAxiosErrors(err) {
    if (err.response) {
      console.log("Problem With Response ", err.response.status);
    } else if (err.request) {
      console.log("Problem With Request!");
    } else {
      console.log('Error', err.message);
    }
  }