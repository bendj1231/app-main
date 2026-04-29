import React from 'react';
import { ArrowLeft, BookOpen, Shield } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { sanitizeHtml } from '@/src/lib/sanitize-html';

interface TechnicalIndexPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const TechnicalIndexPage: React.FC<TechnicalIndexPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    const aboutSections = [
        {
            category: "Foundation Program - Competency Development ($49)",
            content: [
                {
                    title: "Program Overview",
                    description: "The Foundation Program provides competency development aligned with Airbus EBT CBTA 9 core competencies: Situational Awareness, Decision Making, Communication, Leadership & Teamwork, Workload Management, Application of Procedures, Flight Path Management, Knowledge, and Automation Management. This is your first step toward building a credible and recognized pilot profile with competency-based assessment. 10% of spots are free scholarships for pilots who can't pay."
                },
                {
                    title: "The Context - The Pilot Gap",
                    description: "Understand the pilot gap through Module 1, which contains 5 chapters addressing the issues facing the current industry. The content is based on collaborative research and independent journalism within the aviation industry. You will learn about <strong>AIRBUS EBT CBTA core principles</strong> and how they align with the industry, understand pilot risk management, access a database of investment case studies of type ratings, and learn about pilot decision making (ADM)."
                },
                {
                    title: "W1000 Access - Application Access",
                    description: "Prior to your examination, you will receive access to the <strong>W1000 application</strong>—a state-of-the-art software for pilot development featuring examination practice, core material for PPL, CPL, IR, and ME, examination reviewers, PowerPoint slides, video content, POH handbooks, an IFR Jeppesen Charts database, and IFR simulators. The Apps serve as a practical examination terminal for exam preparation. The Black Box contains PowerPoint presentations, core material, and the Simulator Room, which offers IFR simulation for practicing VOR homing, ILS landing approaches, G1000 system practice, and flight plan navigation. The official examination will take place on pilotrecognition.com in the examinations portal."
                },
                {
                    title: "Examination",
                    description: "Your first examination evaluates how well you know the industry and the chapters you have read. The initial pilot licensure examination uses integrated <strong>Gleims software</strong> for FAA/CAAP examinations. This examination will provide your first competency score, identifying areas where you are struggling and highlighting weaknesses based on recurrency through monthly examinations to stay current before Mentorship. This will also create the first imprint on your <strong>PilotRecognition profile</strong>—you may check the examination results as well as your competency score."
                },
                {
                    title: "Evidence-Based Mentorship (50 Hours)",
                    description: "After your initial examination is complete, you will receive mentor modules to observe, learn, and view masterclasses on how to mentor fellow aviators. Mentorship is an evidence-based approach with competency observation—mentors who have completed 20 hours of observation and passed their practical examination become missionaries who provide guidance and support to fellow members and pilots within the community. For your mentorship to be logged, your mentee must create an account through pilotrecognition.com, enabling you to access their profile and log their mentor ID. The mentee will receive a mentored hours count and a verified logbook of mentored hours. If you have received mentored hours, you will be required to complete only 40 hours of mentorship. We also provide checkride practice where you will be tested on your knowledge—great for checkride preparation. The <strong>EBT CBTA Application</strong> focuses on evidence-based training for decision making, testing your ability to handle emergency situations and visual awareness with eye tracking to verify instrument scanning. VFR simulation is available for PPL students who want to master the basics of traffic patterns, radio communication, visual landing scenarios, and more."
                },
                {
                    title: "Competency Evaluation",
                    description: "An evaluation based on an Airbus EBT-aligned evaluation of your pilot development and initial pilot recognition portfolio, along with a certificate of achievement. Once received initial pilot recognition, you may access pathway cards—not job listings. Pathway cards show requirements and what you're missing. Compare your recognition credentials within our network, access cadet programmes, cargo pathways, licensure & type rating pathways, and specialized pathways aligned with your verified competencies. Completing the Foundation Program gives you 50% discount on the Transition Program."
                }
            ]
        },
        {
            category: "Transition Program - Industry Readiness ($299, $149 with Foundation discount)",
            content: [
                {
                    title: "Program Overview",
                    description: "The Transition Program provides industry readiness with full EBT CBTA assessment for pilots transitioning from graduate flight school to airline environment. Includes 9 core competencies full implementation, Airbus HINFACT applications, ATLAS Aviation CV formatting, EBT video assessment with behavioral markers and cognitive indicators evaluation, internship, and competency verification. Foundation graduates receive 50% discount ($149 effective price)."
                },
                {
                    title: "EBT CBTA Full Assessment",
                    description: "Full implementation of the 9 core competencies: Situational Awareness, Decision Making, Communication, Leadership & Teamwork, Workload Management, Application of Procedures, Flight Path Management, Knowledge, and Automation Management. This comprehensive assessment demonstrates your competency readiness for airline operations."
                },
                {
                    title: "Airbus HINFACT Integration",
                    description: "Integration with Airbus HINFACT EBT CBTA Software, the official EBT CBTA assessment tool used by airlines worldwide. This provides formal competency assessment aligned with industry standards and enhances your credibility with operators."
                },
                {
                    title: "ATLAS Aviation CV Formatting",
                    description: "Your profile is formatted according to ATLAS Aviation CV standards, the globally recognized ATS (Applicant Tracking System) format used by airlines and operators worldwide. This ensures your profile meets industry recruitment standards."
                },
                {
                    title: "EBT Video Assessment",
                    description: "Recorded interview after 50-hour mentorship with behavioral markers and cognitive indicators evaluation. Airlines can view your interview to assess communication skills, professional demeanor, and presentation style alongside your competency score. Plan to approach Airbus for verification/certification."
                },
                {
                    title: "Internship & Competency Verification",
                    description: "Complete an internship with our pathway providers (airlines, operators, manufacturers, ATOs) along with PilotRecognition.com to apply your competencies in real-world scenarios. Receive competency verification that demonstrates your professional readiness to operators. This verification is recognized by industry partners and enhances your pathway matching."
                }
            ]
        },
        {
            category: "For Operators, Manufacturers & ATOs",
            content: [
                {
                    title: "The Recruitment Efficiency Problem",
                    description: "Operators invest significant resources in recruitment and training. Traditional application processes provide limited visibility into candidate <strong>competency readiness</strong>. Hours and type ratings indicate technical qualifications but not the 9 core competencies: Situational Awareness, Decision Making, Communication, Leadership & Teamship, Workload Management, Application of Procedures, Flight Path Management, Knowledge, and Automation Management. This information gap leads to higher training failure rates and increased recruitment costs. PilotRecognition addresses this by providing verified competency profiles that demonstrate actual professional capabilities through <strong>EBT CBTA aligned assessments</strong> and <strong>50 hours of evidence-based mentorship</strong>."
                },
                {
                    title: "The Data Limitation",
                    description: "Current recruitment data sources focus on technical metrics: flight hours, aircraft types, license ratings. These metrics do not indicate whether candidates possess the <strong>EBT awareness</strong>, <strong>CRM competence</strong> (Communication component), and competency alignment required for specific operations. Operators lack objective data on competency readiness before investment in assessment and training. PilotRecognition provides verified competency data before recruitment decisions."
                },
                {
                    title: "Verified Competency Database",
                    description: "PilotRecognition provides verified data on pilot professional competencies through our PilotRecognition platform. Our database includes <strong>Airbus EBT CBTA 9 core competencies</strong> with behavioral markers and cognitive indicators, CRM awareness, briefing protocols, and competency assessments. Operators can filter candidates by verified competencies and <strong>competency scores</strong>, reducing uncertainty in recruitment decisions and improving training success rates."
                },
                {
                    title: "Comprehensive Pilot Profiles",
                    description: "Operators can view live real-time competency profiles with video interviews and EBT scores. For pilots who have completed the Transition Program, operators can assess communication skills, professional demeanor, and presentation style alongside verified 9 core competencies. Profiles include behavioral markers and cognitive indicators evaluation."
                },
                {
                    title: "Direct Pathways & Industry Connections",
                    description: "PilotRecognition connects operators directly to pilots through competency-based pathway cards—not job listings. Operators can pull from our database of pilots who have completed the <strong>Transition Program</strong> with 50 hours of evidence-based mentorship and EBT video assessment. Pathway cards show requirements and what pilots are missing. Integration with <strong>HINFACT EBT CBTA Software</strong> provides sophisticated competency assessment tools."
                },
                {
                    title: "Industry-Aligned Standards",
                    description: "PilotRecognition programs are aligned with <strong>AIRBUS 9 core competencies</strong> and supported by industry leaders. Our Foundation Program addresses the <strong>Pilot Gap in Recognition, Experience, and (PRM) Pilot Risk Management</strong> through comprehensive competency-based training and assessment. Our Transition Program provides full EBT CBTA assessment with HINFACT integration. Operators can trust that candidates from PilotRecognition have been evaluated against the same standards used by major airlines and manufacturers. This alignment ensures that verified competencies translate directly to operational readiness."
                },
                {
                    title: "Platform Access & Direct Engagement",
                    description: "Operators can access the PilotRecognition platform to pull verified pilot competency data. With more than <strong>5000+ pilots</strong> on our platform, your operator requirements will match with verified competencies. This is a pulling system—not a job board. Pilots submit interest. You pull from live real-time competency profiles. Contact <strong>enterprise@pilotrecognition.com</strong> for platform access to pull verified competency data. Enterprise access: $1,000/month for pull API and unlimited access. Success fee: $500 per pilot hired."
                }
            ]
        },
        {
            category: "Programs & Apps Support",
            content: [
                {
                    title: "Objective Assessment",
                    description: "PilotRecognition provides <strong>data-driven assessment</strong> of pilot readiness. We evaluate specific competencies that operators assess, provide measurable feedback on gaps, and offer targeted development pathways. Our approach is based on operator standards and industry requirements, not motivational messaging."
                },
                {
                    title: "Direct Communication",
                    description: "Program inquiries: <strong>contact@pilotrecognition.com</strong>. Leadership contact: <strong>contact@pilotrecognition.com</strong>. We provide direct access to program staff for questions about program structure, assessment criteria, and industry alignment."
                },
                {
                    title: "Career Trajectory Analysis",
                    description: "Each pilot receives an <strong>objective assessment</strong> of current professional standing and realistic career timeline based on industry data. We identify specific competency gaps, provide development recommendations, and align pilot development with operator requirements and market realities."
                }
            ]
        }
    ];

    const pilotRecognitionContent = [
        {
            title: "Recognition Profile Tiers",
            description: "Choose the tier that fits your career goals. <strong>Free Tier:</strong> Platform access, basic competency matching (shows 2 gaps), 3 pathways per month. <strong>Recognition Plus ($99/year):</strong> Full competency comparison, unlimited pathway views, priority matching. Program participants get same priority as paid members (competency-based recognition)."
        },
        {
            title: "The Professional Recognition Challenge",
            description: "The most significant challenge facing the aviation industry today is professional <strong>Competency Recognition</strong>. Pilots invest <strong>$50,000 USD</strong> in training and dedicate <strong>4 years</strong> to university education, yet many find themselves relying on job application platforms that have not been updated since <strong>2007</strong>, or resorting to informal job searches on social media platforms such as <strong>Facebook</strong>, which undermines professional standards. PilotRecognition.com was established following strategic discussions with <strong>AIRBUS</strong>, <strong>Etihad</strong>, and <strong>Archer</strong> to address these challenges and bridge the gap between the industry and the pilot profession."
        },
        {
            title: "Competency-Based Flight Logbooks",
            description: "Traditional logbooks have remained unchanged—digital logbooks merely replicate the same input process. PilotRecognition.com introduces <strong>Competency-Based Flight Logbooks</strong>, where your logbook serves a meaningful purpose beyond proving flight hours. We have implemented <strong>live tracking</strong> of your hours, where every hour contributes to your <strong>Competency Score</strong> across the 9 core competencies. Airlines accessing our platform would rather see a pilot who has maintained a <strong>high competency score</strong> with recent flight activity than a pilot who has not flown for <strong>two years</strong> despite having <strong>1000 hours</strong>. A pilot with <strong>500 recent hours</strong> holds greater value than a pilot with <strong>1500 hours</strong> who flew <strong>five years ago</strong>."
        },
        {
            title: "Competency-Based Pathways",
            description: "Your <strong>PilotRecognition Profile</strong> will automatically suggest pathways based on your <strong>Competency Score</strong> and match percentage. The score determines an overall assessment of your profile in comparison to pathway requirements, and you will be in greater favor if you possess a <strong>higher score</strong>. This <strong>intelligent matching system</strong> analyzes your flight hours, certifications, 9 core competencies, and recent activity to identify the <strong>most suitable career opportunities</strong> tailored to your professional development. Operators and airlines will access your profile based on your interests in their programs, evaluating your <strong>competency score</strong> and percentage match against pathway requirements."
        },
        {
            title: "Initial Competency Profile",
            description: "Your journey begins with creating your <strong>Initial Competency Profile</strong>, the foundation of your professional aviation identity. This comprehensive profile captures your flight experience, certifications, training history, and competency assessments in the 9 core competencies in a unified digital format that serves as your passport to the aviation industry. Upon registration, you will be guided through a structured onboarding process that collects essential information including your flight hours, aircraft types flown, licenses held, and specialized training completed. This data is verified and integrated into your <strong>Competency Score</strong>, providing you with an immediate baseline assessment of your professional standing."
        },
        {
            title: "First Step Towards Competency Recognition",
            description: "The Foundation Program is your first step towards building a credible and recognized pilot profile. This competency-based program is designed to establish a solid foundation of aviation knowledge, competency development in the 9 core competencies, and industry standards that global manufacturers and operators recognize as credible experience. The program aligns with EBT CBTA international standards, ensuring that your competency recognition meets the highest international standards in evidence-based training and competency-based training and assessment. Through alignment with international training standards, the Foundation Program provides a competency recognition framework that aligns with the highest industry standards."
        }
    ];

    const pathwaysContent = [
        {
            title: "Pathway Tiers",
            description: "Choose the tier that fits your career goals. <strong>Free Tier:</strong> View public pathways (airlines, cargo, cadet programs), basic competency matching. <strong>Recognition Plus ($99/year):</strong> Unlimited pathway views, full competency comparison insights. <strong>Premium Pathways ($49 each or $199/year bundle):</strong> Private sector pathways (corporate aviation, charter, VIP transport), specialized pathways (helicopter, seaplane, agricultural aviation), advanced competency analytics, profile benchmarking against successful applicants, priority matching."
        },
        {
            title: "Cadet Programs",
            description: "Cadet programs provide structured pathways from ab-initio to airline pilot positions. Major airlines including <strong>Envoy Air</strong>, <strong>Cathay Pacific</strong>, <strong>FlyDubai</strong>, <strong>Ryanair</strong>, <strong>Air Arabia</strong>, <strong>Jetstar</strong>, <strong>Cebu Pacific</strong>, <strong>SkyWest</strong>, <strong>JetBlue</strong>, <strong>Emirates</strong>, <strong>easyJet</strong>, <strong>Wizz Air</strong>, <strong>Air India</strong>, <strong>SpiceJet</strong>, <strong>Royal Brunei</strong>, <strong>Philippine Airlines</strong>, and <strong>Etihad</strong> offer comprehensive training sponsorships with guaranteed or direct-to-airline pathways. These programs typically require specific age ranges, educational qualifications, medical certificates, and residency requirements, with full or partial training sponsorship available. Our <strong>AI-powered pathway matching</strong> analyzes your PilotRecognition profile to recommend the most suitable cadet programs based on your qualifications, experience, and career goals."
        },
        {
            title: "Type Rating Centers",
            description: "Type rating centers provide specialized training for specific aircraft types, enabling pilots to expand their qualifications and career opportunities. Centers like <strong>CAE Philippines</strong> offer training on various aircraft types including Airbus, Boeing, and regional jets. Type ratings are essential requirements for airline positions and career advancement, with pricing varying by aircraft type and training provider. Our platform connects pilots with type rating centers that align with their career goals and aircraft preferences. <strong>Interactive ROI calculator</strong> helps you estimate the return on investment for different type ratings based on projected salary increases and market demand."
        },
        {
            title: "License Pathways",
            description: "License pathways focus on achieving advanced certifications such as ATPL (Airline Transport Pilot License). These pathways require significant flight experience (typically 1,500+ hours total time), multi-engine and instrument ratings, and successful completion of ATPL theory examinations. Various ATOs provide structured training programs to help pilots achieve these milestones, with costs varying by training provider and program structure. Our <strong>timeline visualization</strong> tool helps you plan your ATPL journey with milestone tracking and estimated completion dates based on your current progress."
        },
        {
            title: "Rating Pathways",
            description: "Rating pathways include specialized certifications such as <strong>Seaplane Rating</strong>, <strong>Multi-Engine Rating</strong>, <strong>Instrument Rating</strong>, <strong>UPRT (Upset Prevention and Recovery Training)</strong>, and <strong>CAT I/II/III</strong> instrument rating enhancements. These ratings expand pilot capabilities and qualify them for specific operational environments. Training providers offer comprehensive programs with costs ranging from $3,000 to $18,000 depending on the rating type and training location. <strong>Skills gap analysis</strong> identifies which ratings would most benefit your career based on industry demand and your current qualifications."
        },
        {
            title: "Business Aviation",
            description: "Business aviation pathways offer opportunities in private charter, corporate aviation, and executive jet operations. Companies like <strong>Empire Aviation</strong>, <strong>ExecuJet</strong>, <strong>NetJets</strong>, <strong>Flexjet</strong>, <strong>VistaJet</strong>, <strong>Executive Jet Management</strong>, <strong>Jet Aviation</strong>, <strong>PrivateFlite Aviation</strong>, and <strong>Solairus Aviation</strong> provide career opportunities with competitive salaries ranging from $120,000 to $220,000 annually. These positions typically require significant flight experience (2,500+ hours), type ratings on business jets, and VIP client experience. <strong>Mentor matching</strong> connects you with experienced business aviation pilots who can guide your career transition."
        },
        {
            title: "eVTOL and Emerging Aviation",
            description: "Emerging aviation pathways include eVTOL (electric vertical takeoff and landing) aircraft programs with companies like <strong>Joby Aviation</strong>, <strong>Archer Aviation</strong>, <strong>Lilium</strong>, <strong>EHang</strong>, and <strong>Vertical Aerospace</strong>. These positions represent the future of aviation with opportunities in autonomous aircraft operations, drone delivery with <strong>Wing (Alphabet)</strong> and <strong>Zipline International</strong>, and specialized operations. Salaries range from $55,000 to $120,000 depending on position and experience level. <strong>Virtual simulation experiences</strong> let you preview eVTOL operations and assess your suitability before committing to training programs."
        },
        {
            title: "Specialized Operations",
            description: "Specialized operations pathways include unique aviation careers such as <strong>Skydive Piloting</strong>, <strong>Remote Supply Runs</strong>, <strong>Flight Tours Operations</strong>, and cargo operations with companies like <strong>Atlas Air</strong>, <strong>FedEx</strong>, <strong>UPS</strong>, and <strong>DHL Aviation</strong>. These pathways offer diverse opportunities with salaries ranging from $40,000 to $280,000 depending on the operation type and experience requirements. These specialized roles often require specific experience in mountain flying, short field operations, or cargo logistics. <strong>Live job market indicators</strong> show real-time demand for each specialized pathway, helping you make informed career decisions."
        },
        {
            title: "AI-Powered Career Guidance",
            description: "Our platform uses <strong>advanced AI algorithms</strong> to analyze your PilotRecognition profile, market trends, and industry demand to provide personalized career recommendations. The system considers your flight hours, certifications, geographic preferences, salary expectations, and career goals to suggest optimal pathways. <strong>Predictive analytics</strong> forecast future demand for different pathways, helping you position yourself for emerging opportunities before they become mainstream."
        },
        {
            title: "Interactive Pathway Comparison",
            description: "Compare multiple pathways side-by-side with our <strong>interactive comparison tool</strong>. View detailed information on requirements, costs, duration, salary projections, success rates, and industry demand for each pathway. <strong>Difficulty ratings</strong> help you assess which pathways match your current skill level, while <strong>prerequisites checklist</strong> ensures you meet all requirements before applying. Visual timelines show the path from your current position to your desired career outcome."
        },
        {
            title: "Community & Success Stories",
            description: "Join a vibrant community of pilots pursuing similar pathways through our <strong>dedicated forums</strong> for each pathway type. Read <strong>success stories</strong> from pilots who have completed various pathways, learning from their experiences and challenges. <strong>Peer support networks</strong> connect you with mentors and fellow aviators who can provide guidance, share resources, and offer encouragement throughout your journey. <strong>Live Q&A sessions</strong> with industry experts provide insider insights into specific pathways."
        }
    ];

    const pilotTerminalContent = [
        {
            title: "Pilot Network Platform",
            description: "The <strong>Pilot Terminal</strong> is a pilot-oriented professional network platform, very much like <strong>LinkedIn</strong>, designed specifically for the aviation industry. Connect with fellow pilots, mentors, instructors, and aviation professionals worldwide. Your <strong>PilotRecognition Profile</strong> is seamlessly integrated into the platform, allowing you to showcase your verified 9 core competencies, competency scores, and pathway interests to your network. Build meaningful professional relationships, share industry insights, and grow your aviation career through strategic networking. <strong>For now, since we are still in beta testing, Pilot Terminal is publicly available only for Foundation Program completion users</strong>, ensuring that the community consists of verified pilots who have demonstrated commitment to professional development through our competency-based training program."
        },
        {
            title: "Profile Integration & Linking",
            description: "Your <strong>PilotRecognition Profile</strong> from pilotrecognition.com is automatically linked and displayed on Pilot Terminal. This integration ensures that your verified credentials, training progress, and competency scores across the 9 core competencies are visible to your network and potential employers. You can also link your <strong>pathway interests</strong>, program enrollments, and career aspirations directly to your profile, creating a comprehensive professional identity that showcases your aviation journey and goals. The unified profile system eliminates the need to maintain multiple profiles across different platforms."
        },
        {
            title: "Competency Score Comparison",
            description: "Since Pilot Terminal is an uploaded site, you can view your <strong>competency score</strong> against other pilots on the platform. This competitive benchmarking feature allows you to see how you rank within the pilot community based on your verified 9 core competencies, behavioral markers, cognitive indicators, training progress, and professional achievements. Compare your score against industry averages, peer groups, or specific pathway requirements to understand your competitive positioning. Use these insights to identify areas for improvement and track your progress as you advance your aviation career."
        },
        {
            title: "Enterprise Integration",
            description: "Operators who access the PilotRecognition PilotRecognition platform will have their <strong>enterprise inputs</strong> and job postings also visible on Pilot Terminal. This seamless integration means that when airlines, manufacturers, and training providers post opportunities on pilotrecognition.com, these listings automatically appear on Pilot Terminal. Pilots can discover and apply to opportunities directly from their network feed, creating a streamlined recruitment process that connects qualified candidates with industry opportunities in real-time."
        },
        {
            title: "Data Scraping & Portal Integration",
            description: "All data scraping from pilot jobs and aviation opportunities is conducted through Pilot Terminal, which then updates the pathways and job listings on the <strong>pilot portal</strong> accessed through pilotrecognition.com. This centralized data aggregation ensures that job listings, pathway information, and industry opportunities are consistently maintained and synchronized across both platforms. Pilot Terminal serves as the primary data source, continuously monitoring and collecting aviation job data from various sources, then feeding this information to the pilot portal to provide pilots with the most up-to-date career opportunities and pathway options."
        },
        {
            title: "Backend Social Network & AI API",
            description: "Pilot Terminal essentially acts as a <strong>backend social network</strong> and <strong>AI API access</strong> information hub for competency data. The database is requested most of the time from what Pilot Terminal has gathered, making it the central repository for aviation competency data and intelligence. This architecture ensures that all platforms and applications within the PilotRecognition ecosystem can access consistent, real-time competency data through standardized API endpoints, enabling seamless integration and data flow across the entire system."
        },
        {
            title: "AI Agents & Real-Time Intelligence",
            description: "Pilot Terminal is powered by more than <strong>50 AI agents</strong> continuously scraping for the latest aviation news, regulatory updates, and new EBT CBTA competency requirements. These intelligent agents monitor multiple data sources simultaneously, ensuring that our system remains robust and up-to-date with the rapidly changing aviation landscape and competency standards. The AI agents analyze trends, identify emerging opportunities, and update pathway competency requirements in real-time, providing pilots and operators with the most current information available in the industry."
        },
        {
            title: "PilotRecogAI Integration",
            description: "The <strong>PilotRecogAI</strong> on the pilot portal is powered and backed by the Pilot Terminal social network infrastructure. This integration enables PilotRecogAI to leverage the comprehensive data gathered by Pilot Terminal's AI agents, social network insights, and real-time industry intelligence. The AI can provide more accurate career recommendations, competency-based pathway matching, and competency scoring because it has access to the wealth of data continuously collected and processed by Pilot Terminal. This backend support ensures that PilotRecogAI delivers intelligent, data-driven insights that reflect the current state of the aviation industry and EBT CBTA standards."
        },
        {
            title: "Pathway Interest Sharing",
            description: "Share your <strong>pathway interests</strong> with your network and receive personalized competency-based recommendations based on your career goals. When you express interest in specific pathways such as cadet programs, type ratings, or business aviation positions, the platform surfaces relevant opportunities, mentors, and community discussions based on your 9 core competencies. Your network can see your professional aspirations and provide introductions, recommendations, or insights to help you achieve your career objectives. This collaborative approach accelerates career progression through the power of your professional network."
        },
        {
            title: "Community Engagement",
            description: "Engage with aviation communities through specialized groups, forums, and discussions focused on competency development. Join groups focused on specific pathways like <strong>Cadet Programs</strong>, <strong>Type Rating Centers</strong>, <strong>Business Aviation</strong>, or <strong>eVTOL Operations</strong> to connect with like-minded professionals. Participate in industry discussions, share experiences, and learn from others who have successfully navigated similar career paths. The platform fosters a supportive community where pilots can exchange knowledge, seek advice, and build lasting professional relationships based on shared competency goals."
        },
        {
            title: "Content & Knowledge Sharing",
            description: "Share aviation-related content including articles, training materials, industry news, and career advice focused on EBT CBTA competency development. Post updates about your training progress, pathway achievements, or industry insights to establish yourself as a thought leader in specific areas. Follow industry experts, training providers, and aviation organizations to stay informed about the latest trends, opportunities, and developments. The platform's content feed is curated to show relevant information based on your interests, network activity, and competency development goals."
        },
        {
            title: "Direct Messaging & Connections",
            description: "Connect directly with mentors, program coordinators, recruiters, and fellow pilots through the platform's messaging system. Send connection requests to professionals you admire or wish to learn from. Once connected, engage in private conversations to seek advice, discuss opportunities, or explore mentorship possibilities. The messaging system is integrated with your PilotRecognition profile, allowing recipients to view your verified credentials, competency scores, and professional standing before responding, facilitating more meaningful and productive connections."
        },
        {
            title: "Job Discovery & Applications",
            description: "Discover aviation opportunities through an intelligent job feed that matches your competency profile, interests, and network activity. When operators post jobs on pilotrecognition.com, these opportunities appear on Pilot Terminal with <strong>competency match indicators</strong> showing how well you align with the requirements. Apply directly through the platform with your linked PilotRecognition Profile, which provides employers with verified data on your 9 core competencies and readiness. Track application statuses, receive interview invitations, and manage your job search workflow within the same platform where you maintain your professional network."
        }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header */}
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back
                        </button>
                    </div>
                    
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <BookOpen className="w-12 h-12 text-blue-700" />
                            <h1 className="text-4xl md:text-5xl font-serif text-slate-900">
                                Technical Index
                            </h1>
                        </div>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Detailed program specifications, technical documentation, and operational details for pilots, operators, and partners.
                        </p>
                    </div>
                </div>
            </div>

            {/* Programs Section */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-16">
                {aboutSections.map((section, sectionIdx) => (
                    <div key={sectionIdx} className="text-center max-w-4xl mx-auto">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            {section.category}
                        </p>
                        <h2 className="text-2xl md:text-3xl font-serif text-slate-900 mb-8">
                            {section.category}
                        </h2>
                        <div className="text-left space-y-8">
                            {section.content.map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                                    <p className="text-base text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.description) }}></p>
                                </div>
                            ))}
                        </div>
                        {section.category === "For Operators, Manufacturers & ATOs" && (
                            <div className="mt-8 text-center">
                                <a
                                    href="mailto:enterprise@pilotrecognition.com"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl hover:bg-slate-800"
                                >
                                    Contact for Enterprise Access
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Context Banner */}
            <div className="py-8 px-6 bg-slate-900 text-white">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-lg font-medium">
                        The Foundational Program gives you the knowledge. Now see how that knowledge becomes verified recognition that operators trust.
                    </p>
                </div>
            </div>

            {/* Pilot Recognition Section */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-16">
                <div className="text-center max-w-4xl mx-auto">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        Pilot Recognition
                    </p>
                    <h2 className="text-2xl md:text-3xl font-serif text-slate-900 mb-8">
                        Pilot Recognition Profile
                    </h2>
                    <div className="text-left space-y-8">
                        {pilotRecognitionContent.map((item, idx) => (
                            <div key={idx} className="space-y-2">
                                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                                <p className="text-base text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.description) }}></p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Context Banner */}
            <div className="py-8 px-6 bg-blue-900 text-white">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-lg font-medium">
                        Operators need verified data. Your PilotRecognition Profile provides exactly that — every hour logged, every competency measured, every achievement verified.
                    </p>
                </div>
            </div>

            {/* Pathways Section */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-16">
                <div className="text-center max-w-4xl mx-auto">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        Pathways
                    </p>
                    <h2 className="text-2xl md:text-3xl font-serif text-slate-900 mb-8">
                        Pathways
                    </h2>
                    <div className="text-left space-y-8">
                        {pathwaysContent.map((item, idx) => (
                            <div key={idx} className="space-y-2">
                                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                                <p className="text-base text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.description) }}></p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Context Banner */}
            <div className="py-8 px-6 bg-slate-900 text-white">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-lg font-medium">
                        Your recognition score is your currency. Pathways are where you spend it. We bridge the gap between training investment and career opportunity.
                    </p>
                </div>
            </div>

            {/* Pilot Terminal Section */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-16">
                <div className="text-center max-w-4xl mx-auto">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        Pilot Terminal
                    </p>
                    <h2 className="text-2xl md:text-3xl font-serif text-slate-900 mb-8">
                        Pilot Terminal
                    </h2>
                    <div className="text-left space-y-8">
                        {pilotTerminalContent.map((item, idx) => (
                            <div key={idx} className="space-y-2">
                                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                                <p className="text-base text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.description) }}></p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-900 text-white py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4">PilotRecognition</h3>
                            <p className="text-slate-400 text-sm">The Aviation Industry's First Pilot Recognition-Based Platform</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4">Platform</h3>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li><a onClick={() => onNavigate('recognition-plus')} className="hover:text-white cursor-pointer transition-colors">Pilot Recognition</a></li>
                                <li><a onClick={() => onNavigate('recognition-score-info')} className="hover:text-white cursor-pointer transition-colors">Recognition Score</a></li>
                                <li><a onClick={() => onNavigate('recognition-career-matches')} className="hover:text-white cursor-pointer transition-colors">Pathways</a></li>
                                <li><a href="https://pilotterminal.com" target="_blank" rel="noopener noreferrer" className="hover:text-white cursor-pointer transition-colors">Pilot Terminal</a></li>
                                <li><a onClick={() => onNavigate('about')} className="hover:text-white cursor-pointer transition-colors">Foundation Program</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4">Contact</h3>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li><a href="mailto:contact@pilotrecognition.com" className="hover:text-white cursor-pointer transition-colors">contact@pilotrecognition.com</a></li>
                                <li><a href="mailto:enterprise@pilotrecognition.com" className="hover:text-white cursor-pointer transition-colors">enterprise@pilotrecognition.com</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4">Legal</h3>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li><a href="/privacy-policy" className="hover:text-white cursor-pointer transition-colors">Privacy Policy</a></li>
                                <li><a href="/terms-of-service" className="hover:text-white cursor-pointer transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
                        <p>&copy; 2024 PilotRecognition - WM Pilot Group. All rights reserved.</p>
                    </div>
                </div>
            </div>

            {/* EBT CBTA Alignment Disclosure */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 mb-12 mx-6 max-w-6xl ml-auto mr-auto">
                <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">EBT CBTA Framework Alignment</h3>
                        <p className="text-slate-700 leading-relaxed mb-3">
                            PilotRecognition programs align with Evidence-Based Training and Competency-Based Training and Assessment frameworks, which are international standards in pilot training aligned with Airbus. Our curriculum incorporates the <strong>9 core competencies</strong> framework used by modern airlines worldwide.
                        </p>
                        <div className="bg-white rounded-lg p-4 border border-blue-100">
                            <p className="text-sm text-slate-600 mb-1"><strong>Framework:</strong> EBT CBTA (Airbus-aligned International Standard)</p>
                            <p className="text-sm text-slate-600 mb-1"><strong>Core Competencies:</strong> 9 Competency Areas</p>
                            <p className="text-sm text-slate-600"><strong>Verification Contact:</strong> contact@pilotrecognition.com</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back button */}
            <div className="py-12 flex justify-center">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>
            </div>
        </div>
    );
};
