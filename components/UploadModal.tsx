
import React, { useState } from 'react';
import { X, Film, Image as ImageIcon, Loader2, AlertCircle, Database, Cloud } from 'lucide-react';
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
  const [genre, setGenre] = useState('Viral');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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
      setUploadError("Missing required fields.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);
    
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

      const savedMovie = await saveVideoToCloud(
        metadata, 
        videoFile, 
        thumbnailFile,
        (progress) => setUploadProgress(progress)
      );

      onUpload(savedMovie);
      onClose();
    } catch (err: any) {
      setUploadError(err.message || "Upload failed. Please ensure 'videos' and 'thumbnails' buckets exist in Supabase Storage and are set to Public.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#181818] w-full max-w-xl my-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center text-white uppercase italic">
            <Cloud className="w-5 h-5 mr-2 text-red-600" />
            Supabase Cloud Upload
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
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                Uploader: <span className="text-white font-bold">{user.name}</span>
              </p>
              <div className="bg-red-600/10 text-red-500 px-2 py-0.5 rounded text-[10px] font-bold border border-red-600/20">
                SUPABASE STORAGE
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Movie Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-600 outline-none transition"
                placeholder="Ex: My Awesome Clip"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                  <select 
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-600 outline-none transition appearance-none"
                  >
                    <option value="Viral">Viral</option>
                    <option value="Insta post">Insta post</option>
                    <option value="Onlyfans">Onlyfans</option>
                    <option value="Action">Action</option>
                  </select>
               </div>
               <div className="flex flex-col justify-end">
                  <div className="w-full bg-red-600/10 text-red-400 border border-red-600/20 rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-center">
                    Auto-Optimized
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-4 cursor-pointer hover:border-red-600 transition group h-32 relative overflow-hidden">
                  <Film className={`w-8 h-8 ${videoFile ? 'text-red-500' : 'text-gray-500 group-hover:text-red-500'}`} />
                  <span className="text-[10px] mt-2 font-bold uppercase tracking-widest text-gray-500 text-center truncate w-full px-2">
                    {videoFile ? videoFile.name : 'Select Video'}
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
                    {thumbnailFile ? 'Poster Ready' : 'Select Thumbnail'}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} required />
               </label>
            </div>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Streaming to Supabase</span>
                <span>{uploadProgress > 0 ? 'Processing...' : 'Starting...'}</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-red-600 animate-pulse transition-all duration-300 w-full"
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isUploading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-lg transition disabled:opacity-50 flex flex-col items-center justify-center shadow-lg active:scale-95 uppercase tracking-widest"
          >
            {isUploading ? (
              <div className="flex items-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                <span>Uploading to Cloud...</span>
              </div>
            ) : (
              'Start Upload'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
