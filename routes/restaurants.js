var express = require("express");
var router  = express.Router();
var Restaurant= require("../models/restaurant");
var middleware = require("../middleware");


//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Restaurant.find({}, function(err, allRestaurants){
       if(err){
           console.log(err);
       } else {
          res.render("restaurants/index",{restaurants:allRestaurants});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var dollar=req.body.dollar;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newRestaurant = {name: name, image: image,dollar:dollar, description: desc, author:author}
    // Create a new campground and save to DB
    Restaurant.create(newRestaurant, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/business");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("restaurants/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Restaurant.findById(req.params.id).populate("comments").exec(function(err, foundRestaurant){
        if(err){
            console.log(err);
        } else {
            console.log(foundRestaurant);
            //render show template with that campground
            res.render("restaurants/show", {restaurant: foundRestaurant});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Restaurant.findById(req.params.id, function(err, foundRestaurant){
        res.render("restaurants/edit", {restaurant: foundRestaurant});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updatedRestaurant){
       if(err){
           res.redirect("/business");
       } else {
           //redirect somewhere(show page)
           res.redirect("/business/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
   Restaurant.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/business");
      } else {
          res.redirect("/business");
      }
   });
});


module.exports = router;

