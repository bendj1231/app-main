import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface ImmersiveVideoHeroProps {
  onScrollToCarousel: () => void;
}

export const ImmersiveVideoHero: React.FC<ImmersiveVideoHeroProps> = ({ onScrollToCarousel }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay was prevented, show play button
        setIsPlaying(false);
      });
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-black">
      {/* Video Background */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        onLoadedData={handleVideoLoad}
        poster="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2940&auto=format&fit=crop"
      >
        <source src="https://videos.pexels.com/video-files/5608459/5608459-uhd_2560_1440_25fps.mp4" type="video/mp4" />
      </video>

      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-6 z-20">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-white/80">
              Experience the Future of Aviation
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-serif text-white leading-none tracking-tight">
            Your Journey
            <br />
            <span className="text-blue-400">Starts Here</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-lg text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
            Join thousands of pilots bridging the gap between flight training and the airline flight deck.
            Professional pathways. Verified credentials. Global opportunities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={onScrollToCarousel}
              className="group relative px-6 py-2.5 md:px-10 md:py-4 bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10">Explore Programs</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <button
              onClick={onScrollToCarousel}
              className="px-6 py-2.5 md:px-10 md:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-xs md:text-sm font-bold uppercase tracking-wider rounded-sm border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 pt-6 md:pt-8">
            {[
              { value: 'Programs' },
              { value: 'Pilot Recognition' },
              { value: 'Pathways' },
            ].map((stat) => (
              <div key={stat.value} className="text-center">
                <div className="text-lg md:text-2xl lg:text-3xl font-serif text-white tracking-wide">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Controls */}
      <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-30 flex items-center gap-3 md:gap-4">
        <button
          onClick={togglePlay}
          className="p-2 md:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-white transition-all duration-300 hover:scale-110"
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <Play className="w-4 h-4 md:w-5 md:h-5" />
          )}
        </button>
        <button
          onClick={toggleMute}
          className="p-2 md:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-white transition-all duration-300 hover:scale-110"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
          )}
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-30 flex flex-col items-center gap-1 md:gap-2 animate-bounce">
        <span className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">Scroll</span>
        <div className="w-[1px] h-6 md:h-8 bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </div>
  );
};
