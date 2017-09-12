var mongoose = require("mongoose");

var formSchema = new mongoose.Schema({
    name: String,
    message: String
});

module.exports = mongoose.model("Form", formSchema);