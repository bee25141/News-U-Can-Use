$(document).ready(function(){
    $.get("/api/articles", function(data){
        for(let i=0; i<data.length; i++){
            $("#article-container").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "<a id='scrapedLink' href='https://www.reddit.com" + data[i].link + "' target='_blank'>" + data[i].link + "</a>" + "</p>");
        };
    });
});



