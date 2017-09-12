var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    email: String,
    message: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Form"
        }]
});

module.exports = mongoose.model("User", userSchema);