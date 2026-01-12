import { createContext, useState, useEffect } from "react";
import axios from "../utils/axiosInstance"; // ✅ Humara naya smart axios
import { toast } from "react-toastify";

// Global Store Context Create
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // App start hote hi check karo user login hai ya nahi
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // --- REGISTER ---
    const register = async (userData) => {
        try {
            // ✅ CHANGE: Pura URL hataya, bas endpoint rakha
            // axiosInstance khud 'http://localhost:5000/api' laga lega
            const response = await axios.post('/users/register', userData);

            if (response.data) {
                localStorage.setItem("user", JSON.stringify(response.data));
                setUser(response.data);
                toast.success("Registration Successful! 🎉");
                return true;
            }
        } catch (error) {
            const message = error.response?.data?.message || "Registration Failed";
            toast.error(message);
            return false;
        }
    };

    // --- LOGIN ---
    const login = async (userData) => {
        try {
            // ✅ CHANGE: Yahan bhi short URL kar diya
            const response = await axios.post('/users/login', userData);

            if (response.data) {
                localStorage.setItem("user", JSON.stringify(response.data));
                setUser(response.data);
                toast.success(`Welcome back, ${response.data.name}! 👋`);
                return true;
            }
        } catch (error) {
            const message = error.response?.data?.message || "Login Failed";
            toast.error(message);
            return false;
        }
    };

    // --- LOGOUT ---
    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        toast.info("Logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;