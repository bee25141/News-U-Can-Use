$(document).ready(function(){
    $.get("/api/articles", function(data){
        for(let i=0; i<data.length; i++){
            $("#article-container").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "<a id='scrapedLink' href='https://www.reddit.com" + data[i].link + "' target='_blank'>" + data[i].link + "</a>" + "</p>");
        };
    });
});

// Whenever someone clicks a p tag
$(document).on("click", "p", function() {

    $("#notes").empty();

    let id = $(this).attr("data-id");
  
    // Ajax call for specific article
    $.ajax({
      method: "GET",
      url: "/articles/" + id
    })
      // Adding note info to page
      .then(function(data) {
          console.log(data)

        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='save'>Save Note</button>");
  
        // Add note data if there's a note in the article
        if (data.note) {
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // To save note to an article
  $(document).on("click", "#save", function() {

    let thisId = $(this).attr("data-id");
  
    // POST request to save the note
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    }).then(function(data) {
        $("#notes").empty();
      });
  
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

