var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require models
var db = require("./models");

var PORT = 8000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Serve static content for the app from the "public" directory
app.use(express.static(__dirname + "public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");


// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongoHeadlines", {
    useNewUrlParser: true
});

// Routes

//GET route for scraping the website
app.get("/scrape", function (req, res) {
    //Grab html with axios
    axios.get("https://www.reddit.com/r/news/").then(function (response) {
        // Load to cheerio
        var $ = cheerio.load(response.data);

        // Scrape HTML
        $("article h3").each(function (i, element) {
            // Save an empty result object
            var result = {};


            // Add text and href of every link, save as properties of the result object
            result.title = $(this)
                .text();
            result.link = $(this)
                .parent()
                .parent()
                .attr("href");

            // Create a new Article
            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });

            // console.log(result);
        });


        // Send confirmation message to the client
        res.send("Scrape Complete");
    });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // If able to successfully update Article, send back to client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If error occurred, send to client
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    //Match parameter id with the id in database
    db.Article.findOne({
            _id: req.params.id
        })
        //Populate all associated with it
        .populate("note")
        .then(function (dbArticle) {
            // If able to successfully update Article, send back to client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If error occurred, send to client
            res.json(err);
        });
});

// Route for saving/updating note
app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                note: dbNote._id
            }, {
                new: true
            });
        })
        .then(function (dbArticle) {
            // If able to successfully update Article, send back to client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If error occurrs, send to the client
            res.json(err);
        });
});

// Starting the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT);
});