import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, GraduationCap, Plane, DollarSign, MapPin, Award, CheckCircle, Clock } from 'lucide-react';

interface LicensureTypeRatingPageProps {
  onBack: () => void;
  pathwayId?: string;
  isDarkMode?: boolean;
}

const LicensureTypeRatingPage: React.FC<LicensureTypeRatingPageProps> = ({ onBack, pathwayId, isDarkMode = false }) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const licensureCards = [
    {
      id: 'type-rating-centers',
      name: 'Type Rating Centers',
      description: 'World-class type rating training centers with comprehensive programs for Airbus and Boeing aircraft types.',
      image: 'https://www.caepacific.com/wp-content/uploads/2021/03/CAE-Philippines-Training-Center.jpg',
      locations: ['Global', 'USA', 'Europe', 'Asia'],
      salary: '$10,000 - $50,000',
      requirements: ['CPL + ME/IR', '1,500+ hrs TT', 'Medical Class 1'],
      duration: '4-12 weeks',
      certification: 'Type Rating Certificate',
    },
    {
      id: 'instrument-rating',
      name: 'Instrument Rating',
      description: 'Earn your Instrument Rating to fly in all weather conditions and airspace. Master IFR procedures.',
      image: 'https://i.ytimg.com/vi/ApAGDJGhSag/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCEJ3oeB8h0vSy8q8KxGx-OWp1f-A',
      locations: ['Global', 'USA', 'Europe'],
      salary: '$10,000 - $18,000',
      requirements: ['PPL or CPL', '50+ hrs Cross-Country', 'Medical Class 2'],
      duration: '6-8 weeks',
      certification: 'Instrument Rating Certificate',
    },
    {
      id: 'atpl-pathway',
      name: 'ATPL Pathway',
      description: 'Build flight hours to meet Airline Transport Pilot requirements. Track progress toward 1,500 hours.',
      image: 'https://www.wingpath.in/blog_images/what-is-atpl-in-india-6ihgy-1000x700.png',
      locations: ['Global', 'USA', 'Europe', 'Asia'],
      salary: 'Hour Building',
      requirements: ['CPL + ME/IR', '1,500+ hrs TT', 'ATPL Theory Pass'],
      duration: '1-3 years',
      certification: 'Airline Transport Pilot License',
    },
    {
      id: 'seaplane-rating',
      name: 'Seaplane Rating',
      description: 'Add a seaplane rating to your pilot certificate. Learn water operations and seaplane handling.',
      image: 'https://images.unsplash.com/photo-1507199129876-44d2b3190c1a?w=800&q=80',
      locations: ['USA', 'Canada', 'Caribbean'],
      salary: '$3,000 - $8,000',
      requirements: ['PPL', '25+ hrs TT', 'Medical Class 2'],
      duration: '2-4 weeks',
      certification: 'Seaplane Rating',
    },
    {
      id: 'multi-engine-rating',
      name: 'Multi-Engine Rating',
      description: 'Earn your multi-engine rating to fly complex aircraft with multiple engines.',
      image: 'https://thumbs.dreamstime.com/b/cessna-caravan-14103370.jpg',
      locations: ['Global', 'USA', 'Europe'],
      salary: '$8,000 - $15,000',
      requirements: ['PPL or CPL', 'Single Engine Experience', 'Medical Class 2'],
      duration: '4-6 weeks',
      certification: 'Multi-Engine Rating',
    },
    {
      id: 'uprt-rating',
      name: 'UPRT Rating',
      description: 'Upset Prevention and Recovery Training. Learn to recognize and recover from aircraft upsets.',
      image: 'https://www.flight-safety.com/wp-content/uploads/2021/06/uprt-training.jpg',
      locations: ['Global', 'USA', 'Europe'],
      salary: '$3,000 - $5,000',
      requirements: ['CPL or ATPL', 'Spin Awareness', 'EASA/FAA Compliant'],
      duration: '1-2 weeks',
      certification: 'UPRT Certificate',
    },
    {
      id: 'cfi-rating',
      name: 'CFI Rating',
      description: 'Certified Flight Instructor rating. Teach others to fly and build valuable flight hours.',
      image: 'https://media.pea.com/wp-content/uploads/2023/06/flight-instructor-training-1024x607.jpeg',
      locations: ['Global', 'USA', 'Europe'],
      salary: 'Hour Building + Instruction',
      requirements: ['CPL', '250+ hrs TT', 'Medical Class 2'],
      duration: '6-10 weeks',
      certification: 'CFI Certificate',
    },
    {
      id: 'dubai-emirati-atpl',
      name: 'Dubai Emirati ATPL Pathway',
      description: 'Pathway to Globally Recognized GCAA ATPL Theory. Designed for pilots in the UAE and abroad, delivered through Wing Mentor and Fujairah Aviation Academy. Secure GCAA ATPL theoretical credits recognized in Europe and Asia.',
      image: 'https://www.fujairahaviation.com/wp-content/uploads/2023/01/Fujairah-Aviation-Academy-Training-Center.jpg',
      locations: ['UAE', 'UK', 'Mauritius', 'Philippines', 'Germany'],
      salary: 'AED 18,000 (approx. $4,900)',
      requirements: ['CPL', 'GCAA Theory Preparation', 'UAE Security Clearance'],
      duration: 'Distance Learning (Flexible)',
      certification: 'GCAA ATPL Theory Credits (Frozen ATPL)',
    },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCardClick = (cardId: string) => {
    setSelectedCard(cardId);
  };

  const handleBack = () => {
    setSelectedCard(null);
    onBack();
  };

  return (
    <div className="dashboard-container animate-fade-in" style={{ position: 'fixed', top: '70px', left: 0, right: 0, bottom: 0, overflow: 'auto', zIndex: 10, padding: '2rem 1rem', alignItems: 'flex-start', minHeight: 'auto' }}>
      <main className="dashboard-card" style={{ maxWidth: '1400px', padding: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={handleBack}
            className="mb-6 mt-2 text-sm font-medium flex items-center gap-2 transition-colors rounded-full px-4 py-2 shadow-sm border border-solid"
            style={{
              color: isDarkMode ? '#94a3b8' : undefined,
              background: isDarkMode ? 'rgba(15, 23, 42, 0.82)' : undefined,
              borderColor: isDarkMode ? 'rgba(71, 85, 105, 0.7)' : undefined,
            }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} /> Back to Pathways
          </button>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img
              src="/logo.png"
              alt="WingMentor Logo"
              style={{ maxWidth: '260px', height: 'auto', objectFit: 'contain', marginBottom: '2rem' }}
            />
            <div className="tracking-widest text-xs font-bold uppercase mb-3" style={{ color: isDarkMode ? '#60a5fa' : undefined }}>
              LICENSURE & TYPE RATING
            </div>
            <h1
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                fontWeight: 400,
                color: isDarkMode ? '#f8fafc' : '#0f172a',
                marginBottom: '1rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.15
              }}
            >
              Advanced Training & Certification
            </h1>
            <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.05rem', color: isDarkMode ? '#94a3b8' : '#64748b', lineHeight: 1.8 }}>
              World-class type rating centers and advanced training programs for pilots seeking specialized certifications and career advancement.
            </p>
          </div>
        </div>

        <div style={{ padding: '0', backgroundColor: 'transparent' }}>
          <div className="animate-fade-in">
            {/* Main Overview Card */}
            <div className="horizontal-card" style={{ 
              marginBottom: '2rem',
              background: isDarkMode ? 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.94) 100%)' : 'white',
              borderRadius: '18px',
              padding: '1.75rem',
              border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.75)' : '1px solid #e2e8f0',
              boxShadow: isDarkMode ? '0 18px 45px rgba(2,6,23,0.34)' : '0 18px 45px rgba(15,23,42,0.08)'
            }}>
              <div className="horizontal-card-content-wrapper">
                <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: isDarkMode ? '#60a5fa' : '#0f172a', fontWeight: 'bold' }}>•</div>
                  <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                    <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Comprehensive Training Programs
                    </h3>
                    <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1.5rem', color: isDarkMode ? '#cbd5e1' : '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                      Access world-class type rating centers and advanced training programs across global locations, featuring comprehensive certification pathways for career advancement.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: isDarkMode ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7', borderRadius: '12px', color: isDarkMode ? '#fbbf24' : '#92400e', fontWeight: 500, border: isDarkMode ? '1px solid rgba(245, 158, 11, 0.3)' : undefined }}>
                        Type Ratings
                      </span>
                      <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: isDarkMode ? 'rgba(15, 23, 42, 0.82)' : '#f1f5f9', borderRadius: '12px', color: isDarkMode ? '#cbd5e1' : '#475569', fontWeight: 500, border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.72)' : undefined }}>
                        Global Centers
                      </span>
                      <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#dcfce7', borderRadius: '12px', color: isDarkMode ? '#4ade80' : '#166534', fontWeight: 500, border: isDarkMode ? '1px solid rgba(34, 197, 94, 0.25)' : undefined }}>
                        Certified Training
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Programs Carousel - Same design as Fast Track Pilot pathway */}
            <div className="text-center mb-4 relative z-50">
              <div className="selection-indicator inline-block">
                <span className={`text-sm font-normal ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>
                  {selectedCard ? licensureCards.find(c => c.id === selectedCard)?.name : 'Swipe left or right and click to select a card'}
                </span>
              </div>
            </div>

            <div
              className="pathway-sub-carousel flex gap-4 overflow-x-auto overflow-y-hidden pb-4 px-4 sm:px-6 lg:px-8 xl:px-12"
              style={{
                WebkitOverflowScrolling: 'touch',
                cursor: 'grab',
              }}
              onMouseDown={(e) => {
                const el = e.currentTarget;
                el.style.cursor = 'grabbing';
                const startX = e.pageX - el.offsetLeft;
                const scrollLeft = el.scrollLeft;
                const onMove = (me: MouseEvent) => {
                  const x = me.pageX - el.offsetLeft;
                  el.scrollLeft = scrollLeft - (x - startX);
                };
                const onUp = () => {
                  el.style.cursor = 'grab';
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                };
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
              }}
            >
              {licensureCards.map((card, idx) => {
                const isSelected = selectedCard === card.id;
                
                const handleCardClick = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  setSelectedCard(card.id);
                  
                  const cardElement = e.currentTarget as HTMLElement;
                  const carousel = cardElement.parentElement;
                  if (carousel && cardElement) {
                    const cardCenterInContainer = cardElement.offsetLeft + cardElement.offsetWidth / 2;
                    const targetScrollLeft = cardCenterInContainer - carousel.offsetWidth / 2;
                    
                    carousel.scrollTo({
                      left: targetScrollLeft,
                      behavior: 'smooth'
                    });
                  }
                };
                
                return (
                  <div
                    key={`${card.id}-${idx}`}
                    data-card-id={card.id}
                    onClick={handleCardClick}
                    className={`flex-shrink-0 cursor-pointer rounded-xl transition-all duration-300 p-[3px] ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''}`}
                    style={{ width: '600px' }}
                  >
                    <div className={`relative h-[300px] overflow-hidden rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                      <img src={card.image} alt={card.name} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute top-3 right-3 flex gap-2 items-start">
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                          {card.duration}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-bold text-white mb-2">{card.name}</h3>
                        <p className="text-white/80 text-sm line-clamp-2 mb-3">{card.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-white/60 text-xs">{card.locations.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LicensureTypeRatingPage;
