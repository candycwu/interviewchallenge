var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    localStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Form                  = require("./models/form"),
    User                  = require("./models/user"),
    seedDB                = require("./seeds");

//mongoose database
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/challenge");
//to use bodyParser
app.use(bodyParser.urlencoded({extended: true}));
//to omit ejs at the end of files
app.set("view engine", "ejs");
//run seedDB
seedDB();

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

//ROOT - login
app.get("/", function(req, res){
    res.render("login");
});

//ROOT - (after login) form path
app.get("/form", isLoggedIn, function(req, res){
    res.render("form");
});

//INDEX - display list of comments
app.get("/show", isLoggedIn, function(req, res){
    //forms from db
    Form.find({}, function(err, allForms){
        if(err){
            console.log(err);
        } else {
            res.render("index", {forms: allForms});
        }
    });
});


//CREATE - new form path
app.post("/form",  isLoggedIn, function(req, res){
    var username = req.body.name;
    var email = req.body.email;
    var message = req.body.message;
    var newForm = {username:username, email:email, message:message};
    console.log("newForm: ", newForm);
    //create new form and save to db
    Form.create(newForm, isLoggedIn, function(err, newlyCreated){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            // // using SendGrid's v3 Node.js Library
            // // https://github.com/sendgrid/sendgrid-nodejs
            // const sgMail = require('@sendgrid/mail');
            // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            // const msg = {
            //     to: 'test@example.com',
            //     from: 'test@example.com',
            //     subject: 'Sending with SendGrid is Fun',
            //     text: 'and easy to do anywhere, even with Node.js',
            //     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
            // };
            // sgMail.send(msg);
            // //redirect back to updated form with links to the submitted data
            res.redirect("/form");
        }
    });
});

// //INDEX - display list of comments
// app.get("/show", function(req, res){
//     //forms from db
//     Form.find({}, function(err, allForms){
//         if(err){
//             console.log(err);
//         } else {
//             res.render("index", {forms: allForms});
//         }
//     });
// });

// //show more info about clicked form
// app.get("/form/:id", isLoggedIn, function(req, res){
//     Form.findById(req.params.id, function(err, foundForm){
//         if(err){
//             console.log(err);
//         } else {
//             console.log(foundForm);
//             res.render("show", {form: foundForm});
//         }
//     }
// )});

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