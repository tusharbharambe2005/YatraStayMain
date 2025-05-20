const express = require("express");
const router = express.Router(); // Corrected: Missing parentheses after Router
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js")
const multer = require("multer")
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})

router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, validateListing, upload.single("listing[image]"), wrapAsync(listingController.createListing));


// New route
router.get("/new", isLoggedIn,listingController.renderNewForm);

router.route("/:id")
    .get( wrapAsync(listingController.showListing))
    .put( isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

// Edit route
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


// Index route
// router.get("/", wrapAsync(listingController.index));


// Show route
// router.get("/:id", wrapAsync(listingController.showListing));

// Create route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));


// Update route
// router.put("/:id", isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing));

// Delete route
// router.delete("/:id", isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));   


module.exports = router;
