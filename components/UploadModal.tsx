
import React, { useState } from 'react';
import { X, Film, Image as ImageIcon, Loader2, AlertCircle, Database, Cloud, Terminal } from 'lucide-react';
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#181818] w-full max-w-xl my-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-black flex items-center text-white uppercase italic tracking-tighter">
              <Cloud className="w-6 h-6 mr-2 text-red-600" />
              Upload to Cloud
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Supabase Realtime Network</p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowSetup(!showSetup)}
              className="p-2 text-gray-500 hover:text-white transition"
              title="Fix View Counting"
            >
              <Terminal className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Diagnostics Setup Panel */}
        {showSetup && (
          <div className="bg-blue-600/10 border-b border-white/10 p-6 space-y-4 animate-in slide-in-from-top duration-300">
            <div className="flex items-center space-x-2 text-blue-400 font-black uppercase text-[10px] tracking-widest">
              <Database className="w-4 h-4" />
              <span>Real-time View Logic Setup</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Copy and paste this into your <strong>Supabase SQL Editor</strong> to enable real-time view counts:
            </p>
            <div className="relative">
              <pre className="bg-black/60 p-4 rounded-xl text-[10px] text-blue-300 overflow-x-auto border border-blue-500/20 font-mono">
{`create or replace function increment_views(movie_id uuid)
returns void as $$
begin
  update movies set views = views + 1
  where id = movie_id;
end;
$$ language plpgsql security definer;

alter publication supabase_realtime add table movies;`}
              </pre>
            </div>
            <button 
              onClick={() => setShowSetup(false)}
              className="text-[10px] font-black text-blue-400 hover:text-white uppercase tracking-widest"
            >
              I've done this, close help
            </button>
          </div>
        )}

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {uploadError && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-start space-x-3 text-red-500 text-sm animate-in shake duration-300">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-black uppercase tracking-widest">Network Error</p>
                <p className="opacity-80 leading-snug">{uploadError}</p>
              </div>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Video Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none transition placeholder:text-gray-700 font-bold"
                placeholder="Ex: My Viral Masterpiece"
                required
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Channel / Category</label>
              <select 
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none transition font-bold"
              >
                <option value="Viral">Viral</option>
                <option value="Insta post">Insta post</option>
                <option value="Action">Action</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl p-6 cursor-pointer hover:border-red-600/50 hover:bg-white/5 transition group h-40">
                  <Film className={`w-10 h-10 transition-colors ${videoFile ? 'text-green-500' : 'text-gray-600 group-hover:text-red-500'}`} />
                  <span className="text-[10px] mt-3 font-black uppercase tracking-tighter text-gray-500 text-center px-2 truncate w-full">
                    {videoFile ? videoFile.name : 'Choose Video'}
                  </span>
                  <input type="file" accept="video/*" className="hidden" onChange={handleVideoChange} required />
               </label>

               <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl p-6 cursor-pointer hover:border-red-600/50 hover:bg-white/5 transition group h-40 overflow-hidden">
                  {thumbnailPreview ? (
                    <img src={thumbnailPreview} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-gray-600 group-hover:text-red-500" />
                  )}
                  <span className="relative z-10 text-[10px] mt-3 font-black uppercase tracking-tighter text-white bg-black/40 px-2 py-1 rounded">
                    {thumbnailFile ? 'Thumbnail Set' : 'Choose Cover'}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} required />
               </label>
            </div>
          </div>

          {isUploading && (
            <div className="space-y-3 animate-in fade-in duration-300">
              <div className="flex justify-between text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">
                <span>Transmitting</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-600 transition-all duration-300 shadow-[0_0_10px_rgba(229,9,20,0.5)]"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isUploading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-2xl transition disabled:opacity-50 flex items-center justify-center shadow-xl active:scale-[0.98] uppercase tracking-[0.2em] text-sm"
          >
            {isUploading ? (
              <div className="flex items-center">
                <Loader2 className="w-5 h-5 animate-spin mr-3" />
                Processing...
              </div>
            ) : 'Push to Cloud'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
