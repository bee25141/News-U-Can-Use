let mongoose = require("mongoose");

// Reference to Schema constructor
let Schema = mongoose.Schema;

// Creating new NoteSchema object
let NoteSchema = new Schema({

  title: String,

  body: String
});

// Creating new model from schema
let Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
