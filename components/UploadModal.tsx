import React, { useState, useRef } from 'react';
import { X, Film, Image as ImageIcon, Loader2, Cloud, Terminal, Link, FileUp, Save, Copy, CheckCircle2, ShieldAlert, Tag, Plus, Trash2, ListFilter, ExternalLink, Sparkles, RefreshCw } from 'lucide-react';
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

interface LinkEntry {
  title: string;
  url: string;
}

const UploadModal: React.FC<UploadModalProps> = ({ user, onClose, onUpload, movieToEdit }) => {
  const isEditMode = !!movieToEdit;
  const [uploadType, setUploadType] = useState<'file' | 'link'>(movieToEdit?.videoUrl?.includes('supabase.co') ? 'file' : 'link');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkText, setBulkText] = useState('');
  
  const [title, setTitle] = useState(movieToEdit?.title || '');
  const [description, setDescription] = useState(movieToEdit?.description || '');
  const [genre, setGenre] = useState(movieToEdit?.genre || 'Viral');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(movieToEdit?.thumbnail || '');
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  
  const [linkEntries, setLinkEntries] = useState<LinkEntry[]>([
    { title: movieToEdit?.title || '', url: movieToEdit?.videoUrl || '' }
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const generateThumbnail = (file: File) => {
    setIsGeneratingThumbnail(true);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      // Seek to 1 second or half of duration if video is shorter
      const seekTime = Math.min(1, video.duration / 2);
      video.currentTime = seekTime;
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const thumbnailFile = new File([blob], 'auto-thumbnail.jpg', { type: 'image/jpeg' });
            setThumbnailFile(thumbnailFile);
            setThumbnailPreview(URL.createObjectURL(blob));
          }
          setIsGeneratingThumbnail(false);
          // Cleanup
          URL.revokeObjectURL(video.src);
        }, 'image/jpeg', 0.85);
      } else {
        setIsGeneratingThumbnail(false);
      }
    };

    video.onerror = () => {
      console.error("Error generating thumbnail");
      setIsGeneratingThumbnail(false);
    };
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      // Auto-populate title if empty
      if (!title) {
        const cleanTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setTitle(cleanTitle);
      }
      generateThumbnail(file);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBulkImport = () => {
    const lines = bulkText.split('\n').filter(line => line.trim());
    const newEntries: LinkEntry[] = lines.map(line => {
      const parts = line.split('|');
      if (parts.length >= 2) {
        return { title: parts[0].trim(), url: parts[1].trim() };
      }
      return { title: `Video ${Date.now()}`, url: line.trim() };
    });
    
    if (newEntries.length > 0) {
      setLinkEntries(newEntries);
      setShowBulkImport(false);
      setBulkText('');
    }
  };

  const addLinkEntry = () => {
    setLinkEntries([...linkEntries, { title: '', url: '' }]);
  };

  const removeLinkEntry = (index: number) => {
    if (linkEntries.length <= 1) return;
    const newEntries = [...linkEntries];
    newEntries.splice(index, 1);
    setLinkEntries(newEntries);
  };

  const updateLinkEntry = (index: number, field: keyof LinkEntry, value: string) => {
    const newEntries = [...linkEntries];
    newEntries[index][field] = value;
    setLinkEntries(newEntries);
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
    setUploadProgress(0);
    
    try {
      if (uploadType === 'file') {
        const metadata: Partial<Movie> = {
          id: movieToEdit?.id,
          title,
          description,
          genre,
          uploaderId: user.id,
          uploaderName: user.name,
          thumbnail: thumbnailUrl || (movieToEdit?.thumbnail || undefined)
        };

        const savedMovie = await saveVideoToCloud(metadata, videoFile, thumbnailFile, setUploadProgress);
        onUpload(savedMovie);
      } else {
        const total = linkEntries.length;
        for (let i = 0; i < total; i++) {
          const entry = linkEntries[i];
          if (!entry.url || !entry.title) continue;

          const metadata: Partial<Movie> = {
            id: i === 0 ? movieToEdit?.id : undefined,
            title: entry.title,
            description,
            genre,
            uploaderId: user.id,
            uploaderName: user.name,
            videoUrl: entry.url,
            thumbnail: thumbnailUrl || (movieToEdit?.thumbnail || undefined)
          };

          const savedMovie = await saveVideoToCloud(
            metadata, 
            null, 
            i === 0 ? thumbnailFile : null,
            (p) => setUploadProgress(Math.round(((i / total) * 100) + (p / total)))
          );
          
          if (i === 0 && savedMovie.thumbnail) setThumbnailUrl(savedMovie.thumbnail);
          onUpload(savedMovie);
        }
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const fullSqlFix = `-- 1. Table Permissions
alter table movies enable row level security;
drop policy if exists "Public Select" on movies;
drop policy if exists "User Management" on movies;
create policy "Public Select" on movies for select using (true);
create policy "User Management" on movies for all using (auth.uid() = uploader_id) with check (auth.uid() = uploader_id);

-- 2. View Counter Function
create or replace function increment_views(movie_id uuid) returns void as $$ 
begin 
  update movies set views = views + 1 where id = movie_id; 
end; 
$$ language plpgsql security definer;

-- 3. Storage Permissions
insert into storage.buckets (id, name, public) 
values ('videos', 'videos', true), ('thumbnails', 'thumbnails', true)
on conflict (id) do update set public = true;

create policy "Public Storage Access" on storage.objects for select using (bucket_id in ('videos', 'thumbnails'));
create policy "Authenticated Storage Insert" on storage.objects for insert with check (bucket_id in ('videos', 'thumbnails') AND auth.role() = 'authenticated');
create policy "Authenticated Storage Update" on storage.objects for update using (bucket_id in ('videos', 'thumbnails') AND auth.role() = 'authenticated');
create policy "Authenticated Storage Delete" on storage.objects for delete using (bucket_id in ('videos', 'thumbnails') AND auth.role() = 'authenticated');`;

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
          <div className="mx-5 mt-5 sm:mx-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col space-y-4 animate-in shake-in">
            <div className="flex items-start space-x-3 text-red-500">
              <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" />
              <div className="space-y-1 text-left flex-1">
                <p className="font-black uppercase tracking-widest text-[10px]">Permission Denied (RLS)</p>
                <p className="text-xs opacity-90 leading-relaxed font-bold">
                  Supabase RLS is blocking this operation. Follow the 1-minute fix below to unlock your app:
                </p>
              </div>
            </div>
            
            <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-4">
                 <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest flex items-center">
                        <Terminal className="w-3 h-3 mr-1" /> Steps to Fix:
                      </p>
                      <a href="https://supabase.com/dashboard/project/_/editor" target="_blank" className="text-[9px] text-blue-500 hover:underline flex items-center font-black">
                        Open SQL Editor <ExternalLink className="w-2.5 h-2.5 ml-1" />
                      </a>
                    </div>
                    
                    <ol className="text-[10px] text-gray-500 space-y-2 list-decimal ml-4">
                      <li>Copy the script below.</li>
                      <li>Go to your Supabase Dashboard &rarr; SQL Editor.</li>
                      <li>Paste and click <span className="text-white font-bold">RUN</span>.</li>
                    </ol>

                    <div className="bg-black/60 p-3 rounded-lg border border-white/5 relative group">
                        <pre className="text-[9px] text-blue-400 font-mono whitespace-pre-wrap break-all max-h-32 overflow-y-auto custom-scrollbar">
                          {fullSqlFix}
                        </pre>
                        <button 
                          onClick={() => copyToClipboard(fullSqlFix, 'fullsql')}
                          className="absolute top-2 right-2 flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition text-white shadow-lg active:scale-95"
                        >
                          {copiedField === 'fullsql' ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span className="text-[8px] uppercase font-black">{copiedField === 'fullsql' ? 'Copied!' : 'Copy Fix Script'}</span>
                        </button>
                    </div>
                 </div>
              </div>
          </div>
        )}

        {!isEditMode && (
          <div className="flex bg-black/40 p-1 mx-5 mt-5 sm:mx-8 rounded-xl border border-white/5">
             <button onClick={() => setUploadType('file')} className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${uploadType === 'file' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500'}`}>
               <FileUp className="w-4 h-4" /> <span>File</span>
             </button>
             <button onClick={() => setUploadType('link')} className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${uploadType === 'link' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500'}`}>
               <Link className="w-4 h-4" /> <span>Link(s)</span>
             </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-4">
          <div className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {uploadType === 'file' && (
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none font-bold text-sm" placeholder="Video Title" required={uploadType === 'file'} />
                </div>
              )}
              
              <div className={uploadType === 'link' ? 'sm:col-span-2' : ''}>
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
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Video Links</label>
                  {!isEditMode && (
                    <div className="flex items-center space-x-3">
                      <button 
                        type="button" 
                        onClick={() => setShowBulkImport(!showBulkImport)}
                        className="text-[10px] flex items-center space-x-1 text-blue-500 hover:text-blue-400 font-black uppercase tracking-widest transition"
                      >
                        <ListFilter className="w-3 h-3" /> <span>Bulk Import</span>
                      </button>
                      <button 
                        type="button" 
                        onClick={addLinkEntry}
                        className="text-[10px] flex items-center space-x-1 text-red-500 hover:text-red-400 font-black uppercase tracking-widest transition"
                      >
                        <Plus className="w-3 h-3" /> <span>Add Link</span>
                      </button>
                    </div>
                  )}
                </div>

                {showBulkImport ? (
                  <div className="bg-blue-600/5 border border-blue-500/20 p-4 rounded-2xl space-y-3 animate-in fade-in zoom-in-95">
                    <p className="text-[9px] font-black text-blue-500 uppercase">Bulk Import (Title | URL)</p>
                    <textarea 
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white font-mono min-h-[100px] outline-none"
                      placeholder="My Video 1 | https://url1.com&#10;My Video 2 | https://url2.com"
                    />
                    <div className="flex justify-end space-x-2">
                      <button type="button" onClick={() => setShowBulkImport(false)} className="text-[10px] font-black uppercase text-gray-500 px-3 py-1">Cancel</button>
                      <button type="button" onClick={handleBulkImport} className="text-[10px] font-black uppercase bg-blue-600 text-white px-3 py-1 rounded-lg">Import</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {linkEntries.map((entry, index) => (
                      <div key={index} className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-3 relative group/entry">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="text" 
                            value={entry.title} 
                            onChange={(e) => updateLinkEntry(index, 'title', e.target.value)} 
                            className="flex-1 bg-[#181818] border border-white/5 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-red-600 outline-none font-bold text-xs" 
                            placeholder={`Video Title #${index + 1}`} 
                            required 
                          />
                          {linkEntries.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => removeLinkEntry(index)}
                              className="p-2 text-gray-600 hover:text-red-500 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <input 
                          type="url" 
                          value={entry.url} 
                          onChange={(e) => updateLinkEntry(index, 'url', e.target.value)} 
                          className="w-full bg-[#181818] border border-white/5 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-red-600 outline-none font-bold text-xs" 
                          placeholder="https://..." 
                          required 
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Description (Optional)</label>
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
                      {videoFile ? videoFile.name : 'Select Video'}
                    </span>
                    <input type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
                 </label>
               )}

               <label className={`relative flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl p-4 cursor-pointer hover:border-red-600/50 hover:bg-white/5 transition h-32 overflow-hidden ${uploadType === 'link' ? 'col-span-2' : ''}`}>
                  {(thumbnailPreview || thumbnailUrl) && !isGeneratingThumbnail ? (
                    <img src={thumbnailPreview || thumbnailUrl} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition" />
                  ) : isGeneratingThumbnail ? (
                    <div className="flex flex-col items-center justify-center">
                       <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                       <span className="text-[8px] font-black uppercase text-gray-500 mt-2">AI Framing...</span>
                    </div>
                  ) : <ImageIcon className="w-8 h-8 text-gray-600" />}
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase text-white bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm flex items-center">
                      {isGeneratingThumbnail ? 'Generating' : 'Thumbnail'}
                      {!isGeneratingThumbnail && thumbnailPreview && <Sparkles className="w-2.5 h-2.5 ml-1 text-yellow-400" />}
                    </span>
                    {videoFile && !isGeneratingThumbnail && (
                      <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); generateThumbnail(videoFile); }}
                        className="mt-2 text-[8px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 flex items-center bg-black/40 px-2 py-1 rounded transition"
                      >
                        <RefreshCw className="w-2 h-2 mr-1" /> Re-capture
                      </button>
                    )}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
               </label>
            </div>
          </div>

          {isUploading && (
            <div className="space-y-2 pt-4">
              <div className="flex justify-between text-[9px] font-black text-red-500 uppercase">
                <span>{uploadType === 'link' ? 'Publishing Batch' : 'Uploading'}</span> <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isUploading || isGeneratingThumbnail}
            className={`w-full text-white font-black py-4 rounded-2xl transition disabled:opacity-50 flex items-center justify-center uppercase tracking-[0.2em] text-xs ${isEditMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isEditMode ? (
              'Update Broadcast'
            ) : (
              uploadType === 'link' && linkEntries.length > 1 ? `Publish ${linkEntries.length} Videos` : 'Publish content'
            )}
          </button>
        </form>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(229, 9, 20, 0.3);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default UploadModal;