const mongoose = require("mongoose");

const propertySchema = mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    title: {
        type: String,
        required: [true, "Please add a property title"],
    },description: {
      type: String,
      required: [true, "Please add a description"],
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
    },
    location: {
      type: String,
      required: [true, "Please add a location (City/Address)"],
    },
    type: {
      type: String,
      required: true,
      enum: ["Rent", "Sale"], 
      default: "Rent",
    },
    
    image: {
      type: String, 
      default: "https://via.placeholder.com/150", 
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Property", propertySchema);