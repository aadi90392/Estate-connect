import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const LandlordRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="text-center mt-10">Checking permissions...</div>;

  // STRICT CHECK: Sirf User hona kaafi nahi, ROLE bhi sahi hona chahiye
  if (user && (user.role === 'landlord' || user.role === 'admin')) {
      return <Outlet />; // Andar jaane do
  } else {
      return <Navigate to='/' />; // Dafa karo Home page par
  }
}

export default LandlordRoute;