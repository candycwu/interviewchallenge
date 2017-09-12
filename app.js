var express               = require("express"),
    app                   = express(),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    localStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Form                  = require("./models/form"),
    seedDB                = require("./seeds");

seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Nami and Jelly are the cutest dogs ever and forever",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//mongoose database
mongoose.connect("mongodb://localhost/challenge");

//to use bodyParser
app.use(bodyParser .urlencoded({extended: true}));

//to omit ejs at the end of files
app.set("view engine", "ejs");


//root path
app.get("/", function(req, res){
    res.render("login");
});

//register path
app.get("/register", function(req, res){
    res.render("register");
});

//form path
app.get("/form", function(req, res){
            Form.find({}, function(err, allForms){
                if(err){
                    console.log(err);
                } else {
                    res.render("form", {forms: allForms});
                }
            });
});

//new form path
app.post("/form", function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    var message = req.body.message;
    var newForm = {name:name, email:email, message:message};
    //create new form and save to db
    Form.create(newForm, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to updated form with links to the submitted data
            res.redirect("form");
        }
    });
});

//show more info about clicked form
app.get("/form/:id", function(req, res){
    Form.findById(req.params.id, function(err, foundForm){
        if(err){
            console.log(err);
        } else {
            console.log(foundForm);
            res.render("show", {form: foundForm});
        }
    }
)});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Server Has Started.");
});