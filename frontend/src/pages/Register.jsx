import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaBriefcase } from 'react-icons/fa'; // Icons
import AuthContext from '../context/AuthContext';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user', 
  });

  const { name, email, password, role } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) {
      navigate('/'); 
    }
  };

  return (
    <div className="flex min-h-screen">
      
      {/* --- RIGHT SIDE: FORM --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white p-10">
        
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
            <p className="text-slate-500 mt-2">Join EstateConnect to find your dream place</p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            
            {/* Name Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input type="text" id="name" placeholder="Full Name" value={name} onChange={onChange} required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition"
              />
            </div>
            
            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input type="email" id="email" placeholder="Email Address" value={email} onChange={onChange} required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition"
              />
            </div>
            
            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input type="password" id="password" placeholder="Password" value={password} onChange={onChange} required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition"
              />
            </div>

            {/* Role Selection */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBriefcase className="text-gray-400" />
                </div>
                <select id="role" value={role} onChange={onChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white transition appearance-none"
                >
                    <option value="user">I am a Buyer / Tenant</option>
                    <option value="landlord">I am a Landlord / Seller</option>
                </select>
                {/* Custom Arrow for Select */}
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>

            <button className="bg-slate-900 text-white p-3 rounded-lg font-semibold text-lg hover:bg-slate-800 transition shadow-lg transform active:scale-95 mt-2">
              Sign Up
            </button>
          </form>

          <div className="mt-8 text-center text-slate-600">
            Already have an account? 
            <Link to="/login" className="text-slate-900 font-bold hover:underline ml-1">
              Log in
            </Link>
          </div>
        </div>
      </div>

      {/* --- LEFT SIDE: IMAGE (Image change kar di thodi variety ke liye) --- */}
      <div className="hidden lg:flex w-1/2 bg-cover bg-center" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop')" }}>
        <div className="w-full h-full bg-slate-900 bg-opacity-40 flex items-center justify-center">
          <div className="text-white text-center p-10">
            <h1 className="text-5xl font-bold mb-4">Join Us Today</h1>
            <p className="text-lg">Start your journey to find the perfect home.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Register;