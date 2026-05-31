'use client';

import { AlertTriangle, Clock, DollarSign, Users, BookOpen, Shield, Plane } from 'lucide-react';

export default function ALPACounterPosition() {
  return (
    <div className="bg-white">
      {/* Header Section */}
      <div className="bg-[#1e3a5f] text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#c41e3a] rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wider text-gray-300">
              Policy Position
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            We Support Safety.
            <br />
            <span className="text-[#c41e3a]">We Oppose Arbitrary Barriers.</span>
          </h1>
          
          <p className="text-xl text-gray-300 leading-relaxed">
            The 1,500-hour rule was created with good intentions after the Colgan Air tragedy. 
            But 15 years later, it has created a humanitarian crisis—not a safety revolution.
          </p>
        </div>
      </div>

      {/* The Uncomfortable Truth */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-[#c41e3a]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-[#c41e3a]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">
                  The Uncomfortable Truth About the 1,500-Hour Rule
                </h2>
                <p className="text-gray-600">
                  What ALPA won't tell you: the rule they defend is destroying the same pilots they claim to represent.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="font-bold text-[#1e3a5f] uppercase tracking-wider text-sm border-b border-gray-200 pb-2">
                  What ALPA Says
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-xs font-bold">✓</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      "The 1,500-hour rule has created the safest period in aviation history."
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-xs font-bold">✓</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      "We cannot compromise on safety to solve staffing challenges."
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-xs font-bold">✓</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      "The Colgan Air victims deserve this protection."
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-bold text-[#c41e3a] uppercase tracking-wider text-sm border-b border-gray-200 pb-2">
                  What The Data Shows
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#c41e3a]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#c41e3a] text-xs font-bold">✗</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      <strong>Zero correlation:</strong> No fatal crashes involved graduates of structured training programs. The rule targets the wrong problem.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#c41e3a]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#c41e3a] text-xs font-bold">✗</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      <strong>Real safety issues ignored:</strong> Fatigue, training quality, and crew resource management—actual factors in the Colgan crash—remain inadequately addressed.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#c41e3a]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#c41e3a] text-xs font-bold">✗</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      <strong>Humanitarian crisis:</strong> 15,000+ pilots with $50K-$200K debt, stranded for 2-4 years, unable to work in their trained profession.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Four Stats */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-[#1e3a5f] mb-12">
            The True Cost of the 1,500-Hour Barrier
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-[#c41e3a]/5 border border-[#c41e3a]/20 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-[#c41e3a] rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-[#c41e3a] mb-2">2-4 Years</div>
              <div className="text-gray-600 text-sm">Average time spent "building hours" without income</div>
            </div>
            
            <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-[#1e3a5f] rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-[#1e3a5f] mb-2">$150K-$200K</div>
              <div className="text-gray-600 text-sm">Average debt with no pathway to repayment</div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-amber-600 mb-2">15,000+</div>
              <div className="text-gray-600 text-sm">Pilots stranded in the hour-building trap</div>
            </div>
            
            <div className="bg-gray-100 border border-gray-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-700 mb-2">500-1,500</div>
              <div className="text-gray-600 text-sm">Hours of often meaningless flying (traffic patterns, joy rides)</div>
            </div>
          </div>
        </div>
      </div>

      {/* What Colgan Air Actually Revealed */}
      <div className="py-16 bg-[#1e3a5f] text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            What the Colgan Air Crash Actually Revealed
          </h2>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 mb-8">
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              The 2009 Colgan Air Flight 3407 tragedy killed 50 people. The NTSB investigation revealed 
              the actual causes—none of which are addressed by the 1,500-hour rule:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#c41e3a] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Pilot Fatigue</h4>
                    <p className="text-gray-400 text-sm">The captain had commuted across the country overnight. She was exhausted—not inexperienced.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#c41e3a] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Inadequate Training</h4>
                    <p className="text-gray-400 text-sm">The captain failed multiple checkrides before passing. The system allowed marginal pilots through.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#c41e3a] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Crew Resource Management</h4>
                    <p className="text-gray-400 text-sm">The first officer failed to challenge the captain's errors—a training issue, not an hours issue.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#c41e3a] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Airline Oversight</h4>
                    <p className="text-gray-400 text-sm">Colgan Air's operational culture prioritized schedule over safety. A systemic failure.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xl text-[#c41e3a] font-bold">
              The 1,500-hour rule addresses none of these actual causes.
            </p>
          </div>
        </div>
      </div>

      {/* The European Alternative */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a5f]">
              The European Model: Quality Over Quantity
            </h2>
          </div>
          
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-8 mb-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              EASA (European Aviation Safety Agency) operates a multi-license system that prioritizes
              <strong> structured competency</strong> over raw hour-counting:
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="text-blue-600 font-bold text-lg mb-2">CPL</div>
                <div className="text-sm text-gray-600">200 hours + 14 exams</div>
                <div className="text-xs text-gray-500 mt-2">Entry-level commercial</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="text-blue-600 font-bold text-lg mb-2">ATPL</div>
                <div className="text-sm text-gray-600">Frozen → Unfrozen with airline training</div>
                <div className="text-xs text-gray-500 mt-2">Airline transport license</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="text-blue-600 font-bold text-lg mb-2">Type Rating</div>
                <div className="text-sm text-gray-600">Airline-sponsored, aircraft-specific</div>
                <div className="text-xs text-gray-500 mt-2">Operator investment</div>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-6">
            <p className="text-amber-800">
              <strong>Result:</strong> European pilots enter airline cockpits with 200-250 hours of 
              <em> structured, high-intensity training</em>, followed by airline-specific type rating 
              and line-oriented flight training (LOFT). No "hour building" purgatory. No $200K debt 
              with no income.
            </p>
          </div>
        </div>
      </div>

      {/* PSA's Position */}
      <div className="py-16 bg-[#c41e3a]">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            The PSA Position
          </h2>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8 text-left mb-8">
            <p className="text-white text-lg leading-relaxed mb-6">
              We are not advocating for reduced safety. We are advocating for 
              <strong> intelligent pathways</strong> that maintain—or exceed—current safety standards 
              while respecting the humanity of the pilots caught in this trap.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#c41e3a] text-xs font-bold">✓</span>
                </div>
                <p className="text-white">
                  <strong>Replace hour-counting with competency-based progression.</strong> Structured,
                  high-intensity programs beat unstructured joy rides.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#c41e3a] text-xs font-bold">✓</span>
                </div>
                <p className="text-white">
                  <strong>Airline-sponsored pathways.</strong> Airlines invest in training; pilots 
                  commit to service. European model proven for decades.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#c41e3a] text-xs font-bold">✓</span>
                </div>
                <p className="text-white">
                  <strong>Address actual safety factors.</strong> Fatigue rules. CRM training. 
                  Airline oversight. Not arbitrary hour gates.
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-white/80 text-lg">
            The pilots on our platform are not unsafe. They are 
            <span className="text-white font-bold">unemployed</span>.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] mb-4">
            Your Story Is The Evidence
          </h2>
          <p className="text-gray-600 mb-8">
            ALPA claims to speak for pilots. But they don't speak for the 15,000+ stranded aviators 
            drowning in debt with no pathway forward. Share your experience. Make your voice count.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#share-story"
              className="inline-flex items-center justify-center gap-2 bg-[#c41e3a] hover:bg-[#a31830] text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
            >
              Share Your Story
            </a>
            <a
              href="#verify"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#1e3a5f] font-bold py-4 px-8 rounded-lg transition-colors text-lg border-2 border-[#1e3a5f]"
            >
              Verify Credentials
            </a>
          </div>
          
          <p className="text-gray-400 text-sm mt-6">
            Free membership. Identity protected. Verified pilots only.
          </p>
        </div>
      </div>
    </div>
  );
}
