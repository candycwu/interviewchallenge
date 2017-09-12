var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Form = require("./models/form");

mongoose.connect("mongodb://localhost/challenge");
app.use(bodyParser .urlencoded({extended: true}));
app.set("view engine", "ejs");

//root path
app.get("/", function(req, res){
    res.render("login");
});

//new form path
app.post("/form", function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    var msg = req.body.message;
    var newForm = {name:name, email:email, message:msg};
    //create new form and save to db
    Form.create(newForm, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to updated form with links to the submitted data
            res.redirect("/form");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Server Has Started.");
});