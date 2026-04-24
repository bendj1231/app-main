import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, Briefcase, Users, TrendingUp, CheckCircle2, Search, Award, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';
import { BreadcrumbSchema } from '../seo/BreadcrumbSchema';

interface RecognitionCareerMatchesPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const RecognitionCareerMatchesPage: React.FC<RecognitionCareerMatchesPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    const [selectedPathway, setSelectedPathway] = useState<{ title: string; subtitle: string; match: number; pr: number; requirements: string[]; type: string; salary: string; tags?: string[] } | null>(null);
    const [activeFilter, setActiveFilter] = useState<'all' | 'low' | 'middle' | 'high'>('all');

    // User behavior tracking (dating-site style personalization)
    const trackPathwayInteraction = (pathway: any, interactionType: 'view' | 'click' | 'like' | 'dislike') => {
        try {
            const trackingData = JSON.parse(localStorage.getItem('pathwayBehaviorTracking') || '{}');
            const pathwayId = pathway.title;
            
            if (!trackingData[pathwayId]) {
                trackingData[pathwayId] = {
                    viewCount: 0,
                    clickCount: 0,
                    lastViewed: null,
                    totalViewTime: 0,
                    interactions: []
                };
            }

            trackingData[pathwayId][interactionType === 'view' ? 'viewCount' : 'clickCount']++;
            trackingData[pathwayId].lastViewed = new Date().toISOString();
            trackingData[pathwayId].interactions.push({
                type: interactionType,
                timestamp: new Date().toISOString()
            });

            localStorage.setItem('pathwayBehaviorTracking', JSON.stringify(trackingData));
        } catch (e) {
            console.error('localStorage error:', e);
        }
    };

    const pathways = [
        { title: 'Envoy Air Pilot Cadet Program', subtitle: 'Envoy Air (American Airlines Group)', match: 94, pr: 0, image: 'https://www.envoyair.com/wp-content/uploads/2024/03/IMG_CadetProgram_MeganSnow.jpg', requirements: ['40+ hrs', 'CPL', 'Class 1 Medical', 'US Citizen/Perm Resident'], type: 'Cadet Program', salary: 'Financial assistance + guaranteed FO position' },
        { title: 'Air Cambodia Cadet Programme', subtitle: 'Air Cambodia', match: 92, pr: 0, image: 'https://s28477.pcdn.co/wp-content/uploads/2024/10/CAngkor_1-984x554.png', requirements: ['18-35 years', 'High School Diploma', 'Medical 1'], type: 'Cadet Program', salary: '$2,000/mo during training' },
        { title: 'Cathay Pacific Cadet Pilot Programme', subtitle: 'Cathay Pacific Airways', match: 88, pr: 0, image: 'https://i0.wp.com/aerocadet.com/blog/wp-content/uploads/2024/05/Screenshot-2024-05-10-at-1.56.37%E2%80%AFPM.png?fit=2392%2C1338&ssl=1', requirements: ['18-40 years', 'HK Permanent Residency', 'Degree Preferred'], type: 'Cadet Program', salary: '$5,000 HKD/mo + training costs covered' },
        { title: 'FlyDubai Pilot Cadet Programme', subtitle: 'FlyDubai', match: 90, pr: 0, image: 'https://cdn.uc.assets.prezly.com/5f1fd10f-a9bc-4bf0-aa29-b9a26dc42407/-/crop/1952x1066/0,272/-/preview/-/resize/1108x/-/quality/best/-/format/auto/', requirements: ['18-30 years', 'High School Diploma', 'UAE Resident/Eligible'], type: 'Cadet Program', salary: 'Full training sponsorship + competitive salary' },
        { title: 'Ryanair Future Flyer Program', subtitle: 'Ryanair / Atlantic Flight Training', match: 89, pr: 0, image: 'https://cdn.aviationa2z.com/wp-content/uploads/2024/01/image-25-1024x683.png', requirements: ['250 hrs', 'B737 Type Rating', 'EU Passport'], type: 'Cadet Program', salary: 'Self-funded training' },
        { title: 'Air Arabia Cadet Pilot Program', subtitle: 'Air Arabia', match: 91, pr: 0, image: 'https://ifa2.vpcstechnology.com/wp-content/uploads/2020/06/Air-Arabia-Cadet-Pilot-Program.jpg', requirements: ['18-30 years', 'High School Diploma', 'Medical Class 1', 'UAE Resident/Eligible'], type: 'Cadet Program', salary: 'Full training sponsorship + salary' },
        { title: 'Jetstar Cadet Pilot Programme', subtitle: 'Jetstar Airways', match: 88, pr: 0, image: 'https://cdn.cabincrewwings.com/wp-content/uploads/2019/04/jetstar.jpg', requirements: ['18-30 years', 'High School Diploma', 'Medical Class 1', 'Australian Citizen/Permanent Resident'], type: 'Cadet Program', salary: 'Training sponsorship available' },
        { title: 'Cebu Pacific Cadet Pilot Programme', subtitle: 'Cebu Pacific', match: 90, pr: 0, image: 'https://images.jgsummit.com.ph/2021/12/15/0f999ad31e634dc5a90ad0d350cbe86ddfc4eca3.jpg', requirements: ['18-35 years', 'College Graduate', 'Medical Class 1', 'Filipino Citizen'], type: 'Cadet Program', salary: 'Full training sponsorship' },
        { title: 'SkyWest Pilot Pathway Program', subtitle: 'SkyWest Airlines', match: 89, pr: 0, image: 'https://www.thrustflight.com/wp-content/uploads/2022/11/skywest-airlines-2-768x512.jpg', requirements: ['Private Pilot License', 'College Student or Graduate', 'US Citizen/Perm Resident'], type: 'Cadet Program', salary: 'Financial assistance + guaranteed FO position' },
        { title: 'JetBlue Gateway Program', subtitle: 'JetBlue Airways', match: 92, pr: 0, image: 'https://sanpedrosun.s3.us-west-1.amazonaws.com/wp-content/uploads/2023/12/09170529/Belizean-pilot-flies-JetBlues-inaugural-flight-to-Belize-3-657x438.jpg', requirements: ['High School Graduate', 'Age 18+', 'US Citizen/Perm Resident', 'Class 1 Medical'], type: 'Cadet Program', salary: 'Direct-to-airline pathway' },
        { title: 'Emirates Cadet Pilot Programme', subtitle: 'Emirates Airlines', match: 93, pr: 0, image: 'https://www.100knots.com/airlines_dashboard/uploads/blog/1700201710.webp', requirements: ['18-28 years', 'High School Diploma', 'UAE National or Resident', 'ICAO Level 4'], type: 'Cadet Program', salary: 'Full training sponsorship + salary' },
        { title: 'easyJet Cadet Pilot Programme', subtitle: 'easyJet', match: 87, pr: 0, image: 'https://www.cae.com/content/images/civil-aviation/_webp/easyJet_crew_.jpg_webp_40cd750bba9870f18aada2478b24840a.webp', requirements: ['18-30 years', 'High School Diploma', 'Medical Class 1', 'EU Passport/Work Permit'], type: 'Cadet Program', salary: 'Training sponsorship available' },
        { title: 'Wizz Air Cadet Pilot Programme', subtitle: 'Wizz Air', match: 86, pr: 0, image: 'https://betteraviationjobs.com/storage/2019/11/Wizz-Air-Airbus-A321neo.jpg', requirements: ['18-30 years', 'High School Diploma', 'Medical Class 1', 'EU Passport/Work Permit'], type: 'Cadet Program', salary: 'Training sponsorship available' },
        { title: 'Air India Cadet Pilot Programme', subtitle: 'Air India', match: 89, pr: 0, image: 'https://blog.topcrewaviation.com/wp-content/uploads/2024/04/Air-India-A350.jpg', requirements: ['18-30 years', '12th Grade/Equivalent', 'Medical Class 1', 'Indian Citizen'], type: 'Cadet Program', salary: 'Full training sponsorship + salary' },
        { title: 'SpiceJet Cadet Pilot Programme', subtitle: 'SpiceJet', match: 85, pr: 0, image: 'https://airinsight.com/wp-content/uploads/2019/04/SpiceJetMAX.jpg', requirements: ['18-30 years', '12th Grade/Equivalent', 'Medical Class 1', 'Indian Citizen'], type: 'Cadet Program', salary: 'Training sponsorship available' },
        { title: 'Royal Brunei Cadet Pilot Programme', subtitle: 'Royal Brunei Airlines', match: 88, pr: 0, image: 'https://worldsocialmedia.directory/wp-content/uploads/Royal-Brunei-400x270.jpg', requirements: ['18-28 years', 'High School Diploma', 'Medical Class 1', 'Brunei Citizen/Permanent Resident'], type: 'Cadet Program', salary: 'Full training sponsorship + salary' },
        { title: 'Philippine Airlines Cadet Pilot Programme', subtitle: 'Philippine Airlines', match: 89, pr: 0, image: 'https://www.philippineairlines.com/content/dam/palportal/migration/files/historyandmilestonespalsstory/nutshell-copy.jpg', requirements: ['18-30 years', 'College Graduate', 'Medical Class 1', 'Filipino Citizen'], type: 'Cadet Program', salary: 'Full training sponsorship' },
        { title: 'Etihad Cadet Pilot Programme', subtitle: 'Etihad Airways', match: 91, pr: 0, image: 'https://www.etihad.com/content/dam/eag/etihadairways/etihadcom/Global/news/etihad-airways-launches-international-roadshow-in-major-pilot-recruitment-drive.jpg', requirements: ['18-30 years', 'High School Diploma', 'English Proficiency', 'UAE Resident/Eligible'], type: 'Cadet Program', salary: 'Full training sponsorship + salary during training' },
        { title: 'CAE Philippines Type Rating Center', subtitle: 'CAE', match: 93, pr: 0, image: 'https://www.cae.com/content/images/blog/Civil_Aviation/_webp/IMG_4783_Updated_.JPG_webp_40cd750bba9870f18aada2478b24840a.webp', requirements: ['CPL + IR', 'Medical Class 1', 'English Proficient'], type: 'Type Rating Center', salary: 'Contact for pricing' },
        { title: 'ATPL Pathway', subtitle: 'Various ATOs', match: 90, pr: 0, image: 'https://www.flightdeckfriend.com/wp-content/uploads/2021/01/Pilot-Assessment-Example-Technical-Exam-710x375.jpeg', requirements: ['CPL + ME/IR', '1,500+ hrs TT', 'ATPL Theory Pass'], type: 'License Pathway', salary: 'Contact for pricing' },
        { title: 'Seaplane Rating Pathway', subtitle: 'Seaplane Training Centers', match: 85, pr: 0, image: 'https://media.licdn.com/dms/image/v2/D5622AQEorE3S-pb_-g/feedshare-shrink_800/B56ZuH5BCLJYAg-/0/1767511431493?e=2147483647&v=beta&t=_MvjJVpFPaJi_89kySmuFOAKiSMLZnt_RowacQjwB1I', requirements: ['PPL or CPL', 'Water Operations', 'Class 3 Medical'], type: 'Rating Pathway', salary: '$5,000 - $8,000' },
        { title: 'UPRT Rating Pathway', subtitle: 'UPRT Training Providers', match: 88, pr: 0, image: 'https://i.vimeocdn.com/video/1769783286-138fb27314025852ea22110de052d224665fcb0d82fad22a16f48a77d0001cc7-d?f=webp', requirements: ['CPL or ATPL', 'Spin Awareness', 'EASA/FAA Compliant'], type: 'Training Pathway', salary: '$3,000 - $5,000' },
        { title: 'AIRBUS EBT CBTA Familiarization Pathway', subtitle: 'Airbus Training Centers', match: 92, pr: 0, image: 'https://i0.wp.com/pilotswhoaskwhy.com/wp-content/uploads/2023/06/img_9643.png?resize=750%2C464&ssl=1', requirements: ['A320 Family Type Rating', 'Airline Experience', 'CBTA Compliant'], type: 'Competency-Based Training', salary: 'Contact for pricing' },
        { title: 'Multi Engine Rating Pathway', subtitle: 'Flight Training Organizations', match: 95, pr: 0, image: 'https://cdn.prod.website-files.com/67b7f6762c0ae79aa3b1f3b0/6813ec96ef44eea3df482f3d_N53TW%203.jpg', requirements: ['PPL or CPL', 'Single Engine Experience', 'Class 2 Medical'], type: 'Rating Pathway', salary: '$8,000 - $15,000' },
        { title: 'Instrument Rating Pathway', subtitle: 'IFR Training Centers', match: 97, pr: 0, image: 'https://media.pea.com/wp-content/uploads/2023/06/altfull-view-of-G1000-Avionics-of-Cessna-172-1024x607.jpeg', requirements: ['PPL or CPL', '50+ hrs Cross-Country', 'Class 2 Medical'], type: 'Rating Pathway', salary: '$10,000 - $18,000' },
        { title: 'Flight/Ground Instructor Pathway', subtitle: 'Aviation Academies', match: 89, pr: 0, image: 'https://leopardaviation.com/wp-content/uploads/2025/10/How-Long-Does-It-Take-to-Become-a-Certified-Flight-Instructor.jpg', requirements: ['CPL or ATPL', 'Instructional Techniques', 'Class 1 Medical'], type: 'Instructor Pathway', salary: 'Hourly/Contract Rates' },
        { title: 'CAT I | CAT II | CAT III Rating Pathways', subtitle: 'Airline Training Departments & SIM Centers', match: 87, pr: 0, image: 'https://profipilot.training/project/files/pages/196/instrument-rating-(1).jpg', requirements: ['Instrument Rating', 'Multi-Engine Experience', 'Type-Specific Ground School'], type: 'Instrument Rating Enhancement', salary: 'Part of Type Rating/Recurrent - No Extra Cost' },
        { title: 'Atlas Air International Pathway', subtitle: 'Atlas Air', match: 45, pr: 0, image: 'https://live-cms.acronaviation.com/media/sgbhxpsv/acron-academy-airline-relationships-usa-atlas-air.jpg?width=1200&height=630&quality=80', requirements: ['2,000 hrs', 'B747 Type Rating', 'Heavy Jet Experience'], type: 'ACMI Career Track', salary: '$180,000 - $280,000' },
        { title: 'FedEx Purple Runway Program', subtitle: 'FedEx Express', match: 48, pr: 0, image: 'https://d386an9otcxw2c.cloudfront.net/oms/2634/image/2025/8/3QC0D_purple-runway-pathway/purple-runway-pathway.jpg', requirements: ['750 hrs', 'ATP Written', 'US Citizen/Permanent Resident'], type: 'Cadet to Captain', salary: '$60,000 during training' },
        { title: 'UPS FlightPath Program', subtitle: 'UPS Airlines', match: 46, pr: 0, image: 'https://cdn.phenompeople.com/CareerConnectResources/UPBUPSGLOBAL/images/img-flightpath-fastfacts-1736537912855.jpg', requirements: ['1,000 hrs', 'Part 121 Experience', 'ATP'], type: 'Career Development', salary: '$55,000 starting pay' },
        { title: 'DHL Aviation First Officer Program', subtitle: 'DHL Aviation (EAT Leipzig)', match: 47, pr: 0, image: 'https://pilotbible.com/wp-content/uploads/2023/09/9S_DHL_777F_N706GT_PAE_katie_bailey_06-scaled-1.webp', requirements: ['250 hrs', 'EASA CPL', 'A330 Type Rating Program'], type: 'Entry Level Cargo', salary: '€65,000 - €85,000' },
        { title: 'Empire Aviation - Business Aviation Pathway', subtitle: 'Empire Aviation Group', match: 49, pr: 0, image: 'https://empireaviation.com/wp-content/uploads/2021/02/march072017.jpg', requirements: ['2,500+ hrs TT', 'Gulfstream/Bombardier Type', 'VIP Experience'], type: 'Business Aviation', salary: '$120,000 - $180,000/year' },
        { title: 'ExecuJet - Executive Charter', subtitle: 'ExecuJet Aviation Group', match: 48, pr: 0, image: 'https://www.stanstednews.com/gallery_2022/31431.jpg', requirements: ['2,500+ hrs TT', 'Bombardier/Gulfstream Type', 'VIP Client Experience'], type: 'Business Aviation', salary: '$140,000 - $200,000/year' },
        { title: 'NetJets Pilot Development Program', subtitle: 'NetJets', match: 72, pr: 0, image: 'https://marvel-b1-cdn.bc0a.com/f00000000249826/nbaa.org/wp-content/uploads/2020/07/netjets-fleet-ramp.jpg', requirements: ['1,500 hrs', 'Multi-Engine ATP', 'Customer Service Skills'], type: 'Career Pathway', salary: '$85,000 starting + sign-on bonus' },
        { title: 'Flexjet Direct Entry Program', subtitle: 'Flexjet', match: 50, pr: 0, image: 'https://cdn.phenompeople.com/CareerConnectResources/OJAOJCUS/images/5I2A9553-1751401469126.jpg', requirements: ['2,500 hrs TT', 'Citation Experience Preferred', 'Type Rating Available', 'ATP'], type: 'Direct Entry', salary: 'Up to $175,000 first year + $5,000 productivity bonus' },
        { title: 'VistaJet Silver Service Training', subtitle: 'VistaJet', match: 52, pr: 0, image: 'https://www.voyages-d-affaires.com/wp-content/uploads/2018/10/vistajet.jpg', requirements: ['3,500 hrs', 'Global Experience', 'Cabin Service Training'], type: 'Service Excellence Program', salary: '$180,000 + bonuses' },
        { title: 'Executive Jet Management - Challenger Captain', subtitle: 'EJM (NetJets)', match: 51, pr: 0, image: 'https://media.licdn.com/dms/image/v2/D5610AQF-mBJGtYQMEw/image-shrink_800/B56ZiZN6FXHUAk-/0/1754917217977?e=2147483647&v=beta&t=aBnETThrSWu2g8cvtfd8FSrpwYdq9ILm2DSElGUOZC8', requirements: ['3,500 hrs', 'CL30 Type Rating', 'ATP'], type: 'Corporate Aviation', salary: '$130,000 - $175,000 + signing bonus' },
        { title: 'Jet Aviation - G650 Captain', subtitle: 'Jet Aviation (General Dynamics)', match: 50, pr: 0, image: 'https://www.bjtonline.com/sites/bjtonline.com/files/styles/bjt30_article_large/public/jet-aviation-singapore-seletar.jpg?itok=7UwvebpF&timestamp=1562696419', requirements: ['3,500 hrs', '1,500 PIC', 'G650 Type Rating'], type: 'Private Charter', salary: '$180,000 - $220,000 + benefits' },
        { title: 'PrivateFlite Aviation - Global Express Captain', subtitle: 'PrivateFlite Aviation', match: 49, pr: 0, image: 'https://media.licdn.com/dms/image/v2/D5622AQECGqvvP5aO-A/feedshare-shrink_800/B56ZrgnQSHLwAk-/0/1764704978944?e=2147483647&v=beta&t=dJs4HV4pAgoMLpbmyZhilZekByaTLRggf-ABlTYDIkM', requirements: ['2,000 hrs', 'Global Express Type', 'Part 135'], type: 'Private Charter', salary: '$130,000 - $175,000 + signing bonus' },
        { title: 'Solairus Aviation - GVII/G500 Captain', subtitle: 'Solairus Aviation', match: 51, pr: 0, image: 'https://pbs.twimg.com/media/FzzsxWOXwAwdE2K.jpg', requirements: ['3,000 hrs', '1,500 PIC', 'GVII Type Rating'], type: 'Corporate Aviation', salary: '$170,000 - $200,000 + comprehensive benefits' },
        { title: 'Joby Aviation Pilot Program', subtitle: 'Joby Aviation', match: 88, pr: 0, image: 'https://lh3.googleusercontent.com/d/1XcRDW3p9C965siBjl5HsTXDHaQZJ-Ona', requirements: ['1,500 hrs', 'CPL or ATPL', 'Helicopter Experience Preferred', 'FAA Medical Class 1'], type: 'eVTOL Pilot', salary: '$85,000 - $120,000/year' },
        { title: 'Archer Aviation Midnight Operations', subtitle: 'Archer Aviation', match: 87, pr: 0, image: 'https://lh3.googleusercontent.com/d/1aTWWTtFwIMCrrU9HnCtWdUPTGhvWk6Yi', requirements: ['1,200 hrs', 'Fixed-Wing or Rotary', 'Part 135 Experience'], type: 'eVTOL Captain', salary: '$80,000 - $115,000/year' },
        { title: 'Lilium Jet Pilot Training Program', subtitle: 'Lilium GmbH', match: 85, pr: 0, image: 'https://aerospace.honeywell.com/content/dam/aerobt/en/images/horizontal/aero-lilium-jet-top-side-press-banner-2880x1440.jpg', requirements: ['2,000 hrs', 'Test Pilot Experience', 'EASA ATPL', 'English Fluent'], type: 'eVTOL Test & Operations Pilot', salary: '€70,000 - €95,000/year' },
        { title: 'Wing (Alphabet) Drone Delivery Pilot', subtitle: 'Wing Aviation (Alphabet)', match: 82, pr: 0, image: 'https://www.ttnews.com/sites/default/files/styles/article_full_width_webp/public/images/articles/alphabet-wing-1200.jpg.webp', requirements: ['Remote Pilot License', 'UAS Experience', 'Technical Aptitude'], type: 'Autonomous Drone Operations', salary: '$65,000 - $85,000/year' },
        { title: 'Zipline International Flight Operations', subtitle: 'Zipline International', match: 86, pr: 0, image: 'https://techcrunch.com/wp-content/uploads/2026/01/Zipline-P2-drone-Delivering.jpg', requirements: ['UAS Certification', 'International Experience', 'Healthcare Logistics'], type: 'Drone Fleet Operator', salary: '$70,000 - $95,000/year' },
        { title: 'EHang AAV Pilot Certification', subtitle: 'EHang Holdings', match: 83, pr: 0, image: 'https://www.ehang.com/ueditor/image/2020-05-27/b84e83d73343ae74a9ed691bbd9ff9321590586324349049.jpg', requirements: ['CPL or ATPL', 'Chinese Language Optional', 'AAV Training Provided'], type: 'Autonomous Aerial Vehicle Pilot', salary: '$60,000 - $90,000/year' },
        { title: 'Vertical Aerospace VX4 Pilot Program', subtitle: 'Vertical Aerospace', match: 84, pr: 0, image: 'https://vertical-aerospace.com/wp-content/uploads/2025/12/VerticalAerospace-AC3-32-1920x1000.jpg', requirements: ['1,800 hrs', 'ATPL', 'Helicopter Experience', 'UK/EU Citizen'], type: 'eVTOL Pilot - London Services', salary: '£55,000 - £80,000/year' },
        { title: 'MLG Pilotless Drone Operations', subtitle: 'MLG Aviation', match: 80, pr: 0, image: 'https://lh3.googleusercontent.com/d/11rzk2pXR99JuKEjhanfvAn58cgVETtId', requirements: ['UAS Certification', 'Remote Pilot License', 'Autonomous Systems Experience'], type: 'Autonomous Drone Operations', salary: '$55,000 - $75,000/year' },
        { title: 'Skydive Piloting Pathway', subtitle: 'Drop Zone Operators', match: 78, pr: 0, image: 'https://skydiverdriver.com/assets/images/cr-656x463.jpg', requirements: ['1,000+ hrs TT', 'CPL', 'Skydive Operations Experience', 'Safety Focused'], type: 'Specialized Operations', salary: '$45,000 - $70,000/year' },
        { title: 'Remote Supply Runs Pilot', subtitle: 'Remote Logistics Operators', match: 82, pr: 0, image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgBmoTZNJ3Vkw7R5QsW-LZ_AefufQZfgIDuPyto6HrUkw61UBlHSTvL8P7FalasLwrBEAjDYe9-jyYqHFGsmRZ_iYg0_gRz4Ke8yrDw0yO3NHzIzT_2QS1zGAlvHOdbJrgVYz-Tc4N85Fw/s1600/SusiAir.jpg', requirements: ['2,000+ hrs TT', 'Mountain Flying', 'Short Field Operations', 'Supply Chain Experience'], type: 'Supply & Logistics', salary: '$60,000 - $95,000/year' },
        { title: 'Flight Tours Operations Pathway', subtitle: 'Tour Operators', match: 75, pr: 0, image: 'https://suncityaviation.com/_astro/sun-city-aviation-academy-why-pilot.CEsqMppz_Z26lmps.webp', requirements: ['500+ hrs TT', 'CPL', 'Customer Service Skills', 'Local Knowledge'], type: 'Commercial Tourism', salary: '$40,000 - $65,000/year' },
        { title: 'Experimental Flight Pathways', subtitle: 'R&D Flight Centers', match: 85, pr: 0, image: 'https://angelesflying.com/wp-content/uploads/2021/03/FB_IMG_1615194966689-e1652932116141.jpg', requirements: ['2,500+ hrs TT', 'Test Pilot Training', 'Engineering Background', 'Risk Assessment'], type: 'Research & Development', salary: '$75,000 - $110,000/year' },
        { title: 'Air Ambulance Pathways', subtitle: 'Medical Transport Services', match: 88, pr: 0, image: 'https://www.lifeflight.org.nz/wp-content/uploads/2023/11/G83_5774-web-800x400.jpg', requirements: ['1,500+ hrs TT', 'IFR Rated', 'Medical Evacuation Experience', 'Night Operations'], type: 'Medical Transport', salary: '$55,000 - $85,000/year' },
        { title: 'Agricultural Crop Dusting Pathway', subtitle: 'Aerial Application Operators', match: 76, pr: 0, image: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Gehling_PZL-106_AR_Kruk_OTT_2013_D7N9017_009.jpg', requirements: ['800+ hrs TT', 'Low-Level Flight Experience', 'Chemical Handling', 'Seasonal Work'], type: 'Agricultural Aviation', salary: '$50,000 - $80,000/year' },
        { title: 'Pipeline & Land Survey Pilotage Pathway', subtitle: 'Aerial Survey Operators', match: 79, pr: 0, image: 'https://www.aopa.org/-/media/Images/AOPA-Main/News-and-Media/Publications/Flight-Training-Magazine/2023/2311/2311f_ap/2311f_ap_career_01/2311f_ap_career_01_16x9.jpg', requirements: ['1,000+ hrs TT', 'Low-Level Survey Flying', 'Photogrammetry', 'Long-Endurance Flights'], type: 'Survey & Inspection', salary: '$55,000 - $85,000/year' },
        { title: 'Aircraft Ownership Pathways', subtitle: 'Private Aircraft Owners / Management Companies', match: 81, pr: 0, image: 'https://media.licdn.com/dms/image/v2/C4E22AQFp1BB6J459Qg/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1662370011016?e=2147483647&v=beta&t=0YKdpSpzhGbUfvRwS8fz-17I1O4i7cq-glY9pA51tMI', requirements: ['2,500+ hrs TT', 'CPL/ATPL', 'Type Ratings Required', 'Personal Aircraft Experience'], type: 'Private Aircraft Operations', salary: '$90,000 - $150,000/year' },
        { title: 'Aerial Firefighting Pathway', subtitle: 'Fire Suppression Operators', match: 77, pr: 0, image: 'https://airtractor.com/wp-content/uploads/2022/03/3_22_22-Wildfire.jpg', requirements: ['1,500+ hrs TT', 'Low-Level Flying', 'Fire Season Experience', 'Tanker Operations'], type: 'Emergency Response', salary: '$65,000 - $95,000/year' },
        { title: 'Arctic & Ice Operations Pathway', subtitle: 'Polar Aviation Services', match: 83, pr: 0, image: 'https://pilotweb.aero/wp-content/uploads/10010287-credit-morag-hunter.jpg', requirements: ['2,000+ hrs TT', 'Cold Weather Ops', 'Skis/Wheel Operations', 'Survival Training'], type: 'Extreme Environment Operations', salary: '$70,000 - $100,000/year' },
        { title: 'Aerial Banner Towing Pathway', subtitle: 'Advertising Aviation Companies', match: 72, pr: 0, image: 'https://t4.ftcdn.net/jpg/01/24/76/11/360_F_124761142_PDxGcICygVGzWa2GirpHIZkbGLLHGzzW.jpg', requirements: ['500+ hrs TT', 'Tailwheel Experience', 'Banner Towing Endorsement', 'Seasonal Flexibility'], type: 'Commercial Advertising', salary: '$35,000 - $55,000/year' },
        { title: 'Aerial Surveillance & Intel Pathway', subtitle: 'Government & Security Contractors', match: 86, pr: 0, image: 'https://cdn.prod.website-files.com/692fd066ee17d3dbb4a3c663/6966cb5ac521befde4d6b818_64343287e557aaecdaa2aaac_02d2f99fdfc8244b75d5b37839674333ab452aa54b89ec98af755e964f4923990053a8035ac4a68f29df5646bc6ca0ef1721a3c7be38e384443cf0c5186e6f37f8b5e90785c9723546f7e01cd676057e2058af389232c88992f8b96a3c734b384d6fc2b9.png', requirements: ['2,500+ hrs TT', 'Security Clearance', 'ISR Experience', 'Multi-Engine Rated'], type: 'Intelligence Operations', salary: '$80,000 - $120,000/year' }
    ];

    // User preference weights (stored in local storage for personalization)
    const userPreferenceWeights = {
        hoursWeight: 0.35,
        recognitionWeight: 0.25,
        licenseWeight: 0.20,
        medicalWeight: 0.10,
        careerAlignmentWeight: 0.05,
        locationWeight: 0.05
    };

    // Adjust user preference weights based on behavior (dating-site learning algorithm)
    const adjustWeightsBasedOnBehavior = () => {
        try {
            const trackingData = JSON.parse(localStorage.getItem('pathwayBehaviorTracking') || '{}');
            const pathwayIds = Object.keys(trackingData);
            
            if (pathwayIds.length === 0) return userPreferenceWeights;

            // Analyze which pathway types user prefers
            const typePreferences: { [key: string]: number } = {};
            pathwayIds.forEach(id => {
                const data = trackingData[id];
                const pathway = pathways.find(p => p.title === id);
                if (pathway) {
                    const type = pathway.type || 'unknown';
                    typePreferences[type] = (typePreferences[type] || 0) + data.clickCount;
                }
            });

            // Adjust weights based on preferences
            const adjustedWeights = { ...userPreferenceWeights };
            const totalInteractions = pathwayIds.reduce((sum, id) => sum + trackingData[id].clickCount, 0);
            
            if (totalInteractions > 5) {
                // User has enough interaction data to personalize
                // Increase weight for categories user engages with most
                const preferredType = Object.entries(typePreferences).sort((a, b) => b[1] - a[1])[0];
                if (preferredType && preferredType[0] !== 'unknown') {
                    // Slightly adjust career alignment weight for preferred types
                    adjustedWeights.careerAlignmentWeight = Math.min(0.15, adjustedWeights.careerAlignmentWeight + 0.05);
                    adjustedWeights.hoursWeight = Math.max(0.25, adjustedWeights.hoursWeight - 0.05);
                }
            }

            return adjustedWeights;
        } catch (e) {
            console.error('localStorage error in adjustWeightsBasedOnBehavior:', e);
            return userPreferenceWeights;
        }
    };

    // Load personalized weights
    const personalizedWeights = adjustWeightsBasedOnBehavior();

    // ATLAS Resume Mock Data
    const atlasResume = {
        totalFlightHours: 200,
        licenses: ['ppl', 'cpl', 'ir', 'multi_engine', 'student'],
        medicalCertificate: 'None',
        overallRecognitionScore: 458,
        // Additional profile dimensions for dating-site accuracy
        careerGoals: ['airline_career', 'captain_goal', 'international_flying'],
        preferredAircraft: ['a320', 'b737', 'regional_jets'],
        willingnessToRelocate: true,
        preferredRegions: ['asia', 'middle_east', 'europe'],
        experienceLevel: 'entry_level',
        ageRange: '18-30',
        educationLevel: 'bachelor',
        languageProficiency: ['english', 'native'],
        riskTolerance: 'moderate',
        workLifeBalancePreference: 'balanced'
    };

    // Calculate multi-dimensional match score (dating-site algorithm)
    const calculateMatchPercentage = (pathway: any): number => {
        let totalScore = 0;
        let maxPossibleScore = 0;
        const weights = personalizedWeights; // Use personalized weights from behavior tracking

        // 1. Hours compatibility (35% weight) - with logarithmic scaling
        const hourReq = pathway.requirements.find((r: string) => r.includes('hrs') || r.includes('hours'));
        if (hourReq) {
            const reqHours = parseInt(hourReq.match(/\d+/)?.[0] || '0');
            maxPossibleScore += weights.hoursWeight * 100;

            // Logarithmic scaling for realistic matching
            if (reqHours <= atlasResume.totalFlightHours) {
                totalScore += weights.hoursWeight * 100;
            } else if (reqHours <= atlasResume.totalFlightHours * 2) {
                // Partial match with diminishing returns
                const ratio = atlasResume.totalFlightHours / reqHours;
                totalScore += weights.hoursWeight * 100 * (ratio * 0.7 + 0.3);
            } else {
                // Significant gap but still some potential
                const ratio = atlasResume.totalFlightHours / reqHours;
                totalScore += weights.hoursWeight * 100 * (ratio * 0.3);
            }
        } else {
            maxPossibleScore += weights.hoursWeight * 100;
            totalScore += weights.hoursWeight * 100; // No requirement, full match
        }

        // 2. Recognition score compatibility (25% weight) - with tiered matching
        maxPossibleScore += weights.recognitionWeight * 100;
        if (atlasResume.overallRecognitionScore >= 450) {
            totalScore += weights.recognitionWeight * 100;
        } else if (atlasResume.overallRecognitionScore >= 400) {
            totalScore += weights.recognitionWeight * 90;
        } else if (atlasResume.overallRecognitionScore >= 350) {
            totalScore += weights.recognitionWeight * 75;
        } else if (atlasResume.overallRecognitionScore >= 300) {
            totalScore += weights.recognitionWeight * 60;
        } else if (atlasResume.overallRecognitionScore >= 200) {
            totalScore += weights.recognitionWeight * 40;
        } else {
            totalScore += weights.recognitionWeight * 20;
        }

        // 3. License compatibility (20% weight) - with partial credit
        const licenseReq = pathway.requirements.find((r: string) => r.toLowerCase().includes('cpl') || r.toLowerCase().includes('commercial'));
        maxPossibleScore += weights.licenseWeight * 100;
        if (licenseReq) {
            if (atlasResume.licenses.includes('cpl') || atlasResume.licenses.includes('commercial')) {
                totalScore += weights.licenseWeight * 100;
            } else if (atlasResume.licenses.includes('ppl')) {
                totalScore += weights.licenseWeight * 60; // PPL is partial credit
            } else {
                totalScore += weights.licenseWeight * 10; // Still some potential
            }
        } else {
            totalScore += weights.licenseWeight * 100;
        }

        // 4. Medical certificate (10% weight) - binary
        maxPossibleScore += weights.medicalWeight * 100;
        if (atlasResume.medicalCertificate !== 'None' && atlasResume.medicalCertificate !== null) {
            totalScore += weights.medicalWeight * 100;
        } else {
            totalScore += weights.medicalWeight * 30; // Still achievable
        }

        // 5. Career alignment (5% weight) - matches user's career goals
        maxPossibleScore += weights.careerAlignmentWeight * 100;
        const pathwayType = pathway.type?.toLowerCase() || '';
        if (atlasResume.careerGoals.some(goal => pathwayType.includes(goal.replace('_', ' ')))) {
            totalScore += weights.careerAlignmentWeight * 100;
        } else if (pathwayType.includes('cadet') || pathwayType.includes('program')) {
            totalScore += weights.careerAlignmentWeight * 80; // Training programs align with entry level
        } else {
            totalScore += weights.careerAlignmentWeight * 50;
        }

        // 6. Location preference (5% weight) - based on willingness to relocate
        maxPossibleScore += weights.locationWeight * 100;
        const pathwayRegion = pathway.subtitle?.toLowerCase() || '';
        if (atlasResume.willingnessToRelocate) {
            totalScore += weights.locationWeight * 100;
        } else if (atlasResume.preferredRegions.some(region => pathwayRegion.includes(region))) {
            totalScore += weights.locationWeight * 100;
        } else {
            totalScore += weights.locationWeight * 40;
        }

        // Calculate final percentage
        const matchPercentage = Math.round((totalScore / maxPossibleScore) * 100);

        // Apply confidence interval (dating sites show ranges)
        const confidenceMargin = Math.round(5 * (1 - matchPercentage / 100)); // Higher confidence for higher matches
        const finalMatch = Math.max(0, Math.min(100, matchPercentage));

        return finalMatch;
    };

    // Update pathways with calculated match percentages
    const pathwaysWithMatches = pathways.map(pathway => ({
        ...pathway,
        match: calculateMatchPercentage(pathway)
    }));

    const filteredPathways = pathwaysWithMatches.filter(pathway => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'low') return pathway.match < 50;
        if (activeFilter === 'middle') return pathway.match >= 50 && pathway.match < 80;
        if (activeFilter === 'high') return pathway.match >= 80;
        return true;
    });

    const getMatchColor = (match: number) => {
        if (match < 50) return 'bg-red-100 text-red-700';
        if (match >= 50 && match < 80) return 'bg-amber-100 text-amber-700';
        return 'bg-green-100 text-green-700';
    };

    // Initialize selected pathway to first one
    useEffect(() => {
        if (!selectedPathway && pathwaysWithMatches.length > 0) {
            setSelectedPathway(pathwaysWithMatches[0]);
        }
    }, [pathwaysWithMatches]);

    return (
        <>
            <BreadcrumbSchema items={[
                { name: 'Home', url: '/' },
                { name: 'Pilot Recognition', url: '/pilot-recognition' },
                { name: 'Career Matches', url: '/recognition-career-matches' }
            ]} />
            <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <img
                        src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                        alt="WingMentor Logo"
                        className="mx-auto w-64 h-auto object-contain mb-2"
                    />
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        Career Matching
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                        Recognition Career Matches
                    </h1>
                    <p className="text-base md:text-lg text-slate-700 max-w-3xl mx-auto mt-6">
                        Your <strong>Pilot Recognition Profile</strong> automatically matches you with career opportunities that align with your skills, experience, and professional standing.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 pb-20">
                {/* Section 1: How It Works */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        How It Works
                    </p>
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4">
                        Intelligent Matching System
                    </h2>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        Our <strong>recognition-based matching algorithm</strong> analyzes your <strong>Pilot Recognition Score</strong>, flight hours, certifications, and competency assessments to identify the most suitable career opportunities. Unlike traditional job boards that rely on manual resume screening, our system uses <strong>AI-powered matching</strong> to connect you with positions where you're most likely to succeed.
                    </p>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        The system continuously updates your match percentage as you log new flight hours, complete training programs, and achieve new certifications. This ensures that your profile always reflects your current capabilities and readiness for career advancement.
                    </p>
                </div>

                {/* Section 2: ATLAS CV Resume Card */}
                <div className="mb-16">
                    <div style={{ maxWidth: '80rem', margin: '0 auto', background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
                        {/* Header Card */}
                        <div style={{ background: '#dc2626', padding: '1.25rem 1.5rem', borderBottom: '1px solid #b91c1c' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.625rem', color: '#fecaca', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.25rem' }}>Pilot Recognition Profile</p>
                                    <h4 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Benjamin Bowler</h4>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#fecaca' }}>WingMentor Recognition Portfolio</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: 0, fontSize: '0.625rem', color: '#fecaca', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>SHARE LINK</p>
                                    <button style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid #fca5a5', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 500, color: '#b91c1c', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                                        Copy shareable resume URL
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                {/* Pilot Credentials */}
                                <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #e2e8f0' }}>
                                    <h5 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Pilot Credentials</h5>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>Licensing, hours, and access pass</p>
                                    
                                    {/* Flight Hours Grid - 4 boxes */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem', textAlign: 'center' }}>
                                            <p style={{ margin: 0, fontSize: '0.625rem', color: '#64748b', marginBottom: '0.25rem' }}>Total Hours</p>
                                            <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>200</p>
                                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.65rem', color: '#f59e0b', fontWeight: 500 }}>(unverified)</p>
                                        </div>
                                        <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem', textAlign: 'center' }}>
                                            <p style={{ margin: 0, fontSize: '0.625rem', color: '#64748b', marginBottom: '0.25rem' }}>Recency</p>
                                            <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>N/A</p>
                                        </div>
                                        <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem', textAlign: 'center' }}>
                                            <p style={{ margin: 0, fontSize: '0.625rem', color: '#64748b', marginBottom: '0.25rem' }}>Foundation</p>
                                            <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>45%</p>
                                        </div>
                                        <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem', textAlign: 'center' }}>
                                            <p style={{ margin: 0, fontSize: '0.625rem', color: '#64748b', marginBottom: '0.25rem' }}>Recognition</p>
                                            <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>458</p>
                                        </div>
                                    </div>

                                    {/* Additional Experience Metrics */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.5rem', textAlign: 'center' }}>
                                            <p style={{ margin: 0, fontSize: '0.6rem', color: '#64748b', marginBottom: '0.15rem' }}>Cross-Country</p>
                                            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>125</p>
                                        </div>
                                        <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.5rem', textAlign: 'center' }}>
                                            <p style={{ margin: 0, fontSize: '0.6rem', color: '#64748b', marginBottom: '0.15rem' }}>Night Hours</p>
                                            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>35</p>
                                        </div>
                                        <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.5rem', textAlign: 'center' }}>
                                            <p style={{ margin: 0, fontSize: '0.6rem', color: '#64748b', marginBottom: '0.15rem' }}>Instrument</p>
                                            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>50</p>
                                        </div>
                                    </div>

                                    {/* Type & Status */}
                                    <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Type</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Commercial Pilot</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Status</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>Verified</span>
                                        </div>
                                    </div>

                                    <a href="#" style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        View Flight Digital Logbook <span>→</span>
                                    </a>
                                </div>

                                {/* Training */}
                                <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #e2e8f0' }}>
                                    <h5 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Training</h5>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Licenses</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>CPL, IR, ME, PPL</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Medical</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>Class 1 Valid</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Type Ratings</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Multi-Engine</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>English Proficiency</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Level 6 (Expert)</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Languages</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>English, Spanish</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Readiness Snapshot */}
                                <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #e2e8f0' }}>
                                    <h5 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>READINESS SNAPSHOT</h5>
                                    <h6 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Resource & Availability</h6>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Medical Certificate</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>Valid Until Aug 2026</span>
                                        </div>
                                        <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Last Flown</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>N/A</span>
                                        </div>
                                        <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Recognition Score</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>458/500</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Job Experience Section */}
                            <div style={{ marginTop: '1rem', background: 'white', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                    <h5 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>Recent Job Experience & Industry Aligned Accredited Programs</h5>
                                    <a href="#" style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        Edit Experience <span>→</span>
                                    </a>
                                </div>
                                
                                {/* Job Experience Entry */}
                                <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <div>
                                            <h6 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Flight Instructor & Check Pilot</h6>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Skyway Aviation Academy</p>
                                        </div>
                                        <span style={{ fontSize: '0.625rem', color: '#94a3b8' }}>Jan 2024 - Present</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#475569', lineHeight: 1.6 }}>
                                        Flight instructor with 777 total hours specializing in CPL and PPL training. Expert in instrument flight rules (IFR), multi-engine operations, and advanced navigation techniques. Conducting check rides, mentoring student pilots, and developing comprehensive training programs. Proven track record of high student pass rates and safety excellence.
                                    </p>
                                </div>

                                {/* Foundation Program Experience Entry */}
                                <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <div>
                                            <h6 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Foundation Program Graduate</h6>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>AIRBUS EBT CBTA Aligned Training</p>
                                        </div>
                                        <span style={{ fontSize: '0.625rem', color: '#94a3b8' }}>2023</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#475569', lineHeight: 1.6 }}>
                                        Completed foundation program aligned with AIRBUS EBT CBTA (Evidence-Based Training Competency-Based Training and Assessment). Achieved recognition score of 82/100 and overall recurrence exam score of 95/100. Actively participated in mentorship programs, guiding junior pilots through competency development and evidence-based training methodologies. Demonstrated excellence in evidence-based training principles and competency assessment frameworks.
                                    </p>
                                </div>

                                {/* Certification & Evaluation Interview Entry */}
                                <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <div>
                                            <h6 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Initial Recognition Portfolio Certification</h6>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>AIRBUS Aligned Evaluation Interview</p>
                                        </div>
                                        <span style={{ fontSize: '0.625rem', color: '#94a3b8' }}>2023</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#475569', lineHeight: 1.6 }}>
                                        Successfully completed initial recognition portfolio certification through AIRBUS aligned evaluation interview. Demonstrated competency in evidence-based training principles, competency-based assessment, and pilot recognition framework. Evaluated on technical knowledge, situational awareness, decision-making skills, and adherence to safety standards. Certification validates readiness for advanced training programs and career progression opportunities.
                                    </p>
                                </div>
                                
                                <a href="#" style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    Add your job experience <span>→</span>
                                </a>
                            </div>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '0.75rem 1.5rem', borderTop: '1px solid #e2e8f0' }}>
                            <p style={{ margin: 0, fontSize: '0.625rem', color: '#64748b', textAlign: 'center' }}>
                                This resume is ATS-approved and optimized for airline recruitment systems
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 2.5: Header between ATLAS and Pathways */}
                <div className="mb-20">
                    <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '4rem', marginBottom: '6rem', textAlign: 'center' }}>
                        <img src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png" alt="WingMentor" style={{ margin: '0 auto', width: '16rem', height: 'auto', objectFit: 'contain', marginBottom: '2rem' }} />
                        <p style={{ margin: 0, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600 }}>
                            Next Steps
                        </p>
                        <h2 style={{ 
                            margin: '0.5rem 0 0', 
                            fontSize: '4rem', 
                            fontWeight: 'normal', 
                            fontFamily: 'Georgia, serif', 
                            color: '#0f172a', 
                            letterSpacing: '-0.02em' 
                        }}>
                            Your Recognition Radar.
                        </h2>
                        <p style={{ margin: '0.5rem 0 0', color: '#475569', fontSize: '1rem' }}>
                            Explore career pathways matched to your profile
                        </p>
                    </div>
                </div>

                {/* Section 3: Recommended Pathways (Static Mock for SEO) */}
                <div className="mb-16">
                    <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '-3rem', marginBottom: '6rem' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600 }}>
                            Discover Recommended Pathways
                        </p>
                        <h2 style={{ 
                            margin: '0.5rem 0 0', 
                            fontSize: '3rem', 
                            fontWeight: 'normal', 
                            fontFamily: 'Georgia, serif', 
                            color: '#0f172a', 
                            letterSpacing: '-0.02em' 
                        }}>
                            Recommended Pathways
                        </h2>
                        <p style={{ margin: '0.5rem 0 0', color: '#475569', fontSize: '1rem' }}>
                            Explore career pathways matched to your profile
                        </p>
                    </div>

                    {/* Filters and Score */}
                    <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: '0.5rem' }}>
                        {/* Filters on left */}
                        <div style={{ position: 'absolute', left: '1.5rem', display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                            <div onClick={() => setActiveFilter('low')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '0.5rem', background: activeFilter === 'low' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.15)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: activeFilter === 'low' ? '2px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(239, 68, 68, 0.3)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s ease' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)' }}></div>
                                <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 600 }}>Low Match</span>
                            </div>
                            <div onClick={() => setActiveFilter('middle')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '0.5rem', background: activeFilter === 'middle' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.15)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: activeFilter === 'middle' ? '2px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(245, 158, 11, 0.3)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s ease' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px rgba(245, 158, 11, 0.5)' }}></div>
                                <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 600 }}>Middle Match</span>
                            </div>
                            <div onClick={() => setActiveFilter('high')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '0.5rem', background: activeFilter === 'high' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.15)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: activeFilter === 'high' ? '2px solid rgba(34, 197, 94, 0.5)' : '1px solid rgba(34, 197, 94, 0.3)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s ease' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)' }}></div>
                                <span style={{ fontSize: '0.7rem', color: '#22c55e', fontWeight: 600 }}>High Match</span>
                            </div>
                            <div onClick={() => setActiveFilter('all')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '0.5rem', background: activeFilter === 'all' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(148, 163, 184, 0.15)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: activeFilter === 'all' ? '2px solid rgba(148, 163, 184, 0.5)' : '1px solid rgba(148, 163, 184, 0.3)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s ease' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94a3b8', boxShadow: '0 0 8px rgba(148, 163, 184, 0.5)' }}></div>
                                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>All</span>
                            </div>
                        </div>

                        {/* Swipe instruction centered */}
                        <p style={{ 
                            fontSize: '0.875rem', 
                            color: '#94a3b8', 
                            fontStyle: 'italic',
                            margin: 0
                        }}>
                            Swipe left and right or click to select a card
                        </p>

                        {/* Overall Profile Score on right */}
                        <div style={{ position: 'absolute', right: '1.5rem', top: '-5rem', background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(241,245,249,0.8))', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 12px rgba(15,23,42,0.1)', cursor: 'help', minWidth: '220px', textAlign: 'right' }}>
                            <p style={{ margin: 0, fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.125rem' }}>
                                Overall Profile Score
                            </p>
                            <div style={{ fontSize: '0.6rem', color: '#64748b' }}>
                                <div style={{ marginBottom: '0.0625rem' }}>
                                    Flight Hours: 200 <span style={{ fontSize: '0.6rem', fontWeight: 500, color: '#f59e0b' }}>(unverified)</span>
                                </div>
                                <div style={{ marginBottom: '0.0625rem' }}>
                                    Recency: N/A
                                </div>
                                <div>
                                    Recognition: 0
                                </div>
                            </div>
                            <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 'normal', fontFamily: 'Georgia, serif', color: '#0f172a', lineHeight: 1 }}>
                                0
                            </h3>
                        </div>
                    </div>

                    {/* Pathway Cards Carousel (Static Mock) */}
                    <div style={{ position: 'relative', width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '0', paddingRight: '0', marginTop: '0.5rem' }}>
                        <style>{`
                            .scrollbar-hide::-webkit-scrollbar {
                                display: none;
                            }
                            .scrollbar-hide {
                                -ms-overflow-style: none;
                                scrollbar-width: none;
                            }
                            .snap-scroll {
                                scroll-snap-type: x mandatory;
                                scroll-padding-left: 3rem;
                                scroll-padding-right: 3rem;
                            }
                            .snap-scroll > div {
                                scroll-snap-align: center;
                                scroll-snap-stop: always;
                            }
                        `}</style>
                        <div
                            style={{
                                display: 'flex',
                                gap: '1.5rem',
                                overflowX: 'scroll',
                                overflowY: 'hidden',
                                paddingBottom: '1rem',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                overscrollBehaviorX: 'none',
                                WebkitOverflowScrolling: 'touch',
                                width: '100%',
                                maxWidth: '100%',
                                paddingLeft: '3rem',
                                paddingRight: '3rem'
                            }}
                            className="snap-scroll scrollbar-hide"
                        >
                            {filteredPathways.map((pathway, index) => (
                                <div
                                    key={index}
                                    style={{
                                        flexShrink: 0,
                                        width: '600px',
                                        cursor: 'pointer',
                                        border: selectedPathway?.title === pathway.title ? '3px solid #0ea5e9' : '3px solid transparent',
                                        borderRadius: '1rem',
                                        padding: '3px',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onClick={() => {
                                        trackPathwayInteraction(pathway, 'click');
                                        setSelectedPathway(pathwaysWithMatches.find(p => p.title === pathway.title) || pathway);
                                    }}
                                >
                                    <div style={{ borderRadius: '0.75rem', overflow: 'hidden', position: 'relative', height: '300px' }}>
                                        <img
                                            src={pathway.image}
                                            alt={pathway.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                        />
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent 40%)' }} />

                                        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                            <div style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '999px',
                                                background: pathway.match < 50 ? 'rgba(239, 68, 68, 0.9)' : pathway.match >= 50 && pathway.match < 80 ? 'rgba(245, 158, 11, 0.9)' : 'rgba(16, 185, 129, 0.9)',
                                                color: 'white',
                                                fontSize: '0.75rem',
                                                fontWeight: 600
                                            }}>
                                                {pathway.match}% Match
                                            </div>
                                            <div style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'rgba(14, 165, 233, 0.9)', color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
                                                PR: {pathway.pr}
                                            </div>
                                        </div>

                                        <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '1rem', background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95), transparent)', textAlign: 'center' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 'normal', color: 'white', fontFamily: 'Georgia, serif', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                                {pathway.title}
                                            </h4>
                                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                                                {pathway.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem' }}>
                        <button style={{
                            padding: '0.75rem',
                            borderRadius: '50%',
                            border: '1px solid #e2e8f0',
                            background: 'white',
                            color: '#64748b',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <ChevronLeft size={20} />
                        </button>

                        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
                            <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.5rem' }}>
                                Selected Pathway
                            </p>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'normal', color: '#0f172a', marginBottom: '0.5rem', fontFamily: 'Georgia, serif' }}>
                                {selectedPathway?.title || 'Select a pathway'}
                            </h3>
                        </div>

                        <button style={{
                            padding: '0.75rem',
                            borderRadius: '50%',
                            border: '1px solid #e2e8f0',
                            background: 'white',
                            color: '#64748b',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Section 3: Selected Pathway (Dynamic based on selection) */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-2">
                                    Selected Pathway
                                </p>
                                <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-2">
                                    {selectedPathway?.title || 'Select a pathway'}
                                </h2>
                                <p className="text-lg text-slate-600">{selectedPathway?.subtitle || ''}</p>
                            </div>
                            <div className={`${getMatchColor(selectedPathway?.match || 0)} px-4 py-2 rounded-lg`}>
                                <span className="text-2xl font-bold">{selectedPathway?.match || 0}%</span>
                                <span className="text-sm font-medium ml-1">Match</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-6 mb-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                Why this pathway is recommended to you
                            </h3>
                            <p className="text-slate-700 leading-relaxed">
                                Based on your profile, this pathway has a {selectedPathway?.match || 0}% match. Your recognition score of 458 indicates alignment with this program's requirements. This pathway is one of the best starting points to build your recognition profile score throughout your pilot career, setting a foundation for future opportunities.
                            </p>
                        </div>

                        <div className="border-t border-slate-200 pt-6">
                            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', letterSpacing: '0.1em', color: '#dc2626', fontWeight: 700, textTransform: 'uppercase' }}>
                                    REQUIREMENTS & PROFILE ALIGNMENT
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                                    <div>
                                        <span style={{ fontWeight: 600 }}>Updated:</span>
                                        <span> {new Date().toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                        <span style={{ fontWeight: 600 }}>Source:</span>
                                        <span> Job Board</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', background: 'rgba(14, 165, 233, 1)', borderRadius: '0.25rem' }}>
                                        <span style={{ color: 'white', fontWeight: 600 }}>Airline Verified</span>
                                    </div>
                                </div>
                            </div>

                            {/* Flight Hours Section */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase' }}>
                                    FLIGHT HOURS
                                </p>
                                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                                    Your account shows: 200 total flight hours
                                </p>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid rgba(203, 213, 225, 0.5)' }}>
                                            <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Requirement</th>
                                            <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                            <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{ borderBottom: '1px solid rgba(203, 213, 225, 0.2)' }}>
                                            <td style={{ padding: '0.75rem', color: '#0f172a', fontWeight: 500 }}>
                                                {selectedPathway?.requirements?.find(r => r.includes('hrs') || r.includes('hours')) || selectedPathway?.requirements?.[0] || 'Flight Hours'}
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '0.25rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    background: (() => {
                                                        const hourReq = selectedPathway?.requirements?.find(r => r.includes('hrs') || r.includes('hours'));
                                                        if (!hourReq) return 'rgba(34, 197, 94, 0.1)';
                                                        const reqHours = parseInt(hourReq.match(/\d+/)?.[0] || '0');
                                                        return reqHours <= 200 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                                                    })(),
                                                    color: (() => {
                                                        const hourReq = selectedPathway?.requirements?.find(r => r.includes('hrs') || r.includes('hours'));
                                                        if (!hourReq) return '#15803d';
                                                        const reqHours = parseInt(hourReq.match(/\d+/)?.[0] || '0');
                                                        return reqHours <= 200 ? '#15803d' : '#dc2626';
                                                    })()
                                                }}>
                                                    {(() => {
                                                        const hourReq = selectedPathway?.requirements?.find(r => r.includes('hrs') || r.includes('hours'));
                                                        if (!hourReq) return '✓ Met';
                                                        const reqHours = parseInt(hourReq.match(/\d+/)?.[0] || '0');
                                                        return reqHours <= 200 ? '✓ Met' : '✗ Not Met';
                                                    })()}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem', color: '#64748b', fontSize: '0.8rem' }}>
                                                {(() => {
                                                    const hourReq = selectedPathway?.requirements?.find(r => r.includes('hrs') || r.includes('hours'));
                                                    if (!hourReq) return 'You have sufficient hours';
                                                    const reqHours = parseInt(hourReq.match(/\d+/)?.[0] || '0');
                                                    return reqHours <= 200 ? 'You have sufficient hours' : `You have 200 hours, need ${reqHours}+ hours`;
                                                })()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Licenses Section */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase' }}>
                                    LICENSES
                                </p>
                                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                                    Your account shows: ppl, cpl, ir, multi_engine, student
                                </p>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid rgba(203, 213, 225, 0.5)' }}>
                                            <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Requirement</th>
                                            <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                            <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{ borderBottom: '1px solid rgba(203, 213, 225, 0.2)' }}>
                                            <td style={{ padding: '0.75rem', color: '#0f172a', fontWeight: 500 }}>
                                                Commercial Pilot License
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '0.25rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    background: 'rgba(34, 197, 94, 0.1)',
                                                    color: '#15803d'
                                                }}>
                                                    ✓ Met
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem', color: '#64748b', fontSize: '0.8rem' }}>
                                                License requirement met
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Medical Section */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase' }}>
                                    MEDICAL
                                </p>
                                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                                    Your account shows: None
                                </p>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid rgba(203, 213, 225, 0.5)' }}>
                                            <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Requirement</th>
                                            <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                            <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{ borderBottom: '1px solid rgba(203, 213, 225, 0.2)' }}>
                                            <td style={{ padding: '0.75rem', color: '#0f172a', fontWeight: 500 }}>
                                                Class 1 Medical
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '0.25rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    color: '#dc2626'
                                                }}>
                                                    ✗ Not Met
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem', color: '#64748b', fontSize: '0.8rem' }}>
                                                Medical certificate not valid or expired
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Certifications Section */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase' }}>
                                    CERTIFICATIONS
                                </p>
                                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                                    Your account shows: 0 certifications on file
                                </p>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid rgba(203, 213, 225, 0.5)' }}>
                                            <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Requirement</th>
                                            <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                            <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedPathway?.requirements?.filter(r => r.includes('Citizen') || r.includes('Resident') || r.includes('Eligible')).map((req, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid rgba(203, 213, 225, 0.2)' }}>
                                                <td style={{ padding: '0.75rem', color: '#0f172a', fontWeight: 500 }}>
                                                    {req}
                                                    <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>
                                                        (Citizenship required)
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.75rem' }}>
                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '0.25rem',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                        color: '#dc2626'
                                                    }}>
                                                        ✗ Not Met
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.75rem', color: '#64748b', fontSize: '0.8rem' }}>
                                                    Missing {req}
                                                </td>
                                            </tr>
                                        ))}
                                        {selectedPathway?.requirements?.filter(r => r.includes('FAA') || r.includes('License')).map((req, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid rgba(203, 213, 225, 0.2)' }}>
                                                <td style={{ padding: '0.75rem', color: '#0f172a', fontWeight: 500 }}>
                                                    {req}
                                                </td>
                                                <td style={{ padding: '0.75rem' }}>
                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '0.25rem',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                        color: '#dc2626'
                                                    }}>
                                                        ✗ Not Met
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.75rem', color: '#64748b', fontSize: '0.8rem' }}>
                                                    Missing {req}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Why Your Profile Matches Section */}
                            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.05)', borderRadius: '0.5rem', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0ea5e9', fontWeight: 600 }}>
                                    Why Your Profile Matches
                                </p>
                                <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                                    Your profile shows a {selectedPathway?.match || 0}% match based on your selected interests during sign-up (Commercial Pilot License, Foundation Program, Airline Expectations, Flight Instruction Excellence) and your recognition score of 458. This pathway aligns with your career progression goals and industry interests selected in your WingMentor profile.
                                </p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button style={{
                                    padding: '0.75rem 2rem',
                                    background: '#0ea5e9',
                                    color: 'white',
                                    fontWeight: 700,
                                    borderRadius: '0.5rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem'
                                }}>
                                    Discover {selectedPathway?.title || 'Pathway'} →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 4: Benefits */}
                <div className="text-center max-w-4xl mx-auto">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        Advantages
                    </p>
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4">
                        Why Recognition-Based Matching
                    </h2>
                    <h4 className="text-xl font-bold text-slate-900 mb-3 mt-6">The Problem with Traditional Job Boards</h4>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        Traditional job applications often result in your resume being lost in a sea of applications, with little guarantee that hiring managers will even see your qualifications. Our recognition-based matching system ensures that your profile is <strong>actively presented</strong> to airlines and operators who are looking for pilots with your specific qualifications and experience level.
                    </p>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        Approximately <strong>70% of airline inboxes</strong> are filled with pilots inquiring about requirements and seeking up-to-date information since job boards post one-time listings. Instead of applying to airlines, we're <strong>transforming the recruitment process</strong> so that <strong>airlines come to you</strong> based on your pilot recognition profile.
                    </p>

                    <h4 className="text-xl font-bold text-slate-900 mb-3 mt-6">Industry Collaboration</h4>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        For example, the Pilot-recognition WM Pilot Group attends annual meetings with airlines to present our community of more than <strong>5,000 pilots</strong> on pilotrecognition.com who are seeking answers and opportunities. We are working with <strong>Airbus representatives</strong> under the head of training with EBT CBTA, recognizing that <strong>communication between pilots and the industry must be bridged</strong>.
                    </p>

                    <h4 className="text-xl font-bold text-slate-900 mb-3 mt-6">The Pilot Talent Crisis</h4>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        Many pilots <strong>give up after 2 years</strong> because they cannot rely on the traditional system. My good friend Daniel is a pilot with a credible background and family history with AIRBUS. He spent approximately <strong>$80,000 USD</strong> on an <strong>ATR 72-600 type rating</strong> yet still achieved <strong>no recognition</strong>. He called me one day and said, "Ben, I quit flying. If I don't stop now, I will never get my ROI back."
                    </p>

                    <h4 className="text-xl font-bold text-slate-900 mb-3 mt-6">Our Mission</h4>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        This experience inspired me, <strong>Benjamin Tiger Bowler - Founder</strong>, as a pilot who took a developer course to solve this <strong>pilot-centric issue</strong>. Pilot Recognition is an application <strong>made for pilots by pilots</strong> to provide the advocacy and recognition they deserve in the industry. There is a <strong>massive talent loss</strong> occurring, and many of the biggest industry companies like Airbus agree that this crisis exists. That is why we're solving the <a href="#" className="text-blue-600 hover:underline">pilot gap</a>.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">AI-Powered Matching</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">Verified Credentials</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">Real-Time Updates</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">Industry Connections</span>
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
        </>
    );
};
