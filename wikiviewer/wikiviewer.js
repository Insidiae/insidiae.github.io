//url: https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&generator=search&exsentences=1&exintro=1&explaintext=1&gsrnamespace=0&gsrlimit=10&gsrsearch=

$("input[type='text']").keypress(function (event) {
    if (event.which === 13) {
        if ($(this).val() === "") {
            $("ul").html("");
            $("ul").append("<li>Please input a search term.</li>")
        } else {
            wikiSearch();
        }
    }
});
$("input[type='text']").keyup(function () {
    console.log($(this).val());
    if ($(this).val() === "")
        $("#faicon").addClass("hidden");
    else
        $("#faicon").removeClass("hidden");
});

$("#faicon").on("click", function () {
    $("ul").html("");
    $("input[type='text']").val("");
    $(this).addClass("hidden");
});


function wikiSearch() {
    var search = $("#searchInput").val();
    var api = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&generator=search&exsentences=1&exintro=1&explaintext=1&gsrnamespace=0&gsrlimit=10&origin=*&gsrsearch="
    $.ajax({
        url: api + search,
        dataType: 'json',
        type: 'POST',
        success: function (data) {
            $("ul").html("");
            for (var page in data.query.pages) {
                var pageTitle = data.query.pages[page].title;
                var snip = data.query.pages[page].extract;
                $("ul").append("<a href='https://en.wikipedia.org/?curid=" + page + "'>" + "<li><h3>" + pageTitle + "</h3>" + snip + "</li></a>");
            }

        }
    });
}
