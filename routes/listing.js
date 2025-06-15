const express = require("express")
const route = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")
const listingController = require("../controllers/listing.js");
const { cloudinary, storage } = require("../cloudConfig.js"); // cloudinary config
const multer = require("multer");
const upload = multer({ storage }); // multer for file upload

route
    .route("/")
    .get(wrapAsync(listingController.index)) // All Listings
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createNewListing)); // create route...

// new route
route.get("/new", isLoggedIn, listingController.renderNewForm);


route
    .route("/:id")
    .get(wrapAsync(listingController.renderAllListing)) // Show Listing
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing)) // Update Listing
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)); // Delete Listing


// wrapAsync se req humer err handling middleware pe jayagi...

// edit route
route.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));


module.exports = route;