var mongoose = require("mongoose");

// Reference to the Schema constructor
var Schema = mongoose.Schema;

// Creating new ArticleSchema object
var ArticleSchema = new Schema({

  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },

  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Creating model from schema
var Article = mongoose.model("Article", ArticleSchema);

// Exporting the Article model
module.exports = Article;
