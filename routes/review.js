const express = require("express")
const route = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js")
const Listing = require("../models/listing.js")
const { validateReview, isLoggedIn, isreviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");



// Review
// Post Review route
route.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete Review Route
// listing: {Review[val1, val2, val3]} agar hume val2 ko delete kerna hai mongodb se to hum pull ka use karenga.
route.delete("/:reviewId", isLoggedIn, isreviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = route;