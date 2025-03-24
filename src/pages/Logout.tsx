import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Logout() {
  const navigate = useNavigate();

  
  useEffect(() => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  }, [navigate]);

  return (
    <div>
      <h1>Loging Out...</h1>
    </div>
  );
}