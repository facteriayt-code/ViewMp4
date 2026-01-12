
import React, { useState } from 'react';
import { X, Upload, Film, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { Movie, User } from '../types.ts';
import { saveVideoToCloud } from '../services/storageService.ts';

interface UploadModalProps {
  user: User;
  onClose: () => void;
  onUpload: (newMovie: Movie) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ user, onClose, onUpload }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('Sci-Fi');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
      setUploadError("Please provide a title, video file, and thumbnail image.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    
    try {
      const metadata = {
        title,
        description,
        genre,
        year: new Date().getFullYear(),
        rating: 'NR',
        isUserUploaded: true,
        uploaderId: user.id,
        uploaderName: user.name
      };

      const savedMovie = await saveVideoToCloud(metadata, videoFile, thumbnailFile);

      onUpload(savedMovie);
      onClose();
    } catch (err: any) {
      console.error("Upload process failed:", err);
      setUploadError(err.message || "An unexpected error occurred during upload.");
    } finally {
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
          {uploadError && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-start space-x-3 text-red-500 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-xs text-gray-500">
              Authenticated as: <span className="text-white font-bold">{user.name}</span>
            </p>
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
                placeholder="Describe your video..."
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
                    <option>Documentary</option>
                  </select>
               </div>
               <div className="flex flex-col justify-end">
                  <div className="w-full bg-black/20 text-green-500 border border-white/5 rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-center">
                    Ready to Stream
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-4 cursor-pointer hover:border-red-600 transition group h-32 relative overflow-hidden">
                  <Film className={`w-8 h-8 ${videoFile ? 'text-green-500' : 'text-gray-500 group-hover:text-red-500'}`} />
                  <span className="text-[10px] mt-2 font-bold uppercase tracking-widest text-gray-500 text-center truncate w-full px-2">
                    {videoFile ? videoFile.name : 'Choose Video'}
                  </span>
                  <input type="file" accept="video/*" className="hidden" onChange={handleVideoChange} required />
               </label>

               <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-4 cursor-pointer hover:border-red-600 transition group h-32 overflow-hidden">
                  {thumbnailPreview ? (
                    <img src={thumbnailPreview} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-500 group-hover:text-red-500" />
                  )}
                  <span className="relative text-[10px] mt-2 font-bold uppercase tracking-widest text-white">
                    {thumbnailFile ? 'Poster Selected' : 'Choose Poster'}
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
                Processing Upload...
              </>
            ) : (
              'Publish to Community Feed'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
