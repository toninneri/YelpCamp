var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX - Show all campgrounds
router.get("/", (req,res)=> {
	//Get all campgrounds from DB
	Campground.find({}, (err, allCampgrounds)=>{
		if(err){
			console.log(err);
		}else {
			res.render("campgrounds/index", {campgrounds:allCampgrounds}); 
		}
	}); 
});

router.post("/", middleware.isLoggedIn, (req, res)=> {
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var name = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground ={name: name, price: price, image: image, description: desc, author: author};

	//Create a new cmpground and save to the database
	Campground.create(newCampground, (err, newlyCreated)=>{
		if(err){
			console.log(err);
		} else {
			//redirect back to campgrounds
			//console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	});
});

router.get("/new", middleware.isLoggedIn, (req, res)=>{
	res.render("campgrounds/new");
});

// Shows more info about one campground
router.get("/:id", (req, res)=>{
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec((err, foundcampground)=>{
		if(err || !foundcampground){
			req.flash("error", "Campground not found!!");
			res.redirect("back");
		}else{
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundcampground});
		}
	});
	
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findById(req.params.id, (err, foundCampground)=>{			
		res.render("campgrounds/edit", {campground: foundCampground});		
	});	
});

//UPDATE CAMPGROUND ROUTE

router.put("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
	//find and update the correct campground 
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
		if(err){
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	//redirect show page
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndRemove(req.params.id,(err)=>{
		if(err){
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds");
		}
});
});


module.exports = router;