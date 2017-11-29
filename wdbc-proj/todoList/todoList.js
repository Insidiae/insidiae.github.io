//Toggle todo status when clicked
//NOTE: To add these event listeners for added todos, the event listener must be on an already existing element,
//then add the event listener on that element's children.
$("ul").on("click", "li", function () {
    $(this).toggleClass("done");
});

//Delete todo when delete button is clicked
$("ul").on("click", "span", function (event) {
    $(this).parent().slideUp(250, function () {
        $(this).remove();
    });
    event.stopPropagation();
});

//Add a todo when the user hits Enter
$("input[type='text']").keypress(function (event) {
    if (event.which === 13) {
        var todo = $(this).val();
        $(this).val("");
        $("ul").append("<li><span><i class='fa fa-trash' aria-hidden='true'></i></span> " + todo + "</li>");
    }
});

//Hide/Display the text input when the -/+ icon is clicked
$("#faicon").click(function () {
    $("input[type='text']").slideToggle(250, "linear", function () {
        $("#faicon").toggleClass("fa-plus fa-minus");
    });
});
