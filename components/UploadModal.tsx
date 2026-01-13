
import React, { useState } from 'react';
import { X, Film, Image as ImageIcon, Loader2, AlertCircle, Database, Cloud, ExternalLink, RefreshCw, Terminal } from 'lucide-react';
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
  const [showSetup, setShowSetup] = useState(false);

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
      setUploadError("Please select both a video and a thumbnail.");
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
      setUploadError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#181818] w-full max-w-xl my-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold flex items-center text-white uppercase italic">
              <Cloud className="w-5 h-5 mr-2 text-red-600" />
              Cloud Stream Upload
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Supabase Realtime Platform</p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowSetup(!showSetup)}
              className="p-2 text-gray-400 hover:text-white transition"
              title="Database Setup Help"
            >
              <Terminal className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {showSetup && (
          <div className="bg-blue-600/10 border-b border-white/10 p-6 space-y-4 animate-in slide-in-from-top duration-300">
            <div className="flex items-center space-x-2 text-blue-400 font-bold uppercase text-[10px] tracking-widest">
              <Database className="w-4 h-4" />
              <span>Real-time View Counting Fix</span>
            </div>
            <p className="text-xs text-gray-300">Run this SQL in your Supabase SQL Editor to enable view counting:</p>
            <pre className="bg-black/40 p-3 rounded-lg text-[9px] text-blue-200 overflow-x-auto border border-blue-500/20">
{`create or replace function increment_views(movie_id uuid)
returns void as $$
begin
  update movies set views = views + 1
  where id = movie_id;
end;
$$ language plpgsql security definer;

alter publication supabase_realtime add table movies;`}
            </pre>
            <button 
              onClick={() => setShowSetup(false)}
              className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest"
            >
              Close Setup Guide
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {uploadError && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl space-y-3 text-red-500 text-sm">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1 flex-1">
                  <p className="font-bold">Sync Error</p>
                  <p className="opacity-90 leading-relaxed">{uploadError}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Movie Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-600 outline-none transition placeholder:text-gray-600"
                placeholder="Name your video..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
              <select 
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-600 outline-none transition"
              >
                <option value="Viral">Viral</option>
                <option value="Insta post">Insta post</option>
                <option value="Action">Action</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-4 cursor-pointer hover:border-red-600 transition group h-32">
                  <Film className={`w-8 h-8 ${videoFile ? 'text-red-500' : 'text-gray-500 group-hover:text-red-500'}`} />
                  <span className="text-[10px] mt-2 font-bold uppercase tracking-widest text-gray-500">
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
                <span>Transmitting</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-red-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isUploading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center shadow-lg active:scale-95 uppercase tracking-widest"
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start Upload'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
