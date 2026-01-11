import { useEffect, useState } from 'react';
import axios from 'axios';
import ListingItem from '../components/ListingItem';
import { useLocation, Link } from 'react-router-dom';
import { FaSearchMinus } from 'react-icons/fa';

const Properties = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const url = `https://estate-connect-u36j.onrender.com/api/properties${location.search}`;
        const res = await axios.get(url);
        setListings(res.data);
        
        // Fake delay for smoothness
        setTimeout(() => {
            setLoading(false);
        }, 500);

      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  return (
    <div className='min-h-screen bg-slate-50/50'>
      
      {/* HEADER STRIP */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {location.search ? 'Search Results' : 'Explore Properties'}
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
                {loading ? 'Finding best matches...' : `Showing ${listings.length} properties`}
            </p>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
        
        {/* LOADING STATE */}
        {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <div key={n} className="bg-white rounded-2xl h-[380px] border border-slate-100 animate-pulse">
                        <div className="h-[220px] bg-slate-200 rounded-t-2xl"></div>
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                            <div className="h-10 bg-slate-200 rounded w-full mt-4"></div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* NO RESULTS STATE */}
        {!loading && listings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                <div className="bg-white p-6 rounded-full shadow-sm mb-4 text-slate-300">
                    <FaSearchMinus size={50} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">No Properties Found</h3>
                <p className="text-slate-500 mt-2 text-sm max-w-xs mx-auto">
                    We couldn't find any properties matching your search. Try different keywords.
                </p>
                <Link to="/properties" className="mt-6 bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition shadow-lg hover:-translate-y-0.5">
                    Clear Filters
                </Link>
            </div>
        )}

        {/* DATA GRID */}
        {!loading && listings.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
                {listings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing} />
                ))}
            </div>
        )}

      </div>
    </div>
  );
};

export default Properties;     