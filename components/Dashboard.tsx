import React, { useState, useEffect } from 'react';
import { Bell, ArrowRight, Database, Users, ClipboardList, Plane, ChevronLeft, ChevronRight, ShoppingBag, Wrench, Clock, Activity, PieChart, Map, Share2, LineChart } from 'lucide-react';
import { View } from '../types';

interface DashboardProps {
  onNavigate: (view: View) => void;
  userName: string;
  userRole: string;
  jotFormConnected: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, userName, userRole, jotFormConnected }) => {
  // Main Apps Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Productivity Tools Carousel State
  const [currentToolSlide, setCurrentToolSlide] = useState(0);
  const [toolTouchStart, setToolTouchStart] = useState<number | null>(null);
  const [toolTouchEnd, setToolTouchEnd] = useState<number | null>(null);

  const apps = [
    {
      id: 'blackbox',
      title: "Knowledge Database",
      subtitle: "Blackbox App",
      description: "Access the comprehensive aviation knowledge base. Analyze incident reports, review safety data, and enhance your decision-making skills.",
      image: "https://images.unsplash.com/photo-1559067515-bf7d799b6d4d?auto=format&fit=crop&q=80&w=2000",
      color: "text-emerald-400",
      btnColor: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25",
      icon: Database
    },
    {
      id: 'forum',
      title: "The Pilot Gap Forum",
      subtitle: "Community Hub",
      description: "Connect with mentors and cadets. Discuss career strategies, share flight experiences, and build your professional network in our secure hangar.",
      image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=2000",
      color: "text-sky-400",
      btnColor: "bg-sky-500 hover:bg-sky-600 shadow-sky-500/25",
      icon: Users
    },
    {
      id: 'exam',
      title: "Examination Terminal",
      subtitle: "Testing Center",
      description: "Validate your knowledge with rigorous mock exams, technical questionnaires, and type-rating preparation modules to ensure you are checkride ready.",
      image: "https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80&w=2000",
      color: "text-amber-400",
      btnColor: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25",
      icon: ClipboardList
    },
    {
      id: 'sim',
      title: "The Simulator Room",
      subtitle: "Flight Training",
      description: "Master IFR maneuvers, practice emergency procedures, and refine your instrument scan in our high-fidelity virtual environment.",
      image: "https://images.unsplash.com/photo-1483304528321-0674f0040030?auto=format&fit=crop&q=80&w=2000",
      color: "text-indigo-400",
      btnColor: "bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/25",
      icon: Plane
    }
  ];

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

  // Auto-rotate Main Apps
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % apps.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [apps.length]);

  // Auto-rotate Tools
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentToolSlide((prev) => (prev + 1) % tools.length);
    }, 6500); // Slightly different timing
    return () => clearInterval(timer);
  }, [tools.length]);

  // Main Apps Handlers
  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % apps.length);
  };
  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + apps.length) % apps.length);
  };
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) setCurrentSlide((prev) => (prev + 1) % apps.length);
    if (distance < -50) setCurrentSlide((prev) => (prev - 1 + apps.length) % apps.length);
  };

  // Tools Handlers
  const nextToolSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentToolSlide((prev) => (prev + 1) % tools.length);
  };
  const prevToolSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentToolSlide((prev) => (prev - 1 + tools.length) % tools.length);
  };
  const onToolTouchStart = (e: React.TouchEvent) => {
    setToolTouchEnd(null);
    setToolTouchStart(e.targetTouches[0].clientX);
  };
  const onToolTouchMove = (e: React.TouchEvent) => {
    setToolTouchEnd(e.targetTouches[0].clientX);
  };
  const onToolTouchEnd = () => {
    if (!toolTouchStart || !toolTouchEnd) return;
    const distance = toolTouchStart - toolTouchEnd;
    if (distance > 50) setCurrentToolSlide((prev) => (prev + 1) % tools.length);
    if (distance < -50) setCurrentToolSlide((prev) => (prev - 1 + tools.length) % tools.length);
  };

  const getCardStyle = (index: number, current: number, total: number) => {
    let offset = (index - current + total) % total;
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

  const newsItems = [
    {
      id: 1,
      title: "New IFR Simulator Added",
      date: "2 hours ago",
      category: "Desktop App Update",
      summary: "Experience the new IFR training module on the WingMentor Desktop App. Learn the foundations of IFR maneuvers and master chart interpretation."
    },
    {
      id: 2,
      title: "WingMentor Community Webinar",
      date: "1 day ago",
      category: "Event",
      summary: "Join us this Friday for a deep dive into advanced meteorology with Captain Stevenson."
    },
    {
      id: 3,
      title: "Maintenance Notice: Server Upgrades",
      date: "2 days ago",
      category: "System",
      summary: "Brief downtime expected on Sunday 0200Z for database improvements."
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">WingMentor Program</h1>
          <p className="text-slate-600 text-lg mt-1 font-medium">Introducing apps for pilots made by pilots</p>
          <p className="text-slate-400 text-sm mt-2">Welcome back, {userRole} {userName}.</p>
        </div>
        <div className="text-sm text-slate-400 hidden md:block pt-2">
           {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* 3D App Carousel Section */}
      <div 
        className="relative h-[450px] w-full touch-pan-y" 
        style={{ perspective: '1200px' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
         {apps.map((app, index) => {
           const Icon = app.icon;
           const isActive = index === currentSlide;
           
           return (
             <div 
               key={app.id}
               style={getCardStyle(index, currentSlide, apps.length)}
               onClick={() => !isActive && setCurrentSlide(index)}
               className="rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-700/50"
             >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={app.image} 
                    alt={app.title} 
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
                  <div className={`flex items-center space-x-2 mb-4 font-mono ${app.color}`}>
                    <Icon size={20} />
                    <span className="text-sm tracking-widest uppercase font-bold">{app.subtitle}</span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">{app.title}</h2>
                  
                  <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-xl">
                    {app.description}
                  </p>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(View.PILOT_APPS);
                    }}
                    className={`self-start flex items-center space-x-3 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg transform hover:-translate-y-1 ${app.btnColor}`}
                  >
                    <span>Launch App</span>
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
            {apps.map((_, index) => (
              <div 
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${index === currentSlide ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
              ></div>
            ))}
         </div>
      </div>

      {/* News Feed Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Bell size={24} className="text-sky-600" />
            Program News
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col h-full group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-wide">
                  {item.category}
                </span>
                <span className="text-xs text-slate-400">{item.date}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-sky-600 transition-colors line-clamp-2">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">
                {item.summary}
              </p>
              <button className="text-sky-600 text-sm font-semibold hover:text-sky-700 flex items-center gap-1 mt-auto">
                Read Updates <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Section - Conditional */}
      {jotFormConnected ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-700">Flight Time</h3>
                <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
                  <Clock size={20} />
                </div>
             </div>
             <div>
               <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold text-slate-800">42.5</span>
                  <span className="text-slate-500 mb-1 text-sm">/ 60.0 hrs</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                  <div className="bg-sky-500 h-2 rounded-full" style={{ width: '70%' }}></div>
               </div>
               <p className="text-xs text-slate-400">PPL Phase Progress</p>
             </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-700">Mission Status</h3>
                 <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Activity size={20} />
                </div>
             </div>
              <div>
               <h4 className="text-lg font-bold text-slate-800 mb-1">Cross Country Phase</h4>
               <p className="text-sm text-slate-500 mb-3">Next: Dual Navigation (XC-02)</p>
               <button onClick={() => onNavigate(View.PROGRESS)} className="text-xs font-bold text-emerald-600 uppercase tracking-wide hover:text-emerald-700 flex items-center gap-1">
                 View Syllabus <ArrowRight size={12} />
               </button>
             </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-700">Performance</h3>
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <PieChart size={20} />
                </div>
             </div>
              <div>
               <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl font-bold text-slate-800">94%</div>
                  <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+2.5%</div>
               </div>
               <p className="text-xs text-slate-400">Average Grade (Last 5 Flights)</p>
             </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center animate-fadeIn flex flex-col items-center justify-center py-12">
           <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
             <LineChart size={32} />
           </div>
           <h3 className="text-xl font-bold text-slate-800 mb-2">Analytics & Flight Data</h3>
           <p className="text-slate-500 mb-6 max-w-md">
             Connect your JotForm account to access real-time flight hours, mission progress tracking, and performance grading.
           </p>
           <button 
             onClick={() => onNavigate(View.PROGRESS)}
             className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-lg flex items-center gap-2"
           >
             <span>Sign In to View Analytics</span>
             <ArrowRight size={18} />
           </button>
        </div>
      )}

      {/* Productivity Tools Carousel */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Wrench size={24} className="text-emerald-600" />
          Productivity Tools Made by Pilots
        </h2>
        <div 
          className="relative h-[450px] w-full touch-pan-y" 
          style={{ perspective: '1200px' }}
          onTouchStart={onToolTouchStart}
          onTouchMove={onToolTouchMove}
          onTouchEnd={onToolTouchEnd}
        >
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            const isActive = index === currentToolSlide;
            
            return (
              <div 
                key={tool.id}
                style={getCardStyle(index, currentToolSlide, tools.length)}
                onClick={() => !isActive && setCurrentToolSlide(index)}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(View.TOOLS);
                      }}
                      className={`self-start flex items-center space-x-3 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg transform hover:-translate-y-1 ${tool.btnColor}`}
                    >
                      <span>Launch Tool</span>
                      <ArrowRight size={20} />
                    </button>
                  </div>
              </div>
            );
          })}

          {/* Tools Navigation Controls (Floating) */}
          <div className="absolute right-12 bottom-12 flex space-x-3 z-30 pointer-events-auto">
              <button 
                onClick={prevToolSlide}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 transition-colors shadow-lg"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextToolSlide}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 transition-colors shadow-lg"
              >
                <ChevronRight size={24} />
              </button>
          </div>

          {/* Tools Indicators */}
          <div className="absolute left-12 bottom-12 flex space-x-2 z-30">
              {tools.map((_, index) => (
                <div 
                  key={index}
                  onClick={() => setCurrentToolSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${index === currentToolSlide ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                ></div>
              ))}
          </div>
        </div>
      </div>

      {/* Shop Section */}
      <div className="pt-8 border-t border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-6">
          <ShoppingBag size={24} className="text-purple-600" />
          Pilot Shop
        </h2>

        <a 
          href="https://wingmentorapp.vercel.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block relative overflow-hidden rounded-2xl shadow-md group h-64 md:h-80"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
             <img 
               src="https://images.unsplash.com/photo-1583095117917-0b1e77926b0e?auto=format&fit=crop&q=80&w=1200" 
               alt="Pilot Shop" 
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-purple-900/70 to-transparent"></div>
          </div>
          
          <div className="relative h-full p-8 md:p-12 flex flex-col justify-center items-start z-10 max-w-2xl">
               <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold border border-white/10 mb-4">
                  Official Store
               </div>
               <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Equip for Excellence</h3>
               <p className="text-purple-100 text-lg leading-relaxed mb-8 max-w-lg">
                 Browse our curated selection of training kits, premium headsets, uniforms, and study guides. 
               </p>
               
               <span className="inline-flex items-center gap-2 bg-white text-purple-900 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors shadow-lg">
                 Visit WingMentor Shop
                 <ArrowRight size={18} />
               </span>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Dashboard;