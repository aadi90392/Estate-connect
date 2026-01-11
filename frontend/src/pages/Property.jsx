import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair, FaShare, FaArrowLeft } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import Contact from '../components/Contact';

const Property = () => {
  const { user } = useContext(AuthContext);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState(false);
  const [copied, setCopied] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/properties/${params.id}`);
        setListing(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.id]);

  // --- SHARE FUNCTION ---
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- SKELETON LOADING ---
  if (loading) return (
    <div className='max-w-7xl mx-auto p-4 animate-pulse'>
        <div className="h-[500px] bg-slate-200 rounded-3xl mb-8"></div>
        <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
                <div className="h-10 bg-slate-200 rounded w-3/4"></div>
                <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                <div className="h-48 bg-slate-200 rounded w-full"></div>
            </div>
            <div className="w-full md:w-[400px] h-72 bg-slate-200 rounded-2xl"></div>
        </div>
    </div>
  );

  if (!listing) return <div className="text-center my-20 text-3xl font-bold text-slate-700">Property Not Found! ❌</div>;

  return (
    <main className='bg-slate-50 min-h-screen pb-10'>
      
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Link to="/properties" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition font-medium w-fit">
            <FaArrowLeft /> Back to Properties
        </Link>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        
        {/* --- 1. SMART CINEMA HERO SECTION (FIXED IMAGE) --- */}
        <div className='relative w-full h-[400px] md:h-[550px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl group border border-slate-700'>
            
            {/* LAYER 1: Blurred Background (Atmosphere ke liye) */}
            <div 
                className="absolute inset-0 bg-cover bg-center blur-2xl opacity-50 scale-110"
                style={{ backgroundImage: `url(${listing.image || "https://via.placeholder.com/1200x800"})` }}
            ></div>

            {/* LAYER 2: Main Image (Original Ratio - Katega Nahi) */}
            <img 
                src={listing.image || "https://via.placeholder.com/1200x800"} 
                alt="Property Cover"
                className="relative z-10 w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            />
            
            {/* Share Button */}
            <div className='absolute top-6 right-6 flex gap-3 z-20'>
                <button onClick={handleShare} className='bg-black/40 backdrop-blur-md p-3 rounded-full text-white hover:bg-white hover:text-indigo-600 transition hover:scale-110 border border-white/10'>
                    <FaShare size={18} />
                </button>
                {copied && <p className='absolute top-14 right-0 whitespace-nowrap rounded-lg bg-black text-white px-3 py-1 text-sm shadow-lg'>Link Copied!</p>}
            </div>
            
            {/* Type Badge */}
            <div className='absolute bottom-6 left-6 z-20'>
                <span className={`${listing.type === 'Rent' ? 'bg-indigo-600' : 'bg-green-600'} text-white px-6 py-2.5 rounded-full font-bold uppercase tracking-wider text-sm shadow-lg border border-white/20`}>
                    For {listing.type}
                </span>
            </div>
        </div>


        {/* --- 2. MAIN CONTENT GRID --- */}
        <div className='flex flex-col lg:flex-row gap-10 mt-10'>
          
          {/* === LEFT SIDE: DETAILS === */}
          <div className='flex-1'>
              
              {/* Title & Address */}
              <div className='border-b border-slate-200 pb-6 mb-8'>
                  <h1 className='text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-4'>
                      {listing.title}
                  </h1>
                  <p className='flex items-center gap-2 text-slate-500 font-medium text-lg'>
                      <FaMapMarkerAlt className='text-indigo-600' size={20} />
                      {listing.location}
                  </p>
              </div>

              {/* Icons / Amenities */}
              <div className='flex flex-wrap items-center gap-4 sm:gap-6 mb-10 text-slate-700 font-bold'>
                  <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
                      <FaBed className='text-2xl text-indigo-500' /> 
                      <span>{listing.bedrooms || 2} Beds</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
                      <FaBath className='text-2xl text-indigo-500' /> 
                      <span>{listing.bathrooms || 1} Baths</span>
                  </div>
                  {listing.parking && (
                    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
                        <FaParking className='text-2xl text-indigo-500' /> 
                        <span>Parking</span>
                    </div>
                  )}
                  {listing.furnished && (
                    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
                        <FaChair className='text-2xl text-indigo-500' /> 
                        <span>Furnished</span>
                    </div>
                  )}
              </div>

              {/* Description */}
              <div className='mb-10'>
                  <h2 className='text-2xl font-bold text-slate-900 mb-4'>About this property</h2>
                  <p className='text-slate-600 leading-relaxed text-lg whitespace-pre-wrap'>
                      {listing.description}
                  </p>
              </div>

          </div>


          {/* === RIGHT SIDE: STICKY PRICE CARD === */}
          <div className='w-full lg:w-[400px]'>
              <div className='bg-white border border-slate-100 rounded-3xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] p-6 sm:p-8 sticky top-28'>
                  
                  <div className='flex flex-col gap-1 mb-8'>
                      <span className='text-slate-500 text-sm font-bold uppercase tracking-wider'>Price</span>
                      <p className='text-4xl sm:text-5xl font-extrabold text-slate-900 flex items-end'>
                          ₹{listing.price.toLocaleString('en-IN')}
                          {listing.type === 'Rent' && <span className='text-xl font-medium text-slate-500 mb-1 ml-1'>/mo</span>}
                      </p>
                  </div>

                  {/* Owner Info */}
                  {listing.user && (
                      <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                           <img 
                              src={`https://ui-avatars.com/api/?name=${listing.user.name}&background=random&size=128`} 
                              alt="owner" 
                              className="w-14 h-14 rounded-full shadow-sm"
                           />
                           <div className="flex flex-col">
                               <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Listed By</span>
                               <span className="text-lg font-bold text-slate-900">{listing.user.name}</span>
                           </div>
                      </div>
                  )}

                  {/* Contact Button Logic */}
                  {user && listing.user?._id !== user._id ? (
                      !contact ? (
                          <button 
                              onClick={() => setContact(true)}
                              className='w-full bg-indigo-600 text-white text-xl font-bold rounded-2xl py-4 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95'
                          >
                              Contact Landlord
                          </button>
                      ) : (
                          <div className="animate-in fade-in zoom-in duration-300">
                              <Contact listing={listing}/>
                          </div>
                      )
                  ) : (
                      !user ? (
                          <Link to="/login" className="block text-center text-indigo-600 font-bold bg-indigo-50 p-4 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition">
                              Log in to contact landlord
                          </Link>
                      ) : (
                           <div className="w-full bg-slate-100 text-slate-400 text-center font-bold rounded-2xl py-4 cursor-not-allowed border border-slate-200">
                              You own this property
                          </div>
                      )
                  )}

              </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Property;