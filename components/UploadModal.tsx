import React, { useState } from 'react';
import { X, Film, Image as ImageIcon, Loader2, AlertCircle, Cloud, Terminal, Link, FileUp, Save, Code, Copy, CheckCircle2, ShieldAlert, Tag } from 'lucide-react';
import { Movie, User } from '../types.ts';
import { saveVideoToCloud } from '../services/storageService.ts';

interface UploadModalProps {
  user: User;
  onClose: () => void;
  onUpload: (newMovie: Movie) => void;
  movieToEdit?: Movie | null;
}

const CATEGORY_OPTIONS = [
  'Viral',
  'onlyfans',
  'Insta post',
  'Sci-Fi',
  'Action',
  'Adventure',
  'Comedy',
  'Horror'
];

const UploadModal: React.FC<UploadModalProps> = ({ user, onClose, onUpload, movieToEdit }) => {
  const [uploadType, setUploadType] = useState<'file' | 'link'>(movieToEdit?.videoUrl?.includes('supabase.co') ? 'file' : 'link');
  const [title, setTitle] = useState(movieToEdit?.title || '');
  const [description, setDescription] = useState(movieToEdit?.description || '');
  const [genre, setGenre] = useState(movieToEdit?.genre || 'Viral');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState(movieToEdit?.videoUrl || '');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(movieToEdit?.thumbnail || '');
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isEditMode = !!movieToEdit;

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);
    
    try {
      const metadata: Partial<Movie> = {
        id: movieToEdit?.id,
        title,
        description,
        genre,
        uploaderId: user.id,
        uploaderName: user.name,
        videoUrl: uploadType === 'link' ? videoUrl : (movieToEdit?.videoUrl || undefined),
        thumbnail: thumbnailUrl || (movieToEdit?.thumbnail || undefined)
      };

      const savedMovie = await saveVideoToCloud(
        metadata, 
        uploadType === 'file' ? videoFile : null, 
        thumbnailFile,
        setUploadProgress
      );

      onUpload(savedMovie);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const isRlsError = error?.includes('RLS_ERROR');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#181818] w-full max-w-xl min-h-screen sm:min-h-0 sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in slide-in-from-bottom-4 duration-300">
        
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-lg sm:text-xl font-black flex items-center text-white uppercase italic tracking-tighter">
              {isEditMode ? <Save className="w-5 h-5 mr-2 text-blue-500" /> : <Cloud className="w-5 h-5 mr-2 text-red-600" />}
              {isEditMode ? 'Edit Broadcast' : 'Upload Content'}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-5 sm:mx-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col space-y-4">
            <div className="flex items-start space-x-3 text-red-500">
              <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-black uppercase tracking-widest text-[10px]">Database Permission Denied</p>
                <p className="text-xs opacity-90 leading-relaxed">
                  Supabase RLS is blocking this action. You need to configure your Policy correctly.
                </p>
              </div>
            </div>
            
            {isRlsError && (
              <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-4">
                 <div className="space-y-2">
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest flex items-center">
                      <Terminal className="w-3 h-3 mr-1" /> SQL Editor Fix (Easiest)
                    </p>
                    <div className="flex items-center justify-between bg-black/60 p-2 rounded-lg border border-white/5">
                        <code className="text-[10px] text-blue-400 font-mono truncate">create policy "User Management" on movies for all...</code>
                        <button 
                          onClick={() => copyToClipboard(`create policy "User Management" on movies for all using (auth.uid() = uploader_id) with check (auth.uid() = uploader_id);`, 'sql')}
                          className="ml-2 flex items-center space-x-1 bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition text-white shrink-0"
                        >
                          {copiedField === 'sql' ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                          <span className="text-[8px] uppercase font-black">{copiedField === 'sql' ? 'Copied' : 'Copy SQL'}</span>
                        </button>
                    </div>
                 </div>

                 <div className="pt-2 border-t border-white/5 space-y-3">
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Manual GUI Fix (Dashboard Boxes)</p>
                    <div className="space-y-2">
                        <div className="flex flex-col space-y-1">
                            <span className="text-[8px] text-gray-400 uppercase font-black">USING Expression</span>
                            <div className="flex items-center justify-between bg-black/60 p-2 rounded border border-white/5">
                                <code className="text-[10px] text-green-400">auth.uid() = uploader_id</code>
                                <button onClick={() => copyToClipboard('auth.uid() = uploader_id', 'using')} className="text-gray-400 hover:text-white">
                                    {copiedField === 'using' ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <span className="text-[8px] text-gray-400 uppercase font-black">WITH CHECK Expression</span>
                            <div className="flex items-center justify-between bg-black/60 p-2 rounded border border-white/5">
                                <code className="text-[10px] text-green-400">auth.uid() = uploader_id</code>
                                <button onClick={() => copyToClipboard('auth.uid() = uploader_id', 'check')} className="text-gray-400 hover:text-white">
                                    {copiedField === 'check' ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                </button>
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        )}

        {!isEditMode && (
          <div className="flex bg-black/40 p-1 mx-5 mt-5 sm:mx-8 rounded-xl border border-white/5">
             <button onClick={() => setUploadType('file')} className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${uploadType === 'file' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500'}`}>
               <FileUp className="w-4 h-4" /> <span>File</span>
             </button>
             <button onClick={() => setUploadType('link')} className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${uploadType === 'link' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500'}`}>
               <Link className="w-4 h-4" /> <span>Link</span>
             </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none font-bold text-sm" placeholder="Video Title" required />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select 
                    value={genre} 
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-[#252525] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none font-bold text-sm appearance-none"
                  >
                    {CATEGORY_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {uploadType === 'link' && (
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Video URL</label>
                <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none font-bold text-sm" placeholder="https://..." required />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none font-bold text-sm min-h-[80px]" 
                placeholder="Tell us about this video..." 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               {uploadType === 'file' && (
                 <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl p-4 cursor-pointer hover:border-red-600/50 hover:bg-white/5 transition h-32">
                    <Film className={`w-8 h-8 ${videoFile ? 'text-green-500' : 'text-gray-600'}`} />
                    <span className="text-[10px] mt-2 font-black uppercase text-gray-500 truncate w-full text-center px-2">
                      {videoFile ? videoFile.name : 'Video File'}
                    </span>
                    <input type="file" accept="video/*" className="hidden" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
                 </label>
               )}

               <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl p-4 cursor-pointer hover:border-red-600/50 hover:bg-white/5 transition h-32 overflow-hidden">
                  {thumbnailPreview || thumbnailUrl ? (
                    <img src={thumbnailPreview || thumbnailUrl} className="absolute inset-0 w-full h-full object-cover opacity-40" />
                  ) : <ImageIcon className="w-8 h-8 text-gray-600" />}
                  <span className="relative z-10 text-[10px] mt-2 font-black uppercase text-white bg-black/40 px-2 py-1 rounded">Thumbnail</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
               </label>
            </div>
          </div>

          {isUploading && (
            <div className="space-y-2 pt-4">
              <div className="flex justify-between text-[9px] font-black text-red-500 uppercase">
                <span>Uploading</span> <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isUploading}
            className={`w-full text-white font-black py-4 rounded-2xl transition disabled:opacity-50 flex items-center justify-center uppercase tracking-[0.2em] text-xs ${isEditMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditMode ? 'Update' : 'Publish'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;