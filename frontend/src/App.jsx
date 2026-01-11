import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute"; // Normal Login Check
import LandlordRoute from "./components/LandlordRoute"; // 🟢 NEW STRICT CHECK

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import CreateListing from "./pages/CreateListing";
import Property from "./pages/Property";
import EditListing from "./pages/EditListing";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          {/* Public Routes (Sabke liye khule hain) */}
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/property/:id" element={<Property />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔐 PRIVATE ROUTES (Sirf Login walo ke liye - Future User Profile etc.) */}
          <Route element={<PrivateRoute />}>
             {/* Agar future me User Profile banani ho to yahan aayegi */}
          </Route>

          {/* 🛑 LANDLORD ONLY ROUTES (Agar User ghusa to bahar phek denge) */}
          <Route element={<LandlordRoute />}>
             <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/create-listing" element={<CreateListing />} />
             <Route path="/edit-listing/:id" element={<EditListing />} />
          </Route>

        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;