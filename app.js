var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    flash                 = require("connect-flash"),
    passport              = require("passport"),
    localStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User                  = require("./models/user"),
    Form                  = require("./models/form"),
    seedDB                = require("./seeds");

// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// var nodemailer = require('nodemailer');
// var sgTransport = require('nodemailer-sendgrid-transport');

// var options = {
//   auth: {
//     api_user: 'candylee',
//     api_key: '//passwordhere'
//   }
// };

// var client = nodemailer.createTransport(sgTransport(options));

//mongoose database
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/challenge");
//to use bodyParser
app.use(bodyParser.urlencoded({extended: true}));
//to omit ejs at the end of files
app.set("view engine", "ejs");
//use flash
app.use(flash());
//run seedDB
// seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    //secret - to encode or decode the session
    secret: "secret",
    saveUninitialized: false,
    resave: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
//responsible for taking the data in the session encoding and unencoding
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.error = req.flash("error");
    next();
});

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
            res.redirect("/");
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
    // using SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs
    // const msg = {
    //   to: 'lee.candy1990@icloud.com',
    //   from: 'lee.candy1990@icloud.com',
    //   subject: username,
    //   text: message,
    //   html: '<strong>message</strong>',
    // };
    // sgMail.send(msg);
    //redirect back to updated form with links to the submitted data
    //create new form and save to db
    Form.create(newForm, function(err, newlyCreated){
        if(err){
            console.log('error happened\n\n,',err);
            res.redirect("back");
        } else {
            // var email = {
            //     from: 'Admin, lee.candy1990@icloud.com',
            //     to: 'lee.candy1990@icloud.com',
            //     subject: 'Hello',
            //     text: 'Hello world',
            //     html: '<b>Hello world</b>'
            // };
            // client.sendMail(email, function(err, info){
            //     if (err ){
            //         console.log(err);
            //     } else {
            //         console.log('Message sent: ' + info.response);
            //     }
            // });
            res.redirect("/form");
        }
    });
});

//=========================
//  AUTHENTICATION ROUTES
//=========================

//register path
app.get("/register", function(req, res){
    res.render("register");
});

//handling user signup
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
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
});

//Logout
app.get("/logout", function(req, res){
    req.logout(function(err){
        if(err){
            console.log(err);
            req.flash("error", "Please try to logout again.");
        }
    });
    res.redirect("/login");
});

//MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login to continue.");
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Server Has Started.");
});