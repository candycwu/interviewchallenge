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

//mongoose database
mongoose.connect("mongodb://localhost/challenge");
//to use bodyParser
app.use(bodyParser.urlencoded({extended: true}));
//to omit ejs at the end of files
app.set("view engine", "ejs");

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    //secret - to encode or decode the session
    secret: "Nami and Jelly are the cutest dogs ever and forever",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
//responsible for taking the data in the session encoding and unencoding
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//root path
app.get("/", function(req, res){
    res.render("login");
});

//show path
app.get("/show", function(req, res){
    Form.find({}, function(err, allForms){
                if(err){
                    console.log(err);
                } else {
                    res.render("show", {forms: allForms});
                }
            });
});

//form path
app.get("/form",  isLoggedIn, function(req, res){
           res.render("form");
});

//new form path
app.post("/form",  isLoggedIn, function(req, res){
    var username = req.body.username;
    var email = req.body.email;
    var message = req.body.message;
    var newForm = {username:username, email:email, message:message};
    //create new form and save to db
    Form.create(newForm, isLoggedIn, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to updated form with links to the submitted data
            res.redirect("form");
        }
    });
});

//show more info about clicked form
app.get("/form/:id", isLoggedIn, function(req, res){
    Form.findById(req.params.id, function(err, foundForm){
        if(err){
            console.log(err);
        } else {
            console.log(foundForm);
            res.render("show", {form: foundForm});
        }
    }
)});

//=========================
//  AUTHENTICATION ROUTES
//=========================

//register path
app.get("/register", function(req, res){
    res.render("register");
});

//handling user signup
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render("register");
       } 
       //this line logs the user in & take care of the session and store info & it'll run the serialized user method
       passport.authenticate("local")(req, res, function(){
           res.redirect("/form");
       });
    });
});

//login
app.get("/login", function(req, res){
    res.render("login");
});

//login route
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/form",
        failureRedirect: "/login"
    }), function(req, res){
        console.log("username: " + req.body.username + "pw: " + req.body.password);
});

//logout route
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

//Logout
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Server Has Started.");
});