const Property = require("../models/propertyModel");

const getProperties = async (req, res) => {
  const { search, type } = req.query;

  // 1. Search Query Banao (Agar search hai to regex lagao, nahi to khali object)
  const query = search ? {
    $or: [
      { title: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ]
  } : {};

  // 2. Type Filter Add karo (Agar type aaya hai to)
  if (type) query.type = type;

  // 3. Find and Send
  const properties = await Property.find(query);
  res.status(200).json(properties);
};

   const getProperty = async(req,res)=>{
    const property = await Property.findById(req.params.id).populate("user", "name email");

    if(!property){
      res.status(404);
      throw new Error("Property Not Found")
    }

    res.status(200).json(property);
   }

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


const updateProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property Not Found");
  }
  if (property.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(401);
    throw new Error("User Not Authorized");
  }
  const updatedProperty = await Property.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } // Ye naya data wapas return karega
  );

  res.status(200).json(updatedProperty);
};
          const deleteProperty = async(req, res)=>{
            const property = await Property.findById(req.params.id);

            if(!property){
              res.status(404);
              throw new Error("Property not found");
            }

            if(property.user.toString()!== req.user.id && req.user.role !== "admin"  ){
              res.status(401);
              throw new Error("User Not Authorized");
            }

            await property.deleteOne();
            res.status(200).json({ id: req.params.id, message: "Property deleted successfully" });

          };



module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty
};