var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", (req,res) => {
		res.render("landing");
		});


//=====================
//AUTH ROUTES 
//=====================

//Show register form
router.get("/register", (req, res)=>{
	res.render("register");
});
//Handle sign up logic
router.post("/register", (req, res)=>{
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user)=>{
		if(err){
			req.flash("error", err.message);
			//console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, ()=>{
			req.flash("success", "Welcome to YelpCamp!", + user.username);
			res.redirect("/campgrounds");
		});
	});
});
//Show Login Form

router.get("/login", (req, res)=>{
	res.render("login");
});
//Handling login logic
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}),(req, res)=>{
	
});
//Logout Route
router.get("/logout", (req, res)=>{
	req.logout();
	req.flash("success", "Logged You Out!");
	res.redirect("/campgrounds");
});


module.exports = router;