const Property = require("../models/propertyModel");

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public (Koi bhi dekh sakta hai)
const getProperties = async (req, res) => {
  // Database se saari properties dhoond ke lao
  const properties = await Property.find(); 
  res.status(200).json(properties);
};

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private (Sirf Logged in User)
const createProperty = async (req, res) => {
  // 1. Check karo ki data aaya hai ya nahi
  if (!req.body.title || !req.body.price) {
    res.status(400);
    throw new Error("Please add a title and price");
  }

  // 2. Database me nayi Property banao
  const property = await Property.create({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    location: req.body.location,
    type: req.body.type,
    
    // 👇👇 MAGIC LINE (Owner ka Thappa) 👇👇
    user: req.user.id, 
  });

  res.status(200).json(property);
};

module.exports = {
  getProperties,
  createProperty,
};