const Listing = require("../models/listing.js");
const axios = require("axios"); 
module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate("reviews")
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};



module.exports.createListing = async (req, res) => {
    try {
        const locationName = req.body.listing.location;

        // 🌍 Geocode location using OpenStreetMap Nominatim
        const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: {
                q: locationName,
                format: "json"
            },
            headers: {
                "User-Agent": "listing-app"
            }
        });

        let lat = 19.0760; // Default: Mumbai
        let lng = 72.8777;

        if (geoRes.data && geoRes.data.length > 0) {
            lat = parseFloat(geoRes.data[0].lat);
            lng = parseFloat(geoRes.data[0].lon);
        }

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        newListing.geometry = {
            type: "Point",
            coordinates: [lng, lat] // 🌐 Save as [longitude, latitude]
        };

        await newListing.save();
        req.flash("success", "New listing created!");
        res.redirect("/listings");
    } catch (err) {
        console.error("Geocoding failed:", err);
        req.flash("error", "Failed to create listing.");
        res.redirect("/listings");
    }
};

  

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
  //after editing listings unable to render to /listings
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    throw new ExpressError(404, "Listing not found");
  }
  req.flash("success", "Listing Deleted!");
  res.redirect(`/listings`);
};
