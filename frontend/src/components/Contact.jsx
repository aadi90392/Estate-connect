import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Backend se jo data aaya (listing.user), usse set karo
    if(listing.user){
        setLandlord(listing.user);
    }
  }, [listing.user]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{landlord.name}</span> for{' '}
            <span className='font-semibold'>{listing.title.toLowerCase()}</span>
          </p>
          
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg mt-2'
          ></textarea>

          {/* --- MAGIC LINK (Mailto) --- */}
          {/* Ye browser ka default Email App khol dega */}
          <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listing.title}&body=${message}`}
          className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;