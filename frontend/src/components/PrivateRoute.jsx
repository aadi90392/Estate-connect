import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);

  // 1. Agar Loading hai, to kuch mat karo (screen blank rakho ya spinner dikhao)
  if (loading) return <div className="p-10 text-center">Checking auth...</div>;

  // 2. Loading khatam. Ab user hai? Haan -> Andar jao. Na -> Login pe jao.
  return user ? <Outlet /> : <Navigate to='/login' />;
}

export default PrivateRoute;