import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Map, 
  Share2, 
  Clock, 
  ExternalLink 
} from 'lucide-react';

const PilotTools: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const tools = [
    {
      id: 'planning',
      title: "Planning Room",
      subtitle: "Mission Control",
      description: "Advanced flight planning suite. Access weather overlays, calculate performance data, and optimize your routes with professional precision.",
      image: "https://images.unsplash.com/photo-1584036561566-b93a901e3bae?auto=format&fit=crop&q=80&w=2000",
      color: "text-sky-400",
      btnColor: "bg-sky-500 hover:bg-sky-600 shadow-sky-500/25",
      icon: Map
    },
    {
      id: 'mindwebber',
      title: "MindWebber",
      subtitle: "Cognitive Training",
      description: "Visualize complex aviation systems. Connect concepts, build mental models, and enhance your decision-making framework using our dynamic mapping tool.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000",
      color: "text-purple-400",
      btnColor: "bg-purple-500 hover:bg-purple-600 shadow-purple-500/25",
      icon: Share2
    },
    {
      id: 'timeout',
      title: "Time Out",
      subtitle: "Fatigue Management",
      description: "Monitor duty times and rest requirements. Ensure you are physically and mentally fit for flight with our integrated FRMS tools.",
      image: "https://images.unsplash.com/photo-1495576775051-8af0bd6452f4?auto=format&fit=crop&q=80&w=2000",
      color: "text-amber-400",
      btnColor: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25",
      icon: Clock
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % tools.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [tools.length]);

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % tools.length);
  };

  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + tools.length) % tools.length);
  };

  // Touch handlers for Swipe support
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touch end
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % tools.length);
    }

    if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + tools.length) % tools.length);
    }
  };

  const getCardStyle = (index: number) => {
    const total = tools.length;
    let offset = (index - currentSlide + total) % total;
    if (offset > total / 2) offset -= total;

    const isActive = offset === 0;
    
    return {
      position: 'absolute' as const,
      width: '85%',
      height: '100%',
      left: '7.5%',
      top: 0,
      transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
      transformStyle: 'preserve-3d' as const,
      zIndex: isActive ? 20 : 10,
      opacity: Math.abs(offset) > 1 ? 0 : (isActive ? 1 : 0.4),
      transform: `translateX(${offset * 105}%) scale(${isActive ? 1 : 0.85}) rotateY(${offset * -25}deg) translateZ(${isActive ? 0 : -50}px)`,
      cursor: isActive ? 'default' : 'pointer',
      pointerEvents: (Math.abs(offset) > 1 ? 'none' : 'auto') as any,
    };
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto py-8">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Productivity Tools</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Specialized utilities designed by pilots to enhance your workflow, planning, and readiness.
        </p>
      </div>

      <div 
        className="relative h-[500px] w-full touch-pan-y" 
        style={{ perspective: '1200px' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
         {tools.map((tool, index) => {
           const Icon = tool.icon;
           const isActive = index === currentSlide;
           
           return (
             <div 
               key={tool.id}
               style={getCardStyle(index)}
               onClick={() => !isActive && setCurrentSlide(index)}
               className="rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-700/50"
             >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={tool.image} 
                    alt={tool.title} 
                    className="w-full h-full object-cover opacity-50 transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
                  {/* Additional futuristic overlay */}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                </div>

                {/* Content */}
                <div 
                  className={`relative z-10 p-8 md:p-12 h-full flex flex-col justify-center max-w-3xl transition-opacity duration-500 ${isActive ? 'opacity-100 delay-200' : 'opacity-0'}`}
                >
                  <div className={`flex items-center space-x-2 mb-4 font-mono ${tool.color}`}>
                    <Icon size={20} />
                    <span className="text-sm tracking-widest uppercase font-bold">{tool.subtitle}</span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">{tool.title}</h2>
                  
                  <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-xl">
                    {tool.description}
                  </p>
                  
                  <button 
                    className={`self-start flex items-center space-x-3 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg transform hover:-translate-y-1 ${tool.btnColor}`}
                  >
                    <span>Launch Tool</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
             </div>
           );
         })}

         {/* Navigation Controls (Floating) */}
         <div className="absolute right-12 bottom-12 flex space-x-3 z-30 pointer-events-auto">
            <button 
              onClick={prevSlide}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 transition-colors shadow-lg"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 transition-colors shadow-lg"
            >
              <ChevronRight size={24} />
            </button>
         </div>

         {/* Indicators */}
         <div className="absolute left-12 bottom-12 flex space-x-2 z-30">
            {tools.map((_, index) => (
              <div 
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${index === currentSlide ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
              ></div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default PilotTools;