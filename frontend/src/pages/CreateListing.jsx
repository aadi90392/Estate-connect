import { useState, useContext } from 'react';
import axios from 'axios'; // API call ke liye
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; // Token lene ke liye

const CreateListing = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    type: 'Rent', // Default
    image: 'https://via.placeholder.com/150', // Default dummy image
  });

  const { title, description, price, location, type, image } = formData;

  const onChange = (e) => {
    // Agar input Text/Number/Select hai
    setFormData({
        ...formData,
        [e.target.id]: e.target.value
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
        // Backend URL
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`, // 🔑 Token dikhana zaroori hai
            },
        };

        const response = await axios.post('http://localhost:5000/api/properties', formData, config);

        if(response.data){
            toast.success('Property Created Successfully! 🏘️');
            navigate('/properties'); // Banane ke baad list wale page par bhej do
        }

    } catch (error) {
        toast.error(error.response?.data?.message || 'Error creating property');
    }
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
      
      <form onSubmit={onSubmit} className='flex flex-col sm:flex-row gap-4'>
        
        {/* --- LEFT SIDE (Inputs) --- */}
        <div className='flex flex-col gap-4 flex-1'>
          <input type='text' placeholder='Title' className='border p-3 rounded-lg' id='title' required onChange={onChange} value={title} />
          <textarea placeholder='Description' className='border p-3 rounded-lg' id='description' required onChange={onChange} value={description} />
          <input type='text' placeholder='Location (City, Address)' className='border p-3 rounded-lg' id='location' required onChange={onChange} value={location} />
          
          <div className='flex gap-6 flex-wrap'>
            {/* Type Selection */}
            <div className='flex gap-2'>
              <span className='font-semibold'>Type:</span>
              <select id='type' className='border rounded-lg p-1' onChange={onChange} value={type}>
                  <option value="Rent">Rent</option>
                  <option value="Sale">Sale</option>
              </select>
            </div>

            {/* Price Input */}
            <div className='flex items-center gap-2'>
              <input type='number' id='price' required className='p-3 border border-gray-300 rounded-lg' onChange={onChange} value={price} />
              <div className='flex flex-col items-center'>
                <p>Price</p>
                <span className='text-xs'>(₹ / Month)</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE (Image & Submit) --- */}
        <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>Images: <span className='font-normal text-gray-500 ml-2'>The first image will be the cover (Link)</span></p>
            <div className='flex gap-4'>
                <input className='p-3 border border-gray-300 rounded w-full' type='text' id='image' placeholder='Image URL (e.g. https://image.com/house.jpg)' value={image} onChange={onChange} />
            </div>
            
            <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                Create Listing
            </button>
        </div>
      
      </form>
    </main>
  );
};

export default CreateListing;