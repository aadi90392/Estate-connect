import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance'; // ✅ Change 1: Smart Axios Import
import { FaSearch, FaFire, FaHome, FaUserShield, FaArrowRight } from 'react-icons/fa';
import ListingItem from '../components/ListingItem';

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        // ✅ Change 2: URL short kar diya. Ab ye Local aur Render dono pe chalega.
        const res = await axios.get('/properties'); 
        setOfferListings(res.data.slice(0, 4)); // Top 4 properties
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  // --- SEARCH HANDLER ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('search', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/properties?${searchQuery}`);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* ================= HERO SECTION (Cinematic Look) ================= */}
      <div className='relative h-[550px] sm:h-[650px] flex flex-col justify-center items-center text-center px-4'>
        
        {/* Background Image with Dark Overlay */}
        <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop')" }}
        >
            {/* Dark Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
        </div>

        {/* Hero Content */}
        <div className='relative z-10 flex flex-col gap-6 max-w-4xl mx-auto items-center animate-fade-in-up'>
            <h1 className='text-white font-extrabold text-4xl sm:text-6xl drop-shadow-lg leading-tight'>
              Find your next <span className='text-indigo-400'>perfect</span> place
              <br /> to call home.
            </h1>
            
            <p className='text-gray-200 text-sm sm:text-lg max-w-2xl drop-shadow-md'>
              EstateConnect helps you find homes, apartments, and unique places to live with an immersive experience.
            </p>

            {/* 🔥 HERO SEARCH BAR 🔥 */}
            <form onSubmit={handleSubmit} className='bg-white p-2 rounded-full shadow-2xl flex items-center w-full max-w-2xl mt-4 border-4 border-white/20 transform transition-transform hover:scale-105'>
                <div className="pl-4 text-slate-400">
                    <FaSearch size={18} />
                </div>
                <input 
                    type="text" 
                    placeholder="Search by city, location (e.g. 'Indore')..." 
                    className='bg-transparent focus:outline-none w-full text-slate-700 px-4 py-3 text-base sm:text-lg'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className='bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors uppercase text-sm tracking-wider'>
                    Search
                </button>
            </form>
        </div>
      </div>

      {/* ================= TRUST BADGES (Why Choose Us) ================= */}
      <div className="max-w-6xl mx-auto px-4 py-16">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition border border-slate-100 flex flex-col items-center gap-3">
                <div className="bg-orange-100 p-4 rounded-full text-orange-600"><FaFire size={24} /></div>
                <h3 className="font-bold text-lg text-slate-800">Trending Properties</h3>
                <p className="text-slate-500 text-sm">We showcase the hottest and most viewed properties in your area.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition border border-slate-100 flex flex-col items-center gap-3">
                <div className="bg-blue-100 p-4 rounded-full text-blue-600"><FaHome size={24} /></div>
                <h3 className="font-bold text-lg text-slate-800">Wide Range</h3>
                <p className="text-slate-500 text-sm">From cozy apartments to luxury villas, we have it all sorted for you.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition border border-slate-100 flex flex-col items-center gap-3">
                <div className="bg-green-100 p-4 rounded-full text-green-600"><FaUserShield size={24} /></div>
                <h3 className="font-bold text-lg text-slate-800">Trusted Landlords</h3>
                <p className="text-slate-500 text-sm">Direct contact with verified owners. No hidden agents involved.</p>
            </div>

         </div>
      </div>

      {/* ================= RECENT OFFERS SECTION ================= */}
      <div className='max-w-7xl mx-auto px-4 flex flex-col gap-8 mb-20'>
        
        {offerListings && offerListings.length > 0 && (
          <div className='flex flex-col gap-6'>
            
            {/* Section Header */}
            <div className='flex justify-between items-end border-b border-slate-200 pb-4'>
              <div>
                  <h2 className='text-3xl font-bold text-slate-800'>Recent Offers</h2>
                  <p className='text-slate-500 text-sm mt-1'>Check out the latest properties listed on our platform</p>
              </div>
              <Link className='group text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1' to={'/properties'}>
                View all properties <FaArrowRight className="group-hover:translate-x-1 transition-transform"/>
              </Link>
            </div>
            
            {/* Property Cards Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>

          </div>
        )}
      </div>

      {/* ================= CTA SECTION ================= */}
      <div className="bg-slate-900 py-16 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Have a property to list?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">Join thousands of landlords who trust EstateConnect to find great tenants quickly and effortlessly.</p>
          <Link to="/create-listing" className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors">
              Start Listing Now
          </Link>
      </div>

    </div>
  );
};

export default Home;