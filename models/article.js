let mongoose = require("mongoose");

// Reference to the Schema constructor
let Schema = mongoose.Schema;

// Creating new ArticleSchema object
let ArticleSchema = new Schema({

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
let Article = mongoose.model("Article", ArticleSchema);

// Exporting the Article model
module.exports = Article;
