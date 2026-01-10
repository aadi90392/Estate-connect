const express = require("express");
const router = express.Router();

// 1. Controller se functions bulaye
const { getProperties, createProperty } = require("../controllers/propertyController");

// 2. Middleware (Guard) bulaya
const { protect } = require("../middleware/authMiddleware");

// --- ROUTES ---

// Route 1: Get All Properties (Sab dekh sakte hain - No Guard)
router.get("/", getProperties);

// Route 2: Create Property (Sirf Logged in User - Guard Active 👮‍♂️)
// Dekho 'protect' beech mein khada hai
router.post("/", protect, createProperty);

module.exports = router;