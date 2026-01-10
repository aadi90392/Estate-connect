const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");


//Generate Token

const generatetoken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};


const registerUser = async (req, res) => {
    try {
        //Frontend data lana
        const { name, email, password, role } = req.body;

        // data validate 
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }
        //duplicate check krunga abhi...
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User Already Exists" });
        };


        const salt = await bcrypt.genSalt(10);

        const hashedpassword = await bcrypt.hash(password, salt);


        //password save krunga av...

        const user = await User.create({
            name,
            email,
            password: hashedpassword,
            role,
        });
        // deatils bej raha hu frontend pe wapas user ki 

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generatetoken(user._id),
                message: "User Successfully Register"
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;


        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generatetoken(user._id),
                message: "Login Successful! 🎉",
            });

        }

        else {
            res.status(401).json({ message: "Invalid Email Or Password" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getMe = async (req, res) => {
    // Middleware ne pehle hi user dhoond ke req.user me rakh diya hai
    res.status(200).json(req.user);
};
module.exports = {
    registerUser,
    loginUser,
    getMe,
};