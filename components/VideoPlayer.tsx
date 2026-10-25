import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, ShieldCheck, Film, Sparkles, Tv, Play, ChevronLeft, ChevronRight, Layers,
  AlertTriangle, RefreshCw, X, Check, MessageSquare, Maximize2, Minimize2, ChevronDown,
  Globe, Radio, CheckCircle2, Info, ExternalLink, Headphones, Settings, Volume2, Download
} from 'lucide-react';
import { Movie } from '../types.ts';
import { incrementMovieView } from '../services/storageService.ts';
import { saveContinueWatching } from '../services/continueWatchingService.ts';
import { 
  getMovieStreamServers, 
  getMovieTmdbId, 
  getMovieImdbId,
  getMovieAnilistId,
  isTvOrSeries,
  isIndianContent,
  getStreamRipUrl,
  StreamServer 
} from '../services/streamService.ts';
import { ReportIssueModal } from './ReportIssueModal.tsx';
import { StreamFixResult } from '../services/streamFixService.ts';
import { AdGuardDnsModal } from './AdGuardDnsModal.tsx';
import {
  fetchMediaInfo,
  fetchStreamLink,
  StreamTrack,
  getStreamApiBaseUrl,
  setStreamApiBaseUrl
} from '../services/streamApiProvider.ts';
import Hls from 'hls.js';

interface VideoPlayerProps {
  movie: Movie;
  onClose: () => void;
  onOpenChat?: () => void;
  onOpenGoogleChat?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  movie, 
  onClose,
  onOpenChat,
  onOpenGoogleChat
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [season, setSeason] = useState<number>(movie.initialSeason || 1);
  const [episode, setEpisode] = useState<number>(movie.initialEpisode || 1);

  // Check if detected as series or user toggled series mode
  const detectedIsSeries = isTvOrSeries(movie) || !!movie.isTv || !!movie.initialSeason;
  const [forceSeriesMode, setForceSeriesMode] = useState<boolean>(detectedIsSeries);

  const [servers, setServers] = useState<StreamServer[]>(() => 
    getMovieStreamServers(movie, movie.initialSeason || 1, movie.initialEpisode || 1)
  );
  
  // Default to top priority server in list (Filmu Hindi 4K or AutoEmbed VIP)
  const [activeServerId, setActiveServerId] = useState<string>(() => {
    const list = getMovieStreamServers(movie, movie.initialSeason || 1, movie.initialEpisode || 1);
    return list[0]?.id || 'filmu-primary';
  });

