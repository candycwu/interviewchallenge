var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");


var formSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
});

formSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Form", formSchema);