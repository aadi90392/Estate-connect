import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaBuilding, FaChevronDown, FaSignOutAlt, FaTachometerAlt, FaPlusCircle, FaMapMarkerAlt } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import axios from 'axios'; // 🟢 Axios import zaroori hai data lane ke liye

const Header = () => {
  // --- 1. SAARE HOOKS TOP PAR ---
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null); // Search box ke bahar click detect karne ke liye
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]); // 🟢 Real-time data yahan aayega
  const [showResults, setShowResults] = useState(false); // Dropdown dikhana hai ya nahi
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // --- 2. LIVE SEARCH LOGIC (DEBOUNCING) ---
  useEffect(() => {
    // Agar search khali hai to results hatao
    if (searchTerm.length === 0) {
        setSearchResults([]);
        setShowResults(false);
        return;
    }

    // Debouncing: User ke rukne ka wait karo (300ms) fir API call karo
    const delayDebounceFn = setTimeout(async () => {
        try {
            const res = await axios.get(`https://estate-connect-u36j.onrender.com/api/properties?search=${searchTerm}`);
            setSearchResults(res.data.slice(0, 5)); // Sirf top 5 results dikhao
            setShowResults(true);
        } catch (error) {
            console.log(error);
        }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // --- 3. CLICK OUTSIDE HANDLER (Dropdown band karne ke liye) ---
  useEffect(() => {
    const handleClickOutside = (event) => {
        // User Profile Dropdown close logic
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
        // Search Results Dropdown close logic
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
            setShowResults(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- 4. CONDITIONAL RETURN (Login Page Hide Logic) ---
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  // --- Functions ---
  const hideSearch = location.pathname === '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('search', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/properties?${searchQuery}`);
    setShowResults(false); // Enter marne par dropdown band kar do
  };

  const onLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const handleResultClick = (id) => {
      navigate(`/property/${id}`);
      setSearchTerm('');
      setShowResults(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-100">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-3 sm:px-6">
        
        {/* --- LOGO --- */}
        <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-slate-900 text-white p-2 rounded-xl group-hover:bg-indigo-600 transition-colors duration-300">
                <FaBuilding size={18} />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800">
                Estate<span className="text-slate-400 font-normal">Connect</span>
            </h1>
        </Link>

        {/* --- LIVE SEARCH BAR SECTION --- */}
        {!hideSearch ? (
          <div className='relative' ref={searchContainerRef}> {/* Relative zaroori hai absolute dropdown ke liye */}
              
              <form onSubmit={handleSubmit} className='bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 flex items-center w-32 sm:w-96 transition-all hover:shadow-md focus-within:shadow-lg focus-within:bg-white focus-within:border-indigo-300'>
                  <input 
                      type="text" 
                      placeholder="Search city, address..." 
                      className='bg-transparent focus:outline-none w-full text-slate-700 placeholder-slate-400 text-sm font-medium'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => { if(searchTerm) setShowResults(true); }} // Focus karne par wapas dikhao
                  />
                  <button className='text-slate-400 hover:text-indigo-600 transition-colors p-1'>
                    <FaSearch />
                  </button>
              </form>

              {/* 👇👇 LIVE SEARCH RESULTS DROPDOWN 👇👇 */}
              {showResults && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      {searchResults.length > 0 ? (
                          searchResults.map((listing) => (
                              <div 
                                key={listing._id} 
                                onClick={() => handleResultClick(listing._id)}
                                className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b last:border-none border-slate-50 transition-colors"
                              >
                                  {/* Tiny Image */}
                                  <img 
                                    src={listing.image || "https://via.placeholder.com/50"} 
                                    alt="thumb" 
                                    className="h-10 w-10 rounded-lg object-cover"
                                  />
                                  {/* Info */}
                                  <div className="flex flex-col">
                                      <span className="text-sm font-bold text-slate-800 line-clamp-1">{listing.title}</span>
                                      <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <FaMapMarkerAlt size={10}/> {listing.location}
                                      </span>
                                  </div>
                              </div>
                          ))
                      ) : (
                          <div className="p-4 text-center text-sm text-slate-500">
                              No properties found.
                          </div>
                      )}
                  </div>
              )}

          </div>
        ) : (
           <div className="hidden sm:block"></div> 
        )}

        {/* --- MENU --- */}
        <ul className="flex items-center gap-8 text-sm font-medium text-slate-600">
          
          <Link to="/">
            <li className="hidden md:block hover:text-indigo-600 transition-colors">Home</li>
          </Link>
          <Link to="/properties">
            <li className="hidden md:block hover:text-indigo-600 transition-colors">Properties</li>
          </Link>

          {user ? (
            <div className='relative' ref={dropdownRef}>
                {/* User Button */}
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="flex items-center gap-3 focus:outline-none bg-slate-50 hover:bg-slate-100 py-1.5 px-2 pr-3 rounded-full border border-slate-200 transition-all active:scale-95"
                >
                    <img 
                      className='rounded-full h-8 w-8 object-cover shadow-sm' 
                      src={`https://ui-avatars.com/api/?name=${user.name}&background=0f172a&color=fff&bold=true`}
                      alt="profile" 
                    />
                    <div className='flex flex-col items-start leading-none'>
                        <span className="text-slate-800 font-bold text-xs">{user.name.split(' ')[0]}</span>
                        <span className="text-[10px] text-slate-500 uppercase">{user.role}</span>
                    </div>
                    <FaChevronDown className={`text-[10px] text-slate-400 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-4 w-60 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden transform transition-all origin-top-right animate-in fade-in zoom-in-95 duration-200">
                    
                    <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
                        <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                    </div>

                    <div className="py-2 px-2">
                        {(user.role === 'landlord' || user.role === 'admin') && (
                        <>
                            <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-slate-700 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors group">
                                <FaTachometerAlt className="text-slate-400 group-hover:text-indigo-600" />
                                <span>Dashboard</span>
                            </Link>
                            
                            <Link to="/create-listing" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-slate-700 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors group">
                                <FaPlusCircle className="text-slate-400 group-hover:text-indigo-600" />
                                <span>Add Property</span>
                            </Link>
                            
                            <div className="h-px bg-slate-100 my-2 mx-3"></div>
                        </>
                        )}
                        
                        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 rounded-xl hover:bg-red-50 transition-colors">
                            <FaSignOutAlt />
                            <span>Sign out</span>
                        </button>
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <Link to="/login">
                <li className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-slate-300 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  Sign In
                </li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;