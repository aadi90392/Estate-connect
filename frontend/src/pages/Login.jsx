import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaEnvelope, FaLock } from 'react-icons/fa'; // Icons import kiye

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen">
      
      {/* --- LEFT SIDE: IMAGE (Sirf Desktop pe dikhegi) --- */}
      <div className="hidden lg:flex w-1/2 bg-cover bg-center" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop')" }}>
        <div className="w-full h-full bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-white text-center p-10">
            <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>
            <p className="text-lg">Log in to manage your estate portfolio.</p>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white p-10">
        
        <div className="w-full max-w-md">
          {/* Logo / Heading */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Sign In</h2>
            <p className="text-slate-500 mt-2">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            
            {/* Email Field with Icon */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                placeholder="Email Address"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
                value={email}
                onChange={onChange}
                required
              />
            </div>

            {/* Password Field with Icon */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
                value={password}
                onChange={onChange}
                required
              />
            </div>

            {/* Forgot Password Link (Visual Only for now) */}
            <div className="flex justify-end text-sm">
              <a href="#" className="text-slate-600 hover:text-slate-900 font-medium">Forgot Password?</a>
            </div>

            {/* Submit Button */}
            <button className="bg-slate-900 text-white p-3 rounded-lg font-semibold text-lg hover:bg-slate-800 transition shadow-lg transform active:scale-95">
              Sign In
            </button>
          
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center text-slate-600">
            Don't have an account? 
            <Link to="/register" className="text-slate-900 font-bold hover:underline ml-1">
              Create an account
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;