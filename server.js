let express = require("express");
let logger = require("morgan");
let mongoose = require("mongoose");

// Scraping tools
let axios = require("axios");
let cheerio = require("cheerio");

// Require models
let db = require("./models");

let PORT = 8000;

// Initialize Express
let app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Serve static content for the app from the "public" directory
app.use(express.static(__dirname + "/public"));

let exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
});

// Routes

//Routing traffic to the home page
app.get("/", (request, response) => {
    response.render("index");
});

//GET route for scraping the website
app.get("/scrape", function (req, res) {
    //Grab html with axios
    axios.get("https://www.reddit.com/r/news/").then(function (response) {
        // Load to cheerio
        let $ = cheerio.load(response.data);

        // Scrape HTML
        $("article h3").each(function (i, element) {
            // Save an empty result object
            let result = {};

            // Adding text and href of every link, save as properties of the result object
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

        });

        res.send("Scrape Complete");
    });
});

// Route for getting all Articles from the db
app.get("/api/articles", function (request, response) {

    db.Article.find({})
        .then(function (data) {
            response.json(data);
        })
        .catch(function (err) {
            response.json(err);
        });
});

// Route for grabbing a specific Article by id and populating with note
app.get("/articles/:id", function (request, response) {
    //Match parameter id with the id in database
    db.Article.findOne({
            _id: request.params.id
        })
        //Populate all associated with it
        .populate("note")
        .then(function (dbArticle) {
            response.json(dbArticle);
        })
        .catch(function (err) {
            response.json(err);
        });
});

// Route for saving/updating note
app.post("/articles/:id", function (request, response) {

    db.Note.create(request.body)
        .then(function (dbNote) {

            return db.Article.findOneAndUpdate({
                _id: request.params.id
            }, {
                note: dbNote._id
            }, {
                new: true
            });
        })
        .then(function (dbArticle) {
            response.json(dbArticle);
        })
        .catch(function (err) {
            response.json(err);
        });
});

// Starting the server
app.listen(process.env.PORT || PORT, function () {
    console.log("App running on port " + PORT);
});