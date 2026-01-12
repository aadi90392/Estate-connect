const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer"); // 📧 Email ke liye

// Token Generator
const generatetoken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// --- REGISTER ---
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User Already Exists" });
        };

        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedpassword,
            role,
        });

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

// --- LOGIN ---
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

// --- GET ME ---
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// 🔥 NEW: FORGOT PASSWORD (Send OTP)
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 1. Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 2. Save to DB (Valid for 10 mins)
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 Minutes
        await user.save();

        // 3. Send Email
        const transporter = nodemailer.createTransport({
            service: "gmail", // Ya koi aur service
            auth: {
                user: process.env.EMAIL_USER, // .env me daalna
                pass: process.env.EMAIL_PASS, // .env me App Password daalna
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset OTP - EstateConnect",
            text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "OTP sent to your email" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Email sending failed" });
    }
};

// 🔥 NEW: RESET PASSWORD (Verify OTP & Change Password)
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // Find user with matching Email AND OTP AND Not Expired
        const user = await User.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or Expired OTP" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear OTP fields
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Password Updated Successfully! Please Login." });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    forgotPassword, // ✅ Exported
    resetPassword,  // ✅ Exported
};