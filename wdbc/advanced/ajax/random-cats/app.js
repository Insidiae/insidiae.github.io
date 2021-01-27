$("#btn").click(function(){
  $.getJSON("https://aws.random.cat/meow")
    .done(function(data) {
    $("img").attr("src",data.file);
  })
});
