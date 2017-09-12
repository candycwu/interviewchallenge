var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

app.use(bodyParser .urlencoded({extended: true}));
app.set("view engine", "ejs");

//root path
app.get("/", function(req, res){
    res.render("login");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Server Has Started.");
});