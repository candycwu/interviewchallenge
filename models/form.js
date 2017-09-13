var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var formSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: false
    },
    email: {
        type: String,
        unique: false
    },
    message: {
        type: String,
        unique: false
    }
});

formSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Form", formSchema);