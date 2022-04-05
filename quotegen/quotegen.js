var myData = [
  {
    quote: "I REJECT MY HUMANITY, JOJO!!!",
    bgcolor: "#cc3300",
    bgimg: "./images/quotes_dio.png",
    author: "Dio Brando",
    source: "JJBA Part 1: Phantom Blood",
  },
  {
    quote: "German Science is the best in the world!",
    bgimg: "./images/quotes_stroheim.jpg",
    bgcolor: "#d65cad",
    author: "Rudol von Stroheim",
    source: "JJBA Part 2: Battle Tendency",
  },
  {
    quote: "You pissed me off.",
    bgcolor: "#000099",
    bgimg: "./images/quotes_jotaro.png",
    author: "Jotaro Kujo",
    source: "JJBA Part 3: Stardust Crusaders",
  },
  {
    quote: "I'm gonna FIX that spaghetti!",
    bgcolor: "#6600cc",
    bgimg: "./images/quotes_josuke.png",
    author: "Josuke Higashikata",
    source: "JJBA Part 4: Diamond is Unbreakable",
  },
  {
    quote: "Only the results! This world only remembers the results!!",
    bgcolor: "#d1a319",
    bgimg: "./images/quotes_diavolo.jpg",
    author: "Diavolo",
    source: "JJBA Part 5: Vento Aureo",
  },
  {
    quote: "Celebrate us.",
    bgcolor: "#33ccff",
    bgimg: "./images/quotes_anasui.jpg",
    author: "Narciso Anasui",
    source: "JJBA Part 6: Stone Ocean",
  },
  {
    quote:
      "My heart and actions are utterly unclouded! They are all those of justice!",
    bgcolor: "#5ce65c",
    bgimg:
      "http://pm1.narvii.com/5778/0780ff17035fbea83afa368f66947b3a8cd4e3bd_hq.jpg",
    author: "Funny Valentine",
    source: "JJBA Part 7: Steel Ball Run",
  },
  {
    quote:
      "Your Stand is like your asshole: you can't go around showing it off to other people.",
    bgcolor: "#0099ff",
    bgimg: "./images/quotes_norisuke.png",
    author: "Norisuke Higashikata IV",
    source: "JJBA Part 8: Jojolion",
  },
];

function newQuote() {
  var obj = Math.floor(Math.random() * 8);
  document.getElementById("quote").innerHTML = " " + myData[obj].quote;
  document.getElementById("author").innerHTML =
    myData[obj].author + ", " + myData[obj].source;
  //document.body.style.backgroundColor = myData[obj].bgcolor;
  document.body.style.backgroundImage = "url('" + myData[obj].bgimg + "')";
}
function tweetIt() {
  var phrase = document.getElementById("quote").innerText;
  var author = document.getElementById("author").innerText;
  var tweetUrl =
    "https://twitter.com/share?text=" +
    encodeURIComponent(phrase) +
    " " +
    encodeURIComponent(author);

  window.open(tweetUrl);
}
