$(document).ready(function(){
    //manipulating css with jquery, having fun, trying stuff
    //array of different hex codes for colors of submit button
    var arrayOfColors =["#FF9A85","#97EB5A","#48DFA1","#485ADF","#BD48DF","#D53E7E"];

    $(".btn").mouseover(function(){
        $(this).css("background-color", arrayOfColors[Math.floor(Math.random()*5)]);
        $(this).addClass("animated infinite rubberBand");
    }).mouseout(function(){
        $(this).css("background-color", "yellow");
        $(this).removeClass("animated infinite rubberBand");
    })
//=====================================================================================================


//generating buttons based on user input (value)
    function makeButton(value){
        var newButton = $("<button>");
        newButton.addClass("newButton animated");
        newButton.attr("offset",0);
        newButton.attr("feeling-name",value);
        newButton.css("background-color", arrayOfColors[Math.floor(Math.random()*5)]);
        newButton.text(value);
        $("#buttonDiv").append(newButton);
    }

//setting up the ajax
    function ajaxSetup(response){
        for(var i=0; i<response.data.length; i++){
            var gif = $("<div class='gif'>");
            var img = $("<img>");
            var rating = $("<p>");
            //moving images, need to figure out how to pause
            img.attr("move",ajax.data[i].images.fixed_width.url);
            img.attr("still",ajax.data[i].images.fixed_width_still.url);
            img.attr("src",img.attr("still"));
            img.attr("data-state","still");
            img.addClass("img-responsive gifImages");
            img.css("width","100%");
            img.css("height", "60%");
            rating.addClass("text-center h6");
            rating.text("Rating: " + ajax.data[i].rating);
            rating.css("background-color","yellow");
            rating.css("padding","20px");
            gif.append(img);
            gif.append(rating);
            gif.css("margin-right","20px");
            $(".gifDiv").prepend(gif);
        }
    }
//animate css
$(document).on("mouseover",".newButton",function(){
    $(this).addClass("animated infinite tada");
}).on("mouseout",".newButton",function(){
    $(this).removeClass("animated infinite tada");
})



//=====================================CLICK FUNCTIONS================================================
//function to create buttons based on user input with styling. Also user can press enter to submit
    $("#submitButtonId").click(function(){
        var feeling = $("#emotionInput").val();
        makeButton(feeling);
        $("#emotionInput").val("");
    });
    //press enter to submit feeling
    $("#emotionInput").keypress(function(event){
        if(event.keyCode === 13){
            $("#submitButtonId").trigger("click");
        }
    });

//function to perform ajax request on buttons generated by user.
//have to use document.on click for new buttons because we are dynamically adding new buttons.
//The document has new elements added, this will find them.
var ajax;

$(document).on("click",".newButton",function(){
    //create query url need limit variable

    var part = "https://api.giphy.com/v1/gifs/search?q="
    var apiKey = "&api_key=Uzca876e5K4XznLnTjHlBZeb0IwrFA0p&limit="
    var input = $(this).attr("feeling-name");
    var offset = parseInt($(this).attr("offset"));
    var queryoffset = offset;
    offset+=10;
    $(this).attr("offset",offset);
    
//change offset by 10 to load more gifs if we click again.
    var queryUrl = part + input + apiKey + 10 + "&offset=" + queryoffset;
    $(".page").css("height","auto");
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function(response){
        //iterate through response array and grab the image urls
        ajax=response;
        ajaxSetup(ajax);
    })
});

//gif images play on click 
$(document).on("click",".gifImages",function(){
    var currentstate = $(this).attr("data-state");
    if(currentstate==="still"){
        $(this).attr("data-state","animated");
        $(this).attr("src",$(this).attr("move"));
    }else{
        $(this).attr("data-state","still");
        $(this).attr("src",$(this).attr("still"));
    }
})

});