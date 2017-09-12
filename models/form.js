var mongoose = require("mongoose");

var formSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
});

module.exports = mongoose.model("form", formSchema);