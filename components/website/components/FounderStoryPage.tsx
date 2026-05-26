import React from 'react';
import { TopNavbar } from './TopNavbar';

interface FounderStoryPageProps {
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const FounderStoryPage: React.FC<FounderStoryPageProps> = ({ onNavigate, onLogin }) => {
    return (
        <div className="min-h-screen bg-white">
            <TopNavbar
                onNavigate={onNavigate}
                onLogin={onLogin}
                forceScrolled={true}
                currentPage="founder-story"
            />

            {/* Hero */}
            <div className="bg-black pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black opacity-90" />
                <div className="relative max-w-4xl mx-auto text-center">
                    <p className="text-red-500 text-[0.65rem] font-black uppercase tracking-[0.3em] mb-4">Founder's Story</p>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-tight mb-6">
                        The Gate Was Locked.<br />
                        <span className="text-red-500">So We Built A Door.</span>
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
                        Benjamin Tiger Bowler — Founder, PilotRecognition.com
                    </p>
                    <div className="mt-8 w-16 h-0.5 bg-red-600 mx-auto" />
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 py-20">
                <div className="prose prose-slate max-w-none space-y-16">

                    <Section title="The $250,000 That Never Came Back">
                        <p>The first time aviation took something from our family, I was 15.</p>
                        <p>My father had a vision. He invested $250,000 USD into a skydiving business — a real opportunity in aviation, the industry he believed in. An investor scammed him. The money was gone completely. Not reduced, not delayed — gone. It took years of legal battles, case after case, chasing the man across jurisdictions, fighting for what was rightfully ours. We eventually won in court. But the money was never found. Never returned.</p>
                        <p>It was the first time I saw my father cry.</p>
                        <p>Aviation — the dream, the industry, the thing that was supposed to be the investment of a lifetime — had taken everything from him. And it left a mark on our family that didn't fade.</p>
                        <p>We relocated to Dubai. My father, who had nothing left from that chapter, rebuilt himself from scratch. He started a quantity surveying firm. He worked. He recovered. He turned out alright — not because the industry gave him anything back, but because he refused to let it define him.</p>
                        <p>That is the man I grew up watching. That is the man I had to sit across from, years later, and say: <em>I want to train as a pilot. I want to fly. I need your help.</em></p>
                        <p className="font-semibold text-slate-700">I don't know how he said yes. I am still not sure what it cost him.</p>
                    </Section>

                    <Divider />

                    <Section title="Mount Everest and a Stranger's Advice">
                        <p>Summer 2022. I was at Mount Everest — at base camp, standing in one of the most extreme places a person can stand — when a helicopter pilot struck up a conversation with me.</p>
                        <p>He told me the Philippines was one of the best places in the world for affordable, quality flight training. The weather. The airspace. The schools. The cost compared to Europe or the US.</p>
                        <p>I filed it away. Then I went home and I couldn't stop thinking about it.</p>
                        <p>I researched flight schools in the Philippines. I built a case. And then I did the hardest thing I have ever done: I went back to my father — the man who had already lost $250,000 to aviation — and asked him to invest $50,000 more.</p>
                        <p>I told him the course would take one year. I told him I had a plan. I told him this was different.</p>
                        <p className="font-semibold text-slate-700">He said yes. And I flew to the Philippines.</p>
                    </Section>

                    <Divider />

                    <Section title="The Three Years Nobody Warned Me About">
                        <p>The course was supposed to take one year.</p>
                        <p className="font-bold text-black text-lg">It took three.</p>
                        <p>I trained. I accumulated hours. I sat exams. I built skills in conditions that tested everything I had — weather, airspace, equipment, heat, fatigue. I earned my Commercial Pilot License. CAAP-issued. Stamped. Valid. A CPL — the qualification that is supposed to open the door to a professional aviation career.</p>
                        <p className="font-semibold text-slate-700">And then I found out about the queue.</p>
                        <p>Not a short queue. Not a manageable queue. My flight school alone had more than 3,000 applicants waiting for flight instructor positions. A three-year waiting list for a role that barely pays enough to live on. And then the detail that stopped me cold: my school didn't even accept their own fast-track graduates for those positions. Only their cadets — their own internal full-program graduates — were considered. I had done everything right, by every external measure, and the school that trained me had already quietly decided I didn't qualify for their next step.</p>
                        <p className="font-black text-black">I graduated with a CPL, the best flyer award in my graduating cohort, and no placement.</p>
                        <p>$50,000 spent. Three years of my life gone. And every morning, the same weight: <em>did I just do this to my father for nothing? Did I just become another pilot with a license he can't use?</em></p>
                        <p>The next three years were not training. They were survival. Market research. Endless conversations with aviation people across the industry — instructors, recruiters, HR directors, airline captains, flight school managers. I was trying to understand the system I had walked into without a map.</p>
                        <p className="font-semibold text-slate-600 italic">Most of what I found was the same story, told by different people, at different stages of the same queue.</p>
                    </Section>

                    <Divider />

                    <Section title="What Aviation Actually Feels Like From the Inside">
                        <p>Before I describe what I built, I want to describe what I lived.</p>
                        <p>I have experienced an engine fire at 200 feet during takeoff. I have flown through cockpit smoke. I have been on final approach when another aircraft appeared 300 feet above me — an uncoordinated conflict that had no business happening and that I had no warning of.</p>
                        <p>None of those incidents appeared on any airline's pre-screening form. None of them counted as experience in any measurable way. They were just part of the three years.</p>
                        <p>You do not think about verified credentials at 200 feet with an engine fire. You think about your training. You think about whether the hours you logged were real, whether the drills you ran held, whether the person who signed off your emergency procedures training actually prepared you for a moment like this.</p>
                        <p>Those incidents made me understand something no classroom teaches: the pilots who stay in aviation through the hard years, through the waiting, through the near-misses and the debt and the invisible queue — those pilots deserve an industry that sees them. That respects what they went through to get here.</p>
                        <p className="font-black text-black">I was the best flyer in my cohort. I had certificates, ratings, and a CPL issued by the Civil Aviation Authority of the Philippines.</p>
                        <p className="font-black text-red-600">And I was invisible to the industry I had bled for.</p>
                    </Section>

                    <Divider />

                    <Section title="The Denial">
                        <p>There was a period — a real, extended period — when I couldn't accept what was happening.</p>
                        <p>I was a failed pilot. That is the language my mind used. A pilot who couldn't find a career. A person who had taken his father's money and produced nothing with it. Someone who owed a debt he couldn't repay.</p>
                        <p>I would sit with it and argue with myself. The license was real. The hours were real. The training was legitimate. I had won the best flyer award. I had survived things in the air that would have ended less prepared pilots. How could any of that be worthless?</p>
                        <p>But worthless is what it felt like when the answer is always the same: <em>come back with 1,500 hours. Come back when you have a type rating. Come back when you have connections. Come back later.</em></p>
                        <p>I looked at other careers. Seriously looked. My father's profession — quantity surveying — had a clear pathway. Construction management. A degree that leads somewhere measurable. I looked at it the way you look at an escape hatch: not because you want it, but because you can't keep staring at the door that won't open.</p>
                        <p className="font-semibold text-slate-700">Then my father mentioned an event.</p>
                        <p className="text-lg font-black text-black">The Dubai Aviation Career Fair. 21st January 2026.</p>
                        <p className="italic text-slate-600">"Go," he said. "Go and get your answers. See what's actually out there."</p>
                    </Section>

                    <Divider />

                    <Section title="The Gate">
                        <p className="font-bold text-black text-lg">I flew 4,000 miles to get there.</p>
                        <p>The night before I arrived in Dubai, I got a rejection email. The career fair was not admitting pilots without the right access credentials. I had come all this way, and they were telling me I couldn't come in.</p>
                        <p className="font-bold text-slate-800">I went anyway.</p>
                        <p>I stood outside the gate in the desert heat — January, but this is Dubai, the sun is relentless — with a rejection email open on my phone, looking at the entrance to an event that was supposed to have the answers I had spent three years looking for. There were other pilots around me. We all had the same look. We were all reading the same email.</p>
                        <p>They let us in eventually. After a long wait. After enough of us stood there long enough.</p>
                        <p>I walked straight to the first major airline career stall. CPL in hand. License current. 200 hours.</p>
                        <blockquote className="border-l-4 border-red-500 pl-6 py-2 bg-red-50 rounded-r-lg">
                            <p className="text-red-700 font-semibold italic">"Sorry — you know the requirements. Fifteen hundred hours minimum. Come back when you have that."</p>
                        </blockquote>
                        <p>They handed me a QR code.</p>
                        <p>A QR code. That was the answer to three years, $50,000, and 4,000 miles. Scan this. Join the digital waiting room. Go home.</p>
                        <p>I scanned it. I looked around. I was surrounded by hundreds of pilots in exactly my position. Educated. Trained. Qualified by every standard the industry claimed to require — and completely invisible. Everyone in that room had a story. Everyone had debt. Everyone had flown through something real to stand here, only to be handed a QR code and told to wait.</p>
                        <p className="font-bold text-slate-800">I decided to change my approach.</p>
                        <p>I stopped presenting myself as a pilot looking for a job. I started moving through the fair as someone speaking on behalf of pilots — asking the airlines a different question: <em>How do pilots understand what you actually need? How do they align themselves to your specific requirements before they walk in your door?</em></p>
                        <p>The reaction was immediate and complete. Smiles appeared. Water bottles materialised. People leaned forward. The conversation changed from a transaction to a genuine discussion about a problem the airlines also felt.</p>
                        <p className="font-semibold text-slate-700">They didn't have a good answer either. They were working with the same broken system from the other side of it.</p>
                        <p>That was the moment I understood the real problem.</p>
                        <div className="bg-black text-white rounded-xl p-6 my-6">
                            <p className="text-red-400 text-[0.65rem] font-black uppercase tracking-[0.2em] mb-2">The Root Cause</p>
                            <p className="text-white font-bold text-lg leading-relaxed">It wasn't a pilot shortage. It was a <span className="text-red-400">7600</span> — a complete radio failure. Pilots couldn't transmit. Airlines couldn't receive. The whole industry was operating on a frequency where the two sides of a critical communication couldn't hear each other.</p>
                        </div>
                        <p>I flew home from Dubai knowing exactly what had to be built.</p>
                    </Section>

                    <Divider />

                    <Section title="Daniel's Phone Call">
                        <p>Before I describe what I built, I need to tell you about Daniel.</p>
                        <p>Daniel is my friend. He did everything right by every measure the industry offers. He is self-funded — no scholarships, no cadet programs, no institutional pathway. He accumulated 700 hours of flight time. He invested more than $150,000 USD of his own money and his own time into a career in aviation.</p>
                        <p className="font-bold text-slate-800">Daniel's father signs aircraft engine certifications for international airlines. He has connections in the industry that most pilots spend their entire careers trying to build.</p>
                        <p>700 hours. $150,000. Industry connections most pilots would sacrifice everything for.</p>
                        <p className="font-black text-red-600 text-lg">Still nothing.</p>
                        <p>Daniel called me.</p>
                        <blockquote className="border-l-4 border-slate-800 pl-6 py-2 bg-slate-50 rounded-r-lg">
                            <p className="text-slate-700 font-semibold italic">"I quit flying. If I don't stop now I will never return on my investment."</p>
                        </blockquote>
                        <p>I have heard a lot of things in aviation that hurt. That was the one that changed everything.</p>
                        <p>If Daniel — with everything he had, with the connections, with the hours, with the investment — could reach the conclusion that quitting was the rational decision, then the problem was not the individual pilots. The problem was structural. And every pilot who couldn't navigate it was going to make the same calculation Daniel made: <em>the investment will never return. Walk away.</em></p>
                        <p className="font-semibold text-slate-700">There are pilots right now, reading this, who are having that conversation with themselves.</p>
                        <p>The industry calls it a pilot shortage. The pilots are right there.</p>
                        <p className="font-black text-black">After Daniel's call, I had one answer. The problem was structural. And I was going to fix it.</p>
                    </Section>

                    <Divider />

                    <Section title="Zero Coding Experience">
                        <p>I want to be clear about where I started.</p>
                        <p className="font-black text-black text-lg">I had never written a single line of code in my life.</p>
                        <p>I opened Google AI Studio one day and started asking questions. I described what I wanted to build: a platform where pilots could store their verified credentials, where operators could see them, where the communication gap I had identified at the career fair could be bridged with real data instead of QR codes.</p>
                        <p>The AI helped me build it. Step by step. I asked questions I didn't have the vocabulary for. I made mistakes I didn't understand. I fixed them and made new ones. But the thing I had going for me was the same thing that kept me standing outside that gate in the desert: I genuinely did not know what was supposed to be impossible.</p>
                        <p className="italic text-slate-600">I didn't know that what I was building — a cryptographic credential wallet, a consent-based engagement system, a multi-provider verification relay, a dual-log mentorship fraud detection system — was the kind of architecture that typically requires a team of engineers with years of experience.</p>
                        <p className="font-bold text-slate-800">I just built it, piece by piece, because nobody told me I couldn't.</p>
                        <p>Almost a year after that first session, I am working in Windsurf with API integrations running, three production databases deployed across Asia-Pacific, a working cryptographic wallet, real meetings with Veremark, and a team of pilots — Karl, Kiev, Daniel, Sebastian — all of them people who lived this problem and chose to help solve it.</p>
                        <p className="font-semibold text-slate-700">On Sundays, when my colleagues are in church, I am at my laptop. Not because I have nothing else to do. Because I have never been more certain that I am doing the right thing.</p>
                    </Section>

                    <Divider />

                    <Section title="The Airbus Certificate">
                        <p>At the Dubai career fair, in the middle of the day, I met the Airbus head of EBT CBTA.</p>
                        <p>EBT — Evidence Based Training. CBTA — Competency Based Training and Assessment. The internationally recognised standard for how airlines evaluate pilot readiness. The methodology I had already decided to build into PilotRecognition's program framework.</p>
                        <p className="font-bold text-slate-800">He had worked for Air Mauritius.</p>
                        <p>I am Mauritian. Half British. Born into a family that had carried aviation — its promise and its grief — since I was 15 years old.</p>
                        <p>I happened to have with me that day an Airbus Little Engineer certificate. A program I attended when I was 14 years old. A child's certificate from a day at an Airbus event that I had never thrown away.</p>
                        <p>Out of every airline, every operator, every organisation represented at that fair — the one man whose professional life connected to EBT CBTA had worked for the one airline in the world named after the island I come from.</p>
                        <div className="bg-slate-900 text-white rounded-xl p-6 my-6">
                            <p className="text-slate-400 text-[0.65rem] font-black uppercase tracking-[0.2em] mb-2">The Moment</p>
                            <p className="text-white font-semibold leading-relaxed">I cannot explain that logically. I choose not to. What I know is that I was supposed to be in that room. That the rejection email the night before was not the end of the story. That the hours standing in the heat outside the gate were part of getting to that conversation.</p>
                        </div>
                        <p className="font-black text-black text-lg">That is the moment I stopped asking whether this was the right thing to do.</p>
                    </Section>

                    <Divider />

                    <Section title="What PilotRecognition Actually Is">
                        <p>PilotRecognition.com is not a recruitment platform.</p>
                        <p>It is not a job board. It is not a database that airlines search. It is not another QR code.</p>
                        <p>It is the infrastructure that should have existed before I flew 4,000 miles to stand in the desert holding a rejection email. It is the system that should have existed before Daniel spent $150,000 and called me to say he was quitting.</p>
                        <p>It is built on a simple principle: a pilot's credentials belong to the pilot. Not to the flight school. Not to the airline. Not to the platform. The pilot controls who sees their verified record, when, and for what purpose.</p>
                        <p>The pathway cards are not job listings. They are requirements posted by operators — specific, transparent, honest about what it takes to qualify — so that a 200-hour pilot standing at a career fair stall can know exactly what they need to build before they show up. No more QR codes. No more <em>come back with 1,500 hours</em> with no further information.</p>
                        <p className="font-black text-black">The platform is built by pilots who lived the problem from the inside.</p>
                        <p>We are not consultants who studied aviation from a distance.</p>
                        <p className="font-black text-red-600 text-lg">We are the pilots. And we have been waiting for this platform to exist for years.</p>
                    </Section>

                    <Divider />

                    <Section title="Why This Exists">
                        <p>My father has watched aviation take from our family twice.</p>
                        <p>$250,000 to a scammer. $50,000 to a training system that had no guaranteed path forward at the end of it. And then, after all of that, a son who said: <em>I'm going to solve this. I'm going to build the platform that fixes it.</em></p>
                        <p className="font-semibold text-slate-700">He sees me differently now than he did in the denial years. Not as a failed pilot. As someone who went through the hardest version of a real problem and came out of it with a solution instead of a resignation letter.</p>
                        <p>The pilots who were standing outside that gate in Dubai are still standing in that same queue. The pilots in their third year of a one-year course are still counting hours that nobody can see. The Daniels of this industry — 700 hours, $150,000, every connection available — are still running the same calculation: <em>will this ever return?</em></p>
                        <p>PilotRecognition exists to change that calculation. Not by lowering the bar. By making the bar visible — so that every pilot knows exactly where they stand, what they need to build, and what the pathway forward actually looks like.</p>
                        <p className="font-black text-black text-lg">The gate was locked for too long. We built a door.</p>
                        <p className="font-semibold text-slate-700">That is the only reason this platform exists. And it is reason enough.</p>

                        <div className="mt-12 bg-black rounded-2xl p-8 text-center">
                            <p className="text-slate-400 text-[0.65rem] font-black uppercase tracking-[0.3em] mb-4">The Mission</p>
                            <p className="text-white text-2xl md:text-3xl font-black leading-tight">The gate was locked.</p>
                            <p className="text-red-500 text-2xl md:text-3xl font-black leading-tight">So we built a door.</p>
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-200">
                            <p className="text-slate-500 text-sm font-medium">Benjamin Tiger Bowler</p>
                            <p className="text-slate-400 text-sm">Founder, PilotRecognition.com</p>
                            <p className="text-slate-400 text-sm">Dubai, UAE — May 2026</p>
                        </div>
                    </Section>

                </div>
            </div>
        </div>
    );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section>
        <h2 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tight mb-6 pb-3 border-b-2 border-red-600">
            {title}
        </h2>
        <div className="space-y-4 text-slate-700 leading-relaxed text-base md:text-lg">
            {children}
        </div>
    </section>
);

const Divider: React.FC = () => (
    <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-slate-200" />
        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
        <div className="flex-1 h-px bg-slate-200" />
    </div>
);
