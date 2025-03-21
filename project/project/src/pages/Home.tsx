import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { PlusSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface Meme {
  id: string;
  image_url: string;
  created_at: string;
  user_id: string;
}

const Home = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMemes = async () => {
      const { data } = await supabase
        .from('memes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setMemes(data);
    };

    fetchMemes();
  }, []);

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-green-400"
      style={{
        backgroundImage: `
          url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1600&q=80"),
          linear-gradient(to bottom right, rgba(147, 51, 234, 0.7), rgba(59, 130, 246, 0.7), rgba(16, 185, 129, 0.7))
        `,
        backgroundBlendMode: 'overlay',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 backdrop-blur-sm bg-white/30 p-6 rounded-xl">
          <h1 className="text-4xl font-bold text-white text-shadow">
            Welcome to Meme Generator
          </h1>
          <Link
            to="/generator"
            className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition duration-300 border border-white/30"
          >
            <PlusSquare size={24} />
            <span>Create New Meme</span>
          </Link>
        </div>

        {user ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memes.map((meme) => (
              <div 
                key={meme.id} 
                className="group relative overflow-hidden rounded-xl transition-transform duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src={meme.image_url}
                  alt="Meme"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-sm backdrop-blur-sm bg-white/10 rounded-lg px-3 py-1 inline-block">
                    Created: {new Date(meme.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 backdrop-blur-sm bg-white/20 rounded-xl border border-white/30">
            <h2 className="text-3xl font-semibold text-white mb-6">
              Join the Meme Revolution
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Sign in to view and create amazing memes that will make the internet a funnier place!
            </p>
            <Link
              to="/login"
              className="inline-block px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition duration-300 border border-white/30 text-lg"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;