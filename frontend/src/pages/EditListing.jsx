import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom'; // ID lene ke liye
import AuthContext from '../context/AuthContext';

const EditListing = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams(); // URL se ID nikalne ke liye
  const listingId = params.id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    type: 'Rent',
    image: '',
  });

  // --- PURANA DATA FETCH KARO ---
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`https://estate-connect-u36j.onrender.com/api/properties/${listingId}`);
        // Data aate hi Form me set kar do
        setFormData(res.data);
      } catch (error) {
        toast.error('Could not fetch listing details');
      }
    };

    fetchListing();
  }, [listingId]);


  const onChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // --- UPDATE FUNCTION ---
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
        const config = {
            headers: { Authorization: `Bearer ${user.token}` },
        };

        // PUT REQUEST (Update ke liye)
        await axios.put(`https://estate-connect-u36j.onrender.com/api/properties/${listingId}`, formData, config);

        toast.success('Property Updated Successfully! ✏️');
        navigate('/dashboard'); // Wapas dashboard bhejo

    } catch (error) {
        toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Edit Listing</h1>
      
      <form onSubmit={onSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input type='text' placeholder='Title' className='border p-3 rounded-lg' id='title' required onChange={onChange} value={formData.title} />
          <textarea placeholder='Description' className='border p-3 rounded-lg' id='description' required onChange={onChange} value={formData.description} />
          <input type='text' placeholder='Location' className='border p-3 rounded-lg' id='location' required onChange={onChange} value={formData.location} />
          
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <span className='font-semibold'>Type:</span>
              <select id='type' className='border rounded-lg p-1' onChange={onChange} value={formData.type}>
                  <option value="Rent">Rent</option>
                  <option value="Sale">Sale</option>
              </select>
            </div>
            <div className='flex items-center gap-2'>
              <input type='number' id='price' required className='p-3 border border-gray-300 rounded-lg' onChange={onChange} value={formData.price} />
              <p>Price (₹)</p>
            </div>
          </div>
        </div>

        <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>Image URL:</p>
            <input className='p-3 border border-gray-300 rounded w-full' type='text' id='image' value={formData.image} onChange={onChange} />
            
            {/* Preview Image */}
            <img src={formData.image || "https://via.placeholder.com/150"} alt="preview" className="w-full h-40 object-cover rounded-lg" />

            <button className='p-3 bg-green-700 text-white rounded-lg uppercase hover:opacity-95'>
                Update Listing
            </button>
        </div>
      </form>
    </main>
  );
};

export default EditListing;