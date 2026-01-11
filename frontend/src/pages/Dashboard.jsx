import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import { FaEdit, FaTrash, FaPlus, FaUserShield } from 'react-icons/fa'; 

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/properties');
        
        let filteredListings;

        // Admin Check Logic
        if (user.role === 'admin') {
            filteredListings = res.data;
        } else {
            filteredListings = res.data.filter((item) => item.user === user._id);
        }
        
        setUserListings(filteredListings);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching listings");
        setLoading(false);
      }
    };

    fetchListings();
  }, [user._id, user.role]); 

  // --- DELETE FUNCTION ---
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const config = {
            headers: { Authorization: `Bearer ${user.token}` }
        };

        await axios.delete(`http://localhost:5000/api/properties/${id}`, config);
        
        setUserListings((prev) => prev.filter((item) => item._id !== id));
        toast.success("Property Deleted! 🗑️");
      
      } catch (error) {
        toast.error(error.response?.data?.message || "Delete Failed");
      }
    }
  };

  return (
    <div className='p-3 max-w-4xl mx-auto'>
      
      <div className="flex justify-between items-center my-7">
        <h1 className='text-3xl font-semibold flex items-center gap-2'>
            {user.role === 'admin' ? <FaUserShield className="text-blue-600"/> : null}
            {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
        </h1>
        
        <Link to="/create-listing" className='bg-green-700 text-white p-3 rounded-lg flex items-center gap-2 hover:opacity-95'>
           <FaPlus /> Create New
        </Link>
      </div>

      <div className='flex flex-col gap-4'>
        
        {loading && <p>Loading properties...</p>}

        {!loading && userListings.length === 0 && (
            <p className="text-gray-500 text-center text-xl mt-10">No properties found.</p>
        )}

        {!loading && userListings.map((listing) => (
          <div key={listing._id} className={`border rounded-lg p-3 flex justify-between items-center shadow-sm gap-4 ${user.role === 'admin' ? 'bg-blue-50' : 'bg-white'}`}>
            
            <Link to={`/property/${listing._id}`}>
              <img 
                src={listing.image || "https://via.placeholder.com/150"} 
                alt="listing cover" 
                className='h-16 w-24 object-cover rounded-md' 
              />
            </Link>
            
            <Link className='text-slate-700 font-semibold hover:underline truncate flex-1' to={`/property/${listing._id}`}>
              <p>{listing.title}</p>
              {user.role === 'admin' && <span className='text-xs text-red-500'>User ID: {listing.user}</span>}
            </Link>
  
            <div className='flex flex-col gap-2'>
               {/* DELETE BUTTON */}
               <button onClick={() => handleDelete(listing._id)} className='text-red-700 uppercase text-sm flex items-center gap-1 border border-red-700 px-2 py-1 rounded hover:bg-red-700 hover:text-white transition w-full justify-center'>
                 <FaTrash /> Delete
               </button>

               {/* 👇 EDIT BUTTON (Link to Edit Page) 👇 */}
               <Link to={`/edit-listing/${listing._id}`}>
                 <button className='text-green-700 uppercase text-sm flex items-center gap-1 border border-green-700 px-2 py-1 rounded hover:bg-green-700 hover:text-white transition w-full justify-center'>
                    <FaEdit /> Edit
                 </button>
               </Link>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default Dashboard;