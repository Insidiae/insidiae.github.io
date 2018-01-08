function displayStreams() {
    var streams_list = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
    var api = "https://wind-bow.gomix.me/twitch-api/";

    streams_list.forEach(function (twitch_id) {
        //OLD CODE
        //        $.ajax({
        //            url: api + "streams/" + twitch_id + "?callback=?",
        //            dataType: 'json',
        //            type: 'GET',
        //            success: function (data) {
        //                if (data.stream !== null) {
        //                    $("#streaming").append("<a href='" + data.stream.channel.url + "' target='_blank'><li>" + data.stream.channel.name + "</li></a>");
        //                } else {
        //                    $.ajax({
        //                        url: api + "channels/" + twitch_id + "?callback=?",
        //                        dataType: 'json',
        //                        type: 'GET',
        //                        success: function (data) {
        //                            $("#offline").append("<a href='" + data.url + "' target='_blank'><li>" + data.name + "</li></a>");
        //                        }
        //                    });
        //                }
        //            }
        //        });

        $.getJSON(api + "streams/" + twitch_id + "?callback=?")
            .done(function (data) {
                var appendImg = "<li><img src='";
                var appendUrl = "'><span id='info'><a href='";
                var appendUrl2 = "' target='_blank'>";
                var appendText = "</a><span class='streamText'>";
                var appEnd = "</span></span></li>";
                var elem = "";
                if (data.stream !== null) {
                    elem += appendImg + data.stream.channel.logo;
                    elem += appendUrl + data.stream.channel.url + appendUrl2 + data.stream.channel.name;
                    elem += appendText + data.stream.game + "<span class='streamText2'>: " + data.stream.channel.status + "</span>" + appEnd;
                    $("#streaming").append(elem);
                    
                } else {
                    $.getJSON(api + "channels/" + twitch_id + "?callback=?")
                        .done(function (data) {
                            elem += appendImg + data.logo;
                            elem += appendUrl + data.url + appendUrl2 + data.name;
                            elem += appendText + "Offline" + appEnd;
                            $("#offline").append(elem);
                        })
                }
            });
    });
}

$(document).ready(function () {
    displayStreams();
});

$("#showAll").on("click", function() {
    if(!$(this).is(".active")) {
        $(".active").removeClass("active");
        $(this).addClass("active");
        $(".online").removeClass("hidden");
        $(".offline").removeClass("hidden");
    }
});

$("#showOnline").on("click", function() {
    if(!$(this).is(".active")) {
        $(".active").removeClass("active");
        $(this).addClass("active");
        $(".online").removeClass("hidden");
        $(".offline").addClass("hidden");
    }
});

$("#showOffline").on("click", function() {
    if(!$(this).is(".active")) {
        $(".active").removeClass("active");
        $(this).addClass("active");
        $(".online").addClass("hidden");
        $(".offline").removeClass("hidden");
    }
});
