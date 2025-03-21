import React, { useState, useRef } from 'react';
import { Download, Upload, Type } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface MemeText {
  id: string;
  text: string;
  x: number;
  y: number;
}

const MEME_TEMPLATES = [
  { id: 'drake', url: 'https://i.imgflip.com/30b1gx.jpg', name: 'Drake Hotline Bling' },
  { id: 'distracted', url: 'https://i.imgflip.com/1ur9b0.jpg', name: 'Distracted Boyfriend' },
  { id: 'doge', url: 'https://i.imgflip.com/4t0m5.jpg', name: 'Doge' },
  { id: 'buttons', url: 'https://i.imgflip.com/1g8my4.jpg', name: 'Two Buttons' },
  { id: 'expanding-brain', url: 'https://i.imgflip.com/1jwhww.jpg', name: 'Expanding Brain' },
  { id: 'gru', url: 'https://i.imgflip.com/1bhw.jpg', name: 'Gru Plan' },
  { id: 'pikachu', url: 'https://i.imgflip.com/2kbn1e.jpg', name: 'Surprised Pikachu' }
];

function Generator() {
  const [memeImage, setMemeImage] = useState<string>(MEME_TEMPLATES[0].url);
  const [texts, setTexts] = useState<MemeText[]>([]);
  const [fontSize, setFontSize] = useState<number>(32);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMemeImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addText = () => {
    const newText: MemeText = {
      id: Date.now().toString(),
      text: 'Edit Me',
      x: 50,
      y: 50
    };
    setTexts([...texts, newText]);
  };

  const handleTextEdit = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setTexts(texts.map((t) => (t.id === id ? { ...t, text: e.target.value } : t)));
  };

  const handleTextDragStart = (id: string) => {
    setDraggingId(id);
  };

  const handleTextDrag = (e: React.MouseEvent) => {
    if (!draggingId) return;
    setTexts(texts.map((t) => (t.id === draggingId ? { ...t, x: e.clientX - 50, y: e.clientY - 50 } : t)));
  };

  const handleTextDragEnd = () => {
    setDraggingId(null);
  };

  const downloadMeme = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      ctx.font = `${fontSize}px Impact`;
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = fontSize / 16;
      ctx.textAlign = 'center';

      texts.forEach(({ text, x, y }) => {
        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);
      });

      const link = document.createElement('a');
      link.download = 'meme.png';
      link.href = canvas.toDataURL();
      link.click();
    };
    img.src = memeImage;
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center" onMouseMove={handleTextDrag} onMouseUp={handleTextDragEnd}>
      <h1 className="text-white text-4xl mb-6">Meme Generator</h1>

      {/* Meme Templates with Black Background */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {MEME_TEMPLATES.map((template) => (
          <button 
            key={template.id} 
            onClick={() => setMemeImage(template.url)} 
            className="border border-gray-600 p-1 rounded-md bg-black"
          >
            <img 
              src={template.url} 
              alt={template.name} 
              className="w-32 h-32 object-cover border border-gray-700"
            />
          </button>
        ))}
      </div>

      {/* Meme Editing Canvas */}
      <div className="relative border-2 border-gray-500 rounded-lg overflow-hidden w-[500px] h-[500px] bg-white">
        <img src={memeImage} alt="Meme template" className="w-full h-full object-contain" />
        {texts.map((textObj) => (
          <div
            key={textObj.id}
            style={{ position: 'absolute', left: textObj.x, top: textObj.y, cursor: 'move' }}
            onMouseDown={() => handleTextDragStart(textObj.id)}
          >
            <input
              type="text"
              value={textObj.text}
              onChange={(e) => handleTextEdit(textObj.id, e)}
              className="bg-transparent text-white font-bold text-center w-full outline-none"
              style={{ fontSize: `${fontSize}px` }}
            />
          </div>
        ))}
      </div>

      {/* Tools */}
      <div className="mt-6 flex gap-4">
        <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
          <Upload size={20} />
          Upload
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>

        <button onClick={addText} className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
          <Type size={20} />
          Add Text
        </button>

        <button onClick={downloadMeme} className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
          <Download size={20} />
          Save & Download
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default Generator;
