const express = require("express");
const router = express.Router();
const wrapAsync  = require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn , isOwner , validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({storage});


//index route
//create route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,validateListing, upload.single('listing[image]'), wrapAsync(listingController.createNewListing));

// new route
router.get("/new",isLoggedIn, listingController.renderNewForm);

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.renderEditForm));

//show route
//update route
//delete route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateEditListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports = router;