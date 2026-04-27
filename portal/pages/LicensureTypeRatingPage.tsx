import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, GraduationCap, Plane, DollarSign, MapPin, Award, CheckCircle, Clock } from 'lucide-react';

interface LicensureTypeRatingPageProps {
  onBack: () => void;
  pathwayId?: string;
}

const LicensureTypeRatingPage: React.FC<LicensureTypeRatingPageProps> = ({ onBack, pathwayId }) => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Pathways Licensure & Type Rating</h1>
                <p className="text-slate-400 text-sm">Advanced training and certification programs</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-slate-400">Certified Training Centers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!selectedCard ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {licensureCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleCardClick(card.id)}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all cursor-pointer hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className="relative h-48">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold">{card.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-slate-300 text-sm mb-4">{card.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{card.locations[0]}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{card.duration}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCard}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {(() => {
                const card = licensureCards.find(c => c.id === selectedCard);
                if (!card) return null;
                return (
                  <>
                    {/* Back Button */}
                    <button
                      onClick={() => setSelectedCard(null)}
                      className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>Back to all programs</span>
                    </button>

                    {/* Card Detail */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700">
                      <div className="relative h-64 md:h-80">
                        <img
                          src={card.image}
                          alt={card.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h2 className="text-3xl font-bold mb-2">{card.name}</h2>
                          <p className="text-slate-300">{card.description}</p>
                        </div>
                      </div>
                      <div className="p-6 space-y-6">
                        {/* Quick Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-slate-700/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-blue-400 mb-2">
                              <DollarSign className="w-5 h-5" />
                              <span className="text-sm font-medium">Cost</span>
                            </div>
                            <p className="text-white font-semibold">{card.salary}</p>
                          </div>
                          <div className="bg-slate-700/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-green-400 mb-2">
                              <Clock className="w-5 h-5" />
                              <span className="text-sm font-medium">Duration</span>
                            </div>
                            <p className="text-white font-semibold">{card.duration}</p>
                          </div>
                          <div className="bg-slate-700/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-purple-400 mb-2">
                              <Award className="w-5 h-5" />
                              <span className="text-sm font-medium">Certification</span>
                            </div>
                            <p className="text-white font-semibold text-sm">{card.certification}</p>
                          </div>
                          <div className="bg-slate-700/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-orange-400 mb-2">
                              <MapPin className="w-5 h-5" />
                              <span className="text-sm font-medium">Locations</span>
                            </div>
                            <p className="text-white font-semibold text-sm">{card.locations.length}+</p>
                          </div>
                        </div>

                        {/* Requirements */}
                        <div>
                          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <GraduationCap className="w-6 h-6 text-blue-400" />
                            Requirements
                          </h3>
                          <div className="space-y-2">
                            {card.requirements.map((req, idx) => (
                              <div key={idx} className="flex items-center gap-3 bg-slate-700/30 rounded-lg p-3">
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span className="text-slate-300">{req}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Locations */}
                        <div>
                          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <MapPin className="w-6 h-6 text-orange-400" />
                            Training Locations
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {card.locations.map((loc, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-slate-700/50 rounded-full text-sm text-slate-300"
                              >
                                {loc}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* CTA */}
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                          Learn More & Apply
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default LicensureTypeRatingPage;
