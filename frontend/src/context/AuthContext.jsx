import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Global Store Context Create
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // ✅ Fix 1: Loading state add kiya

    const API_URL = "http://localhost:5000/api/users";

    useEffect(() => {
        const storedUser = localStorage.getItem("user"); // Spelling correct kari (storedUser)
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false); // ✅ Fix 2: Checking khatam, ab app load hone do
    }, []);

    // --- REGISTER ---
    const register = async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/register`, userData);

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
            const response = await axios.post(`${API_URL}/login`, userData);

            // ✅ Fix 3: Yahan se semi-colon (;) hata diya jo pehle laga tha
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
        // ✅ Fix 4: 'loading' ko bhi pass kiya taaki PrivateRoute use kar sake
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;