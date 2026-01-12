
import React, { useState } from 'react';
import { X, Upload, Film, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Movie } from '../types.ts';
import { saveVideoToCloud } from '../services/storageService.ts';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (newMovie: Movie) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('Sci-Fi');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !videoFile || !thumbnailFile) {
      alert("Please provide at least a title, video, and thumbnail.");
      return;
    }

    setIsUploading(true);
    
    try {
      const metadata = {
        title,
        description,
        genre,
        year: new Date().getFullYear(),
        rating: 'NR',
        isUserUploaded: true
      };

      // Sends real files to Vercel via Fetch Multipart
      const savedMovie = await saveVideoToCloud(metadata, videoFile, thumbnailFile);

      onUpload(savedMovie);
      setIsUploading(false);
      onClose();
    } catch (err: any) {
      console.error(err);
      alert("Upload failed. Make sure your /api/movies/upload route is ready on Vercel.");
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#181818] w-full max-w-xl my-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center text-white">
            <Upload className="w-5 h-5 mr-2 text-red-600" />
            Cloud Publish
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <p className="text-xs text-gray-500">Content will be uploaded to Vercel Blob and shared globally.</p>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Movie Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-600 outline-none transition"
                placeholder="The Future Awakens..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2 text-white h-24 focus:ring-2 focus:ring-red-600 outline-none transition resize-none"
                placeholder="Describe your masterpiece..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Genre</label>
                  <select 
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-600 outline-none transition appearance-none"
                  >
                    <option>Sci-Fi</option>
                    <option>Action</option>
                    <option>Vlog</option>
                    <option>Comedy</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                  <div className="w-full bg-black/20 text-green-500 border border-white/5 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest">
                    Ready to Stream
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-4 cursor-pointer hover:border-red-600 transition group h-32">
                  <Film className={`w-8 h-8 ${videoFile ? 'text-green-500' : 'text-gray-500 group-hover:text-red-500'}`} />
                  <span className="text-[10px] mt-2 font-bold uppercase tracking-widest text-gray-500 text-center">
                    {videoFile ? videoFile.name : 'Choose Video'}
                  </span>
                  <input type="file" accept="video/*" className="hidden" onChange={handleVideoChange} required />
               </label>

               <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-4 cursor-pointer hover:border-red-600 transition group h-32 overflow-hidden">
                  {thumbnailPreview ? (
                    <img src={thumbnailPreview} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-500 group-hover:text-red-500" />
                  )}
                  <span className="relative text-[10px] mt-2 font-bold uppercase tracking-widest text-white shadow-sm">
                    {thumbnailFile ? 'Poster Ready' : 'Choose Poster'}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} required />
               </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isUploading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center shadow-lg active:scale-95"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Streaming to Server...
              </>
            ) : (
              'Publish to Global Feed'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
