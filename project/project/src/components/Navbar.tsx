import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, PlusSquare, LogIn, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-4 items-center">
            <Link to="/" className="flex items-center space-x-2 text-gray-800 hover:text-gray-600">
              <Home size={24} />
              <span className="font-bold">Meme Generator</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/generator"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              <PlusSquare size={20} />
              <span>Create</span>
            </Link>

            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition"
              >
                <LogIn size={20} />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;