const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");


dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());


app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});