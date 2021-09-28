var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Restaurant  = require("./models/restaurant"),
    Comment     = require("./models/comment"),
    User        = require("./models/user")
    //seedDB      = require("./seeds")
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    restaurantRoutes = require("./routes/restaurants"),
    indexRoutes      = require("./routes/index")
    
mongoose.connect("mongodb://localhost/fakeyelp");


//mongoose.connect("mongodb://udit_namdev:shrasti123@ds257314.mlab.com:57314/yelp-camp",{useMongoClient:true});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware for assessing/changing req/res
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


/*
app.use("/", indexRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/restaurants/:id/comments", commentRoutes);
*/

app.use("/", indexRoutes);
app.use("/business", restaurantRoutes);
app.use("/business/:id/comments", commentRoutes);


app.listen(8080, function(){
   console.log("The YelpCamp Server Has Started!");
});