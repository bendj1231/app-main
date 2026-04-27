import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, GraduationCap, Plane, DollarSign, MapPin, Award, CheckCircle, Clock, Users } from 'lucide-react';

interface CommercialPilotPathwayPageProps {
  onBack: () => void;
  pathwayId?: string;
}

const CommercialPilotPathwayPage: React.FC<CommercialPilotPathwayPageProps> = ({ onBack, pathwayId }) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const commercialCards = [
    {
      id: 'cpl-training',
      name: 'CPL Training',
      description: 'Complete Commercial Pilot License training program. Build advanced flying skills, instrument proficiency, and multi-engine experience for professional aviation careers.',
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
      locations: ['Global', 'USA', 'Europe', 'Asia'],
      salary: '$20,000 - $40,000',
      requirements: ['PPL + ME/IR', '200+ hrs TT', 'Class 1 Medical'],
      duration: '8-16 weeks',
      certification: 'Commercial Pilot License',
    },
    {
      id: 'multi-engine-rating',
      name: 'Multi-Engine Rating',
      description: 'Add multi-engine capabilities to your commercial pilot license. Learn complex aircraft systems, engine-out procedures, and advanced multi-engine operations.',
      image: 'https://thumbs.dreamstime.com/b/cessna-caravan-14103370.jpg',
      locations: ['Global', 'USA', 'Europe'],
      salary: '$5,000 - $10,000',
      requirements: ['PPL or CPL', 'Single Engine Experience', 'Class 2 Medical'],
      duration: '4-8 weeks',
      certification: 'Multi-Engine Rating',
    },
    {
      id: 'instrument-rating',
      name: 'Instrument Rating',
      description: 'Earn your Instrument Rating for commercial operations. Master IFR procedures, approaches, and all-weather flying capabilities essential for airline pilots.',
      image: 'https://i.ytimg.com/vi/ApAGDJGhSag/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCEJ3oeB8h0vSy8q8KxGx-OWp1f-A',
      locations: ['Global', 'USA', 'Europe'],
      salary: '$10,000 - $18,000',
      requirements: ['PPL or CPL', '50+ hrs Cross-Country', 'Class 2 Medical'],
      duration: '6-8 weeks',
      certification: 'Instrument Rating Certificate',
    },
    {
      id: 'atpl-theory',
      name: 'ATPL Theory',
      description: 'Complete Airline Transport Pilot License theory training. Study advanced aviation subjects including meteorology, navigation, flight planning, and aircraft systems.',
      image: 'https://www.wingpath.in/blog_images/what-is-atpl-in-india-6ihgy-1000x700.png',
      locations: ['Global', 'USA', 'Europe', 'Asia'],
      salary: '$5,000 - $15,000',
      requirements: ['CPL + ME/IR', '150+ hrs TT'],
      duration: '6-12 months',
      certification: 'ATPL Theory Certificate',
    },
    {
      id: 'type-rating',
      name: 'Type Rating',
      description: 'Specialized training on specific aircraft types (A320, B737, etc.). Required for airline operations with advanced simulator training and aircraft systems knowledge.',
      image: 'https://www.caepacific.com/wp-content/uploads/2021/03/CAE-Philippines-Training-Center.jpg',
      locations: ['Global', 'USA', 'Europe', 'Asia'],
      salary: '$15,000 - $40,000',
      requirements: ['CPL + ME/IR', '500+ hrs TT', 'ATPL Theory'],
      duration: '4-8 weeks',
      certification: 'Type Rating Certificate',
    },
    {
      id: 'airline-interview-prep',
      name: 'Airline Interview Prep',
      description: 'Comprehensive preparation for airline pilot interviews. Technical knowledge assessment, simulator evaluation, and HR interview coaching for major airlines.',
      image: 'https://media.pea.com/wp-content/uploads/2023/06/flight-instructor-training-1024x607.jpeg',
      locations: ['Global', 'USA', 'Europe'],
      salary: '$1,000 - $3,000',
      requirements: ['CPL + ME/IR', '500+ hrs TT'],
      duration: '1-2 weeks',
      certification: 'Interview Preparation Certificate',
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
                <h1 className="text-2xl font-bold">Commercial Pilot Pathway</h1>
                <p className="text-slate-400 text-sm">Professional aviation training and certification</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-slate-400">Certified Training Programs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!selectedCard ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commercialCards.map((card, index) => (
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
                const card = commercialCards.find(c => c.id === selectedCard);
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

export default CommercialPilotPathwayPage;
