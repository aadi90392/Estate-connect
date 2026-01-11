import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBed, FaBath } from 'react-icons/fa';

export default function ListingItem({ listing }) {
  return (
    <div className='bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl w-full border border-slate-100 group flex flex-col h-full hover:-translate-y-1'>
      <Link to={`/property/${listing._id}`} className='flex flex-col h-full'>
        
        {/* --- SMART IMAGE SECTION (No Crop, No Zoom) --- */}
        <div className='relative h-[220px] w-full bg-slate-900 overflow-hidden'>
            
            {/* LAYER 1: Blur Background (Fill area) */}
            <div 
                className="absolute inset-0 bg-cover bg-center blur-md opacity-60 scale-110"
                style={{ backgroundImage: `url(${listing.image || "https://via.placeholder.com/400"})` }}
            ></div>

            {/* LAYER 2: Main Image (Fit properly) */}
            <img
              src={listing.image || "https://via.placeholder.com/400"}
              alt='listing cover'
              className='relative z-10 h-full w-full object-contain transition-transform duration-500 group-hover:scale-105'
            />
            
            {/* BADGE */}
            <div className='absolute top-3 left-3 z-20'>
                <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white shadow-md border border-white/20 ${listing.type === 'Rent' ? 'bg-indigo-600' : 'bg-green-600'}`}>
                    {listing.type}
                </span>
            </div>
        </div>

        {/* --- INFO SECTION --- */}
        <div className='p-4 flex flex-col gap-2 flex-1'>
          
          {/* Title */}
          <p className='truncate text-lg font-bold text-slate-800 capitalize group-hover:text-indigo-600 transition-colors'>
            {listing.title}
          </p>

          {/* Location */}
          <div className='flex items-center gap-1 text-slate-500 text-xs font-medium'>
            <FaMapMarkerAlt className='text-indigo-500' />
            <p className='truncate'>{listing.location}</p>
          </div>

          {/* Price */}
          <p className='text-slate-900 mt-2 font-extrabold text-xl flex items-center'>
            ₹ {listing.price.toLocaleString('en-IN')}
            {listing.type === 'Rent' && <span className='text-xs text-slate-400 font-normal ml-1'>/ mo</span>}
          </p>

          {/* Description */}
          <p className='text-xs text-slate-500 line-clamp-2 leading-relaxed'>
            {listing.description}
          </p>

          {/* Footer Icons */}
          <div className='flex gap-4 mt-auto pt-4 border-t border-slate-100 text-xs font-bold text-slate-500'>
             <div className='flex items-center gap-1'>
                <FaBed className="text-lg text-slate-400" /> 
                <span>{listing.bedrooms > 0 ? `${listing.bedrooms} Beds` : '2 Beds'}</span>
             </div>
             <div className='flex items-center gap-1'>
                <FaBath className="text-lg text-slate-400" /> 
                <span>{listing.bathrooms > 0 ? `${listing.bathrooms} Baths` : '1 Bath'}</span>
             </div>
          </div>

        </div>
      </Link>
    </div>
  );
}