  const lastMovieIdRef = useRef<string>(movie.id);
  
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showEpisodesModal, setShowEpisodesModal] = useState<boolean>(false);
  const [showServerModal, setShowServerModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showAdGuardModal, setShowAdGuardModal] = useState<boolean>(false);
  const [failoverNotice, setFailoverNotice] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);
  const [streamSlow, setStreamSlow] = useState<boolean>(false);

  // 8Stream / Multi-Audio HLS State
  const [audioTracks, setAudioTracks] = useState<StreamTrack[]>([]);
  const [selectedAudioLang, setSelectedAudioLang] = useState<string>('Hindi');
  const [streamApiKey, setStreamApiKey] = useState<string>('');
  const [hlsStreamUrl, setHlsStreamUrl] = useState<string | null>(null);
  const [isResolvingStream, setIsResolvingStream] = useState<boolean>(false);
  const [showVercelConfigModal, setShowVercelConfigModal] = useState<boolean>(false);
  const [vercelUrlInput, setVercelUrlInput] = useState<string>(() => getStreamApiBaseUrl());
  const [vercelTestStatus, setVercelTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [vercelTestMessage, setVercelTestMessage] = useState<string>('');
  const [showAudioMenu, setShowAudioMenu] = useState<boolean>(false);
  
  // Default server category tab: 'all' so users immediately see all active servers
  const isIndian = useMemo(() => isIndianContent(movie), [movie]);
  const [serverCategoryTab, setServerCategoryTab] = useState<'all' | 'hindi' | 'global'>('all');

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset auto-hide controls timer
  const resetControlsTimer = () => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      // Auto-hide controls only when no modal is open
      if (!showServerModal && !showEpisodesModal && !showReportModal && !showAdGuardModal) {
        setControlsVisible(false);
      }
    }, 4500);
  };

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [showServerModal, showEpisodesModal, showReportModal, showAdGuardModal]);

  // Clean up any legacy popup blocking keys to avoid browser issues
  useEffect(() => {
    try {
      localStorage.removeItem('geministream_block_popups');
    } catch {}
  }, []);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const tmdbId = getMovieTmdbId(movie);
  const anilistId = getMovieAnilistId(movie);
  const isSeries = detectedIsSeries || forceSeriesMode;

  const handleFixApplied = (result: StreamFixResult) => {
    // Instantly re-fetch stream servers with the new fix applied
    const updatedList = getMovieStreamServers(movie, season, episode);
    setServers(updatedList);
    setActiveServerId(result.preferredServerId);
    setIframeKey(k => k + 1);
    setIsLoading(true);
    setFailoverNotice(`Stream Fixed! Switched to ${result.preferredServerName}`);
    setTimeout(() => setFailoverNotice(null), 5000);
  };

  // Update servers when movie, season or episode changes
  useEffect(() => {
    const list = getMovieStreamServers(movie, season, episode);
    setServers(list);
    
    // When switching to a different movie, prioritize the top server
    if (lastMovieIdRef.current !== movie.id) {
      lastMovieIdRef.current = movie.id;
      setActiveServerId(list[0]?.id || 'filmu-primary');
    } else {
      // If same movie (e.g. season or episode changed), preserve user's server if still valid
      setActiveServerId(prev => {
        const exists = list.some(s => s.id === prev);
        return exists ? prev : (list[0]?.id || 'filmu-primary');
      });
    }
    
    setIframeKey(k => k + 1);
    setIsLoading(true);

    if (movie.id) {
      incrementMovieView(movie.id);
      saveContinueWatching(movie, 25, isSeries ? season : undefined, isSeries ? episode : undefined);
    }
  }, [movie, season, episode, isSeries]);

  // Track progress while watching
  useEffect(() => {
    let currentProgress = 25;
    const progressTimer = setInterval(() => {
      currentProgress = Math.min(95, currentProgress + 10);
      saveContinueWatching(movie, currentProgress, isSeries ? season : undefined, isSeries ? episode : undefined);
    }, 15000);
    return () => clearInterval(progressTimer);
  }, [movie, season, episode, isSeries]);

  // Fast auto-clear for loading state and slow stream detection
  useEffect(() => {
    setIsLoading(true);
    setStreamSlow(false);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    const slowTimer = setTimeout(() => {
      setStreamSlow(true);
    }, 5000);
    return () => {
      clearTimeout(timer);
      clearTimeout(slowTimer);
    };
  }, [activeServerId, iframeKey]);

  const activeServer = servers.find(s => s.id === activeServerId) || servers[0];
  const activeServerIndex = servers.findIndex(s => s.id === activeServer.id);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Resolve 8Stream / Multi-Audio HLS stream
  useEffect(() => {
    if (activeServer.id !== 'streamapi-hls') return;

    let isMounted = true;
    setIsResolvingStream(true);
    setIsLoading(true);

    const imdbId = getMovieImdbId(movie) || 'tt1877830';

    fetchMediaInfo(imdbId)
      .then(async (info) => {
        if (!isMounted) return;
        if (info.success && info.data && Array.isArray(info.data.playlist) && info.data.playlist.length > 0 && info.data.key) {
          const tracks = info.data.playlist;
          setAudioTracks(tracks);
          setStreamApiKey(info.data.key);

          // Find track matching selectedAudioLang or fallback to first track
          const matched = tracks.find(t => t.title?.toLowerCase().includes(selectedAudioLang.toLowerCase())) || tracks[0];
          setSelectedAudioLang(matched.title || 'Hindi');

          // POST /api/v1/getStream with { file, key }
          const streamRes = await fetchStreamLink(matched.file, info.data.key);
          if (!isMounted) return;
          if (streamRes.success && streamRes.data?.link) {
            setHlsStreamUrl(streamRes.data.link);
            setIsLoading(false);
          } else {
            setFailoverNotice(streamRes.message || 'Stream link unavailable');
            setIsLoading(false);
          }
        } else {
          setFailoverNotice(info.message || 'Could not load media info from Stream API');
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('[StreamAPI] Error:', err);
        setFailoverNotice('Stream API connection error');
        setIsLoading(false);
      })
      .finally(() => {
        if (isMounted) setIsResolvingStream(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeServer.id, movie.id, season, episode, iframeKey]);

  const handleSelectAudioLang = async (track: StreamTrack) => {
    setSelectedAudioLang(track.title);
    setShowAudioMenu(false);
    if (!streamApiKey || !track.file) return;

    setIsLoading(true);
    setFailoverNotice(`Switching audio to ${track.title}...`);
    try {
      const res = await fetchStreamLink(track.file, streamApiKey);
      if (res.success && res.data?.link) {
        setHlsStreamUrl(res.data.link);
        setFailoverNotice(`Audio switched to ${track.title}`);
        setTimeout(() => setFailoverNotice(null), 3000);
      } else {
        setFailoverNotice(`Could not load ${track.title} stream`);
        setTimeout(() => setFailoverNotice(null), 3500);
      }
    } catch (e: any) {
      setFailoverNotice(`Error loading ${track.title}`);
      setTimeout(() => setFailoverNotice(null), 3500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestVercelUrl = async () => {
    setVercelTestStatus('testing');
    setVercelTestMessage('Testing connection to Stream API...');
    try {
      const urlToTest = vercelUrlInput.trim().replace(/\/+$/, '');
      const testUrl = urlToTest 
        ? (urlToTest.includes('/api/v1') ? `${urlToTest}/mediaInfo?id=tt1877830` : `${urlToTest}/api/v1/mediaInfo?id=tt1877830`)
        : '/api/v1/mediaInfo?id=tt1877830';

      const res = await fetch(testUrl);
      const data = await res.json();
      if (data.success && data.data?.playlist) {
        setVercelTestStatus('success');
        const languages = data.data.playlist.map((t: any) => t.title).join(', ');
        setVercelTestMessage(`Connected successfully! Found tracks: ${languages}`);
      } else {
        setVercelTestStatus('error');
        setVercelTestMessage(data.message || 'API responded but data format was invalid');
      }
    } catch (e: any) {
      setVercelTestStatus('error');
      setVercelTestMessage(`Connection failed: ${e.message}`);
    }
  };

  const handleSaveVercelUrl = () => {
    setStreamApiBaseUrl(vercelUrlInput.trim());
    setShowVercelConfigModal(false);
    setFailoverNotice('Stream API URL saved!');
    setTimeout(() => setFailoverNotice(null), 3500);
    // Refresh active server
    setIframeKey(k => k + 1);
  };

  // Attach high-performance HLS player for .m3u8 direct streams
  useEffect(() => {
    if (activeServer.type !== 'video' || !videoRef.current) return;
    const video = videoRef.current;
    const url = activeServer.id === 'streamapi-hls' ? hlsStreamUrl : activeServer.url;

    if (!url) return;

    if (url.includes('.m3u8') || url.includes('/stream') || url.includes('/playlist') || url.includes('friness-cherlormur')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false, // Disabled for movies/VOD to enable deep forward buffer
          backBufferLength: 90, // Keep 90s behind in memory for instantaneous rewinding
          maxBufferLength: 60, // Keep 60s ahead in buffer
          maxMaxBufferLength: 180, // Allow up to 3 minutes ahead on fast broadband
          maxBufferSize: 120 * 1024 * 1024, // 120MB buffer limit
          maxBufferHole: 0.5,
          highBufferWatchdogPeriod: 2,
          nudgeOffset: 0.1,
          nudgeMaxRetry: 5,
          fragLoadingTimeOut: 20000,
          fragLoadingMaxRetry: 6,
          fragLoadingRetryDelay: 500,
          manifestLoadingTimeOut: 15000,
          levelLoadingTimeOut: 15000,
          startLevel: -1, // Auto quality selection
          abrEwmaDefaultEstimate: 10000000, // 10 Mbps initial estimate for fast broadband (crisp HD immediately)
          autoStartLoad: true,
          testBandwidth: true,
          progressive: true,
        });

        hls.loadSource(url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          setStreamSlow(false);
          video.play().catch(() => {});
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.warn('[HLS] Network error encountered, auto-recovering buffer...', data.details);
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.warn('[HLS] Media decoding glitch, auto-recovering media error...', data.details);
                hls.recoverMediaError();
                break;
              default:
                console.warn('[HLS] Non-recoverable stream error:', data);
                hls.destroy();
                break;
            }
          }
        });

        return () => {
          hls.destroy();
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        setIsLoading(false);
      }
    } else {
      video.src = url;
    }
  }, [activeServer.url, activeServer.type, activeServer.id, hlsStreamUrl, iframeKey]);

  // Group servers into Hindi vs Global
  const hindiServers = useMemo(() => servers.filter(s => s.isHindi), [servers]);
  const globalServers = useMemo(() => servers.filter(s => !s.isHindi), [servers]);

  const handleSelectServer = (serverId: string) => {
    if (serverId !== activeServerId) {
      setActiveServerId(serverId);
      setIframeKey(k => k + 1);
      setIsLoading(true);
      setShowServerModal(false);
      const target = servers.find(s => s.id === serverId);
      if (target) {
        setFailoverNotice(`Switched to ${target.name}`);
        setTimeout(() => setFailoverNotice(null), 3500);
      }
    } else {
      setShowServerModal(false);
    }
  };

  const handleNextServer = () => {
    if (servers.length <= 1) return;
    const nextIdx = (activeServerIndex + 1) % servers.length;
    const target = servers[nextIdx];
    handleSelectServer(target.id);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(console.error);
    } else {
      document.exitFullscreen?.().catch(console.error);
    }
  };

  // Keyboard controls (Esc to close, F to fullscreen, N for next server)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      resetControlsTimer();
      if (e.key === 'Escape') {
        if (!document.fullscreenElement) {
          onClose();
        }
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'n' || e.key === 'N') {
        handleNextServer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, activeServerIndex, servers]);

  const handlePrevEpisode = () => {
    if (episode > 1) {
      setEpisode(prev => prev - 1);
    } else if (season > 1) {
      setSeason(prev => prev - 1);
      setEpisode(1);
    }
  };

  const handleNextEpisode = () => {
    setEpisode(prev => prev + 1);
  };

  // Modals visibility check
  const anyModalOpen = showServerModal || showEpisodesModal || showReportModal || showAdGuardModal || showVercelConfigModal;

  return (
    <div 
      ref={containerRef}
      onMouseMove={resetControlsTimer}
      onClick={resetControlsTimer}
      onTouchStart={resetControlsTimer}
      className="fixed inset-0 z-[200] bg-black text-white flex flex-col items-center justify-between select-none overflow-hidden animate-in fade-in duration-300"
    >
      {/* Toast Alert for server switches */}
      {failoverNotice && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[80] bg-amber-500 text-black px-4 py-1.5 rounded-full font-black text-xs shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 border border-amber-400">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-black fill-black" />
          <span>{failoverNotice}</span>
        </div>
      )}

      {/* 1. SIMPLIFIED SLEEK TOP HEADER */}
      <header 
        className={`w-full bg-gradient-to-b from-black/95 via-black/85 to-transparent px-3 sm:px-6 py-2.5 sm:py-3 z-50 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 backdrop-blur-sm ${
          controlsVisible || anyModalOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        {/* Left: Back Button & Movie Metadata */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
          <button 
            type="button"
            onClick={onClose} 
            className="flex items-center space-x-1.5 bg-white/10 hover:bg-red-600 text-white font-bold px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all active:scale-95 shadow-lg shrink-0 border border-white/10 hover:border-red-500"
            title="Return to library (Esc)"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Back</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h1 className="text-xs sm:text-base font-black text-white tracking-tight uppercase truncate max-w-[120px] xs:max-w-[190px] sm:max-w-xs md:max-w-md">
                {movie.title}
              </h1>
              {isSeries && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-600/30 text-purple-300 border border-purple-500/40 shrink-0">
                  S{season}:E{episode}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1.5 text-[10px] sm:text-xs text-gray-400 font-medium truncate">
              {movie.year && <span>{movie.year}</span>}
              {movie.year && movie.genre && <span>•</span>}
              <span className="truncate max-w-[100px] xs:max-w-[150px]">{movie.genre}</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">{activeServer.quality}</span>
            </div>
          </div>
        </div>

        {/* Right: Clean Consolidated Controls (Server Picker, Next Server, Episodes, Fullscreen) */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* Main Server Selector Dropdown Button */}
          <button
            type="button"
            onClick={() => setShowServerModal(true)}
            className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold bg-zinc-900/90 hover:bg-zinc-800 text-white border border-white/20 transition-all shadow-md active:scale-95 group"
            title="Choose stream server (Hindi / Global)"
          >
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-black text-amber-400">
                {activeServer.isHindi ? '🇮🇳 Hindi' : '🌐 Multi'}:
              </span>
            </span>
            <span className="truncate max-w-[90px] xs:max-w-[130px] sm:max-w-[180px] text-gray-100 font-extrabold text-[11px] sm:text-xs">
              {activeServer.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition shrink-0" />
          </button>

          {/* Quick 1-Tap "Next Server" Failover Button */}
          <button
            type="button"
            onClick={handleNextServer}
            className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition shadow-sm active:scale-95"
            title="Fast switch to next stream server (Press 'N')"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Next Server</span>
          </button>

          {/* TV Series Episode Navigator (Directly on header, eliminating bulky sub-bars!) */}
          {isSeries && (
            <div className="flex items-center bg-zinc-900/90 border border-purple-500/30 rounded-full p-0.5 shadow-sm">
              <button
                type="button"
                onClick={handlePrevEpisode}
                disabled={season === 1 && episode === 1}
                className="p-1 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none rounded-full transition text-gray-300 hover:text-white"
                title="Previous Episode"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setForceSeriesMode(true);
                  setShowEpisodesModal(true);
                }}
                className="px-2 py-0.5 text-[11px] sm:text-xs font-black text-purple-300 hover:text-white flex items-center space-x-1 transition"
                title="Open Episode Grid"
              >
                <Tv className="w-3 h-3 text-purple-400" />
                <span>S{season}:E{episode}</span>
              </button>
              <button
                type="button"
                onClick={handleNextEpisode}
                className="p-1 hover:bg-white/10 rounded-full transition text-gray-300 hover:text-white"
                title="Next Episode"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Audio Language Selector (for 8Stream Multi-Audio VIP) */}
          {activeServer.id === 'streamapi-hls' && audioTracks.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAudioMenu(!showAudioMenu)}
                className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-black bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 transition shadow-sm active:scale-95"
                title="Select Audio Track (Hindi, English, etc.)"
              >
                <Headphones className="w-3.5 h-3.5 text-purple-300" />
                <span className="text-[11px] sm:text-xs">Audio: {selectedAudioLang}</span>
                <ChevronDown className="w-3 h-3 text-purple-300" />
              </button>

              {showAudioMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-white/20 rounded-2xl shadow-2xl p-1.5 z-[100] flex flex-col space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 px-2 py-1 uppercase tracking-wider">Audio Tracks</span>
                  {audioTracks.map((t) => (
                    <button
                      key={t.id || t.title}
                      type="button"
                      onClick={() => handleSelectAudioLang(t)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                        selectedAudioLang.toLowerCase() === t.title.toLowerCase()
                          ? 'bg-purple-600 text-white'
                          : 'hover:bg-white/10 text-gray-200'
                      }`}
                    >
                      <span>{t.title}</span>
                      {selectedAudioLang.toLowerCase() === t.title.toLowerCase() && (
                        <Check className="w-3.5 h-3.5" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 hover:bg-white/15 rounded-full text-gray-300 hover:text-white transition active:scale-95 border border-white/10"
            title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Open Direct Stream in New Tab (solves browser iframe sandbox blocking) */}
          <a
            href={activeServer.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 hover:bg-white/15 rounded-full text-gray-300 hover:text-white transition active:scale-95 border border-white/10 hidden sm:flex items-center"
            title="Open stream in a clean tab if browser blocks iframe"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* StreamRip Direct / Download Button */}
          <a
            href={getStreamRipUrl(movie, season, episode)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/40 text-amber-300 hover:text-white transition shadow-sm active:scale-95 shrink-0"
            title={`Download or Open in StreamRip (${movie.title})`}
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">StreamRip</span>
          </a>
        </div>
      </header>

      {/* 2. SERVER SELECTION MODAL / DRAWER (Dedicated Hindi & Global Categories) */}
      {showServerModal && (
        <div className="fixed inset-0 z-[260] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#141414] border border-white/15 w-full sm:max-w-2xl max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-zinc-900/90">
              <div className="flex items-center space-x-3">
                <div className="bg-red-600/20 p-2.5 rounded-2xl border border-red-500/30">
                  <Radio className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-white uppercase tracking-tight flex items-center space-x-2">
                    <span>Select Streaming Server</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {servers.length} Available
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium">
                    Choose from dedicated Hindi servers, dual-audio tracks, or global 4K nodes
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowServerModal(false)}
                className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language / Category Filter Tabs */}
            <div className="p-3 sm:p-4 border-b border-white/5 bg-zinc-950/70 flex items-center space-x-2 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setServerCategoryTab('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center space-x-1.5 shrink-0 ${
                  serverCategoryTab === 'all'
                    ? 'bg-zinc-700 text-white border border-white/20'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 text-gray-300 border border-white/10'
                }`}
              >
                <span>⚡ All Servers ({servers.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setServerCategoryTab('hindi')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center space-x-1.5 shrink-0 ${
                  serverCategoryTab === 'hindi'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-500'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 text-gray-300 border border-white/10'
                }`}
              >
                <span>🇮🇳 Hindi Dub & Multi</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40">
                  {hindiServers.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setServerCategoryTab('global')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center space-x-1.5 shrink-0 ${
                  serverCategoryTab === 'global'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-500'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 text-gray-300 border border-white/10'
                }`}
              >
                <span>🌐 Global & English</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40">
                  {globalServers.length}
                </span>
              </button>
            </div>

            {/* Server Cards List */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-2.5">
              {(serverCategoryTab === 'hindi' ? hindiServers : serverCategoryTab === 'global' ? globalServers : servers).map((s, idx) => {
                const isCurrent = s.id === activeServer.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectServer(s.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between gap-3 active:scale-[0.99] group ${
                      isCurrent
                        ? 'bg-red-600/15 border-red-500/60 ring-1 ring-red-500/50 shadow-md'
                        : 'bg-zinc-900/70 hover:bg-zinc-800/90 border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`p-2.5 rounded-xl shrink-0 ${
                        isCurrent 
                          ? 'bg-red-600 text-white' 
                          : s.isHindi 
                            ? 'bg-amber-500/15 text-amber-400 group-hover:bg-amber-500/25' 
                            : 'bg-blue-500/15 text-blue-400 group-hover:bg-blue-500/25'
                      }`}>
                        {s.isHindi ? <Sparkles className="w-4 h-4" /> : <Film className="w-4 h-4" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-black text-xs sm:text-sm text-white truncate group-hover:text-amber-300 transition">
                            {s.name}
                          </h4>
                          {s.badge && (
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              s.isHindi 
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            }`}>
                              {s.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">
                          {s.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5 shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-emerald-500/20 hidden xs:inline">
                        {s.quality}
                      </span>
                      {isCurrent ? (
                        <div className="flex items-center space-x-1 text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30">
                          <Check className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-red-600 group-hover:text-white text-gray-400 transition">
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Modal Footer with Quick Switch and Tips */}
            <div className="p-3 sm:p-4 border-t border-white/10 bg-zinc-900/90 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-gray-400 flex items-center space-x-1">
                <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>Tip: Switch servers if buffering or for alternate Hindi dub tracks</span>
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowServerModal(false);
                    setShowVercelConfigModal(true);
                  }}
                  className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-bold rounded-xl text-xs transition border border-purple-500/30 flex items-center space-x-1.5"
                  title="Configure 8Stream or Vercel API backend URL"
                >
                  <Settings className="w-3.5 h-3.5 text-purple-400" />
                  <span>Stream API / Vercel</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextServer}
                  className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-xl text-xs transition border border-amber-500/30"
                >
                  Try Next Server
                </button>
                <button
                  type="button"
                  onClick={() => setShowServerModal(false)}
                  className="px-4 py-1.5 bg-white text-black font-bold rounded-xl text-xs hover:bg-gray-200 transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. VERCEL / STREAM API SETTINGS MODAL */}
      {showVercelConfigModal && (
        <div className="fixed inset-0 z-[280] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#141414] border border-white/15 w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-zinc-900/90">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-600/20 p-2.5 rounded-2xl border border-purple-500/30">
                  <Settings className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-white">Stream API & Vercel Configuration</h3>
                  <p className="text-[11px] text-gray-400">Multi-Audio .m3u8 Stream Provider</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVercelConfigModal(false)}
                className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="bg-purple-500/10 border border-purple-500/25 rounded-2xl p-3.5 text-xs text-purple-200 space-y-1">
                <p className="font-bold flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>How it works:</span>
                </p>
                <p className="text-[11px] text-gray-300">
                  1. <code>/api/v1/mediaInfo?id=IMDB_ID</code> gets audio tracks & decryption key.<br />
                  2. <code>/api/v1/getStream</code> (POST) resolves direct .m3u8 stream link with Hindi, English, Bengali, Tamil, Telugu audio.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Custom Vercel / Stream API URL (Optional)
                </label>
                <input
                  type="text"
                  value={vercelUrlInput}
                  onChange={(e) => setVercelUrlInput(e.target.value)}
                  placeholder="e.g. https://my-stream-api.vercel.app (leave empty for built-in proxy)"
                  className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition font-mono"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Leave empty to use built-in local Express proxy with sample fallback.
                </p>
              </div>

              {vercelTestMessage && (
                <div className={`p-3 rounded-xl text-xs font-medium border ${
                  vercelTestStatus === 'success'
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : vercelTestStatus === 'error'
                      ? 'bg-red-500/15 border-red-500/30 text-red-300'
                      : 'bg-zinc-800 text-gray-300 border-white/10'
                }`}>
                  {vercelTestMessage}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-zinc-900/90 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleTestVercelUrl}
                disabled={vercelTestStatus === 'testing'}
                className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-200 font-bold rounded-xl text-xs transition border border-white/10 disabled:opacity-50"
              >
                {vercelTestStatus === 'testing' ? 'Testing...' : 'Test Connection'}
              </button>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowVercelConfigModal(false)}
                  className="px-4 py-2 hover:bg-white/10 text-gray-300 font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveVercelUrl}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl text-xs transition shadow-lg shadow-purple-600/30"
                >
                  Save URL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Episode Selection Modal */}
      {showEpisodesModal && (
        <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#181818] border border-white/15 w-full sm:max-w-2xl max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-zinc-900/90">
              <div className="flex items-center space-x-2">
                <div className="bg-purple-600/20 p-2 rounded-xl border border-purple-500/30">
                  <Tv className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-white uppercase tracking-tight">
                    Select Episode • {movie.title}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium">
                    Currently streaming Season {season}, Episode {episode}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowEpisodesModal(false)}
                className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Season Selector Tabs */}
            <div className="p-3 sm:p-4 border-b border-white/5 bg-zinc-950/60 overflow-x-auto no-scrollbar">
              <div className="flex items-center space-x-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(sNum => (
                  <button
                    key={sNum}
                    onClick={() => {
                      setSeason(sNum);
                      setEpisode(1);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      season === sNum 
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' 
                        : 'bg-zinc-800/80 hover:bg-zinc-700 text-gray-300'
                    }`}
                  >
                    Season {sNum}
                  </button>
                ))}
              </div>
            </div>

            {/* Episode Grid */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Season {season} Episodes
                </span>
                <span className="text-[11px] text-amber-400 font-bold">
                  Tap any episode to watch instantly
                </span>
              </div>

              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {Array.from({ length: 24 }, (_, i) => i + 1).map(epNum => {
                  const isCurrent = episode === epNum;
                  return (
                    <button
                      key={epNum}
                      onClick={() => {
                        setEpisode(epNum);
                        setShowEpisodesModal(false);
                      }}
                      className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 active:scale-95 group ${
                        isCurrent 
                          ? 'bg-gradient-to-b from-purple-600 to-purple-700 border-purple-400 text-white shadow-lg ring-2 ring-purple-400/40' 
                          : 'bg-zinc-800/60 hover:bg-zinc-700/80 border-white/10 text-gray-200 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        {isCurrent ? (
                          <Check className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <Play className="w-3 h-3 text-purple-400 group-hover:scale-110 transition" />
                        )}
                        <span className="text-xs font-black">
                          Ep {epNum}
                        </span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-medium">
                        S{season}:E{epNum}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-white/10 bg-zinc-900 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                Playing on: <strong className="text-white">{activeServer.name}</strong>
              </span>
              <button
                onClick={() => setShowEpisodesModal(false)}
                className="px-4 py-1.5 bg-white text-black font-bold rounded-xl text-xs hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN VIDEO STREAMING CANVAS AREA */}
      <main className="w-full flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {/* Non-blocking Loading Banner */}
        {isLoading && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15 flex items-center space-x-2 text-xs font-bold text-gray-200 animate-in fade-in duration-200 shadow-xl">
            <div className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <span>Connecting {activeServer.name}...</span>
          </div>
        )}

        {/* Helpful Fallback Prompt if stream is taking longer or buffering */}
        {streamSlow && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-zinc-950/95 border border-amber-500/50 px-3.5 py-1.5 rounded-full shadow-2xl flex items-center space-x-2.5 text-xs backdrop-blur-md animate-in fade-in slide-in-from-top-2">
            <span className="text-gray-300 text-[11px] font-medium hidden sm:inline">Stream buffering?</span>
            <button
              type="button"
              onClick={handleNextServer}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-lg transition text-[11px] flex items-center space-x-1 active:scale-95 shadow-md"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Next Server</span>
            </button>
            <a
              href={activeServer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-white/15 hover:bg-white/25 text-white font-bold rounded-lg transition text-[11px] flex items-center space-x-1 active:scale-95 border border-white/15"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Open in New Tab</span>
            </a>
          </div>
        )}

        {/* Video Player Render - Standard Iframe with full permissions */}
        {activeServer.type === 'video' ? (
          <video 
            ref={videoRef}
            key={`${activeServer.url}-${iframeKey}`}
            src={activeServer.url && (activeServer.url.includes('.m3u8') || activeServer.url.includes('/stream') || activeServer.url.includes('/playlist')) ? undefined : activeServer.url}
            controls
            autoPlay
            playsInline
            preload="auto"
            onLoadedData={() => {
              setIsLoading(false);
              setStreamSlow(false);
            }}
            onCanPlay={() => {
              setIsLoading(false);
              setStreamSlow(false);
            }}
            onPlaying={() => {
              setIsLoading(false);
              setStreamSlow(false);
            }}
            onWaiting={() => {
              setIsLoading(true);
            }}
            className="w-full h-full object-contain"
          />
        ) : (
          <iframe 
            key={`${activeServer.url}-${iframeKey}`}
            src={activeServer.url}
            title={activeServer.name}
            className="w-full h-full border-0 absolute inset-0 z-10"
            loading="eager"
            referrerPolicy="origin"
            allowFullScreen={true}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            onLoad={() => {
              setIsLoading(false);
              setStreamSlow(false);
            }}
          />
        )}
      </main>

      {/* 4. SIMPLIFIED SLEEK BOTTOM BAR */}
      <footer 
        className={`w-full bg-gradient-to-t from-black/95 via-black/85 to-transparent px-3 sm:px-6 py-2.5 z-40 flex items-center justify-between text-[11px] sm:text-xs text-gray-400 border-t border-white/5 transition-all duration-300 backdrop-blur-sm ${
          controlsVisible || anyModalOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Active Audio Indicator */}
          <div className="flex items-center space-x-1.5 text-gray-300 font-bold bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{activeServer.isHindi ? '🇮🇳 Hindi Audio Active' : '🌐 Multi-Audio Active'}</span>
          </div>

          {/* Ad-Block Guide Button */}
          <button
            type="button"
            onClick={() => setShowAdGuardModal(true)}
            className="flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-2.5 sm:px-3 py-1 rounded-full transition active:scale-95"
            title="Step-by-step instructions to block all ads with AdGuard DNS"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xs:inline">Ad-Free (AdGuard DNS)</span>
            <span className="xs:hidden">Ad-Free</span>
          </button>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {onOpenChat && (
            <button
              type="button"
              onClick={onOpenChat}
              className="text-red-400 hover:text-white font-bold bg-red-600/15 hover:bg-red-600/30 px-2.5 sm:px-3 py-1 rounded-full border border-red-500/30 flex items-center space-x-1.5 transition active:scale-95"
              title="Open Live Stream Community Chat"
            >
              <MessageSquare className="w-3.5 h-3.5 text-red-500" />
              <span className="hidden xs:inline">Live Chat</span>
            </button>
          )}

          {onOpenGoogleChat && (
            <button
              type="button"
              onClick={onOpenGoogleChat}
              className="text-blue-400 hover:text-white font-bold bg-blue-600/15 hover:bg-blue-600/30 px-2.5 sm:px-3 py-1 rounded-full border border-blue-500/30 flex items-center space-x-1.5 transition active:scale-95"
              title="Open Google Workspace Chat"
            >
              <svg className="w-3.5 h-3.5 fill-blue-400" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
              </svg>
              <span className="hidden sm:inline">Google Chat</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="text-gray-400 hover:text-amber-300 font-bold bg-white/5 hover:bg-amber-500/20 px-2.5 sm:px-3 py-1 rounded-full border border-white/10 flex items-center space-x-1.5 transition active:scale-95"
            title="Report if this movie is buffering or wrong stream"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xs:inline">Report Stream</span>
          </button>
        </div>
      </footer>

      {/* Instant Stream Fix & Report Modal */}
      <ReportIssueModal
        isOpen={showReportModal}
        movie={movie}
        currentServerId={activeServer.id}
        currentServerName={activeServer.name}
        season={season}
        episode={episode}
        onClose={() => setShowReportModal(false)}
        onFixApplied={handleFixApplied}
      />

      {/* Step-by-Step AdGuard DNS Ad Block Instructions Modal */}
      <AdGuardDnsModal
        isOpen={showAdGuardModal}
        onClose={() => setShowAdGuardModal(false)}
      />
    </div>
  );
};

export default VideoPlayer;
