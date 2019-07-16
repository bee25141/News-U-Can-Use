var mongoose = require("mongoose");

// Reference to Schema constructor
var Schema = mongoose.Schema;

// Creating new NoteSchema object
var NoteSchema = new Schema({

  title: String,

  body: String
});

// Creating new model from schema
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
