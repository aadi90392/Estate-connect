const express = require("express");
const router = express.Router();

// 1. Controller se functions bulaye
const { getProperties, createProperty, updateProperty, deleteProperty, getProperty } = require("../controllers/propertyController");


const { protect } = require("../middleware/authMiddleware");


router.get("/", getProperties);
router.get("/:id", getProperty);
router.post("/", protect, createProperty);
router.put("/:id", protect, updateProperty);
router.delete("/:id", protect, deleteProperty);



module.exports = router;