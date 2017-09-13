var mongoose = require("mongoose");

var messageSchema = mongoose.Schema({
    text: String,
    username: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        },  
        username:String
    }
});


module.exports = mongoose.model("Message", messageSchema);