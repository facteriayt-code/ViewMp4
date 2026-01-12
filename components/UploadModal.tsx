
import React, { useState } from 'react';
import { X, Upload, Film, Image as ImageIcon, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Movie } from '../types.ts';
import { saveVideoToCloud } from '../services/storageService.ts';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (newMovie: Movie) => void;
}

type UploadStep = 'idle' | 'blobs' | 'database' | 'success';

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('Sci-Fi');
  const [isFeatured, setIsFeatured] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [step, setStep] = useState<UploadStep>('idle');

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !videoFile || !thumbnailFile) return;

    setStep('blobs');
    
    try {
      const metadata = {
        title,
        description,
        genre,
        isFeatured,
        year: new Date().getFullYear(),
        rating: 'PG-13',
        isUserUploaded: true
      };

      // Direct Client Upload to Vercel Blob
      const savedMovie = await saveVideoToCloud(metadata, videoFile, thumbnailFile);

      setStep('success');
      setTimeout(() => {
        onUpload(savedMovie);
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      alert("Admin Error: Could not reach Vercel Blob. Please ensure BLOB_READ_WRITE_TOKEN is configured in Vercel Dashboard.");
      setStep('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#181818] w-full max-w-xl my-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-indigo-900/10">
          <h2 className="text-xl font-bold flex items-center text-white">
            <Sparkles className="w-5 h-5 mr-2 text-indigo-500" />
            Admin Content Manager
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {step === 'success' ? (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
            <h3 className="text-2xl font-bold">Published Globally</h3>
            <p className="text-gray-400">Movie is now live on the feed.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Movie Details</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-600 outline-none transition"
                  placeholder="Masterpiece Title"
                  required
                />
              </div>
              
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white h-24 focus:ring-2 focus:ring-indigo-600 outline-none transition resize-none text-sm"
                placeholder="Synopsis..."
              />

              <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-sm font-medium text-gray-300">Feature on Hero Section?</span>
                <button 
                  type="button"
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${isFeatured ? 'bg-indigo-600' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isFeatured ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-4 cursor-pointer hover:border-indigo-600 transition group h-28">
                  <Film className={`w-6 h-6 ${videoFile ? 'text-green-500' : 'text-gray-500 group-hover:text-indigo-500'}`} />
                  <span className="text-[10px] mt-2 font-bold uppercase tracking-widest text-gray-500">
                    {videoFile ? 'Video Selected' : 'Add Movie File'}
                  </span>
                  <input type="file" accept="video/*" className="hidden" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} required />
                </label>

                <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-4 cursor-pointer hover:border-indigo-600 transition group h-28 overflow-hidden">
                  {thumbnailPreview && <img src={thumbnailPreview} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="" />}
                  <ImageIcon className="w-6 h-6 text-gray-500 group-hover:text-indigo-500" />
                  <span className="relative text-[10px] mt-2 font-bold uppercase tracking-widest text-white">
                    {thumbnailFile ? 'Poster Ready' : 'Add Thumbnail'}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} required />
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={step !== 'idle'}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition disabled:opacity-50 flex items-center justify-center shadow-lg active:scale-95"
            >
              {step === 'blobs' ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Streaming to Vercel Blob...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Launch to Global Feed
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-gray-600 uppercase tracking-widest">Client-Side Stream Enabled (Direct-to-Blob)</p>
          </form>
        )}
      </div>
    </div>
  );
};

export default UploadModal;
