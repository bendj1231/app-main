export type MilitaryBranch = 'All' | 'Air Force' | 'Navy' | 'Army' | 'Marine Corps' | 'RAF' | 'Coast Guard' | 'Police' | 'Defense Contractor';

export interface MilitaryPathway {
  id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  serviceCommitment: string;
  image: string;
  branch: MilitaryBranch;
}

export const DUMMY_MILITARY_PATHWAYS: MilitaryPathway[] = [
  {
    id: 'military-intro',
    name: 'Military Flight Training',
    description: 'Welcome to Military Flight Training. Navigate through our carousel to discover military aviation pathways across different branches. Click on any card to learn more about their programs.',
    location: 'United States',
    rating: 5.0,
    serviceCommitment: 'N/A',
    image: '',
    branch: 'All' as MilitaryBranch
  },
  // Air Force
  {
    id: 'military-1',
    name: 'US Air Force Academy',
    description: 'Premier officer commissioning source with world-class flight training. Offers bachelor\'s degree and guaranteed pilot training for selected candidates. Competitive selection with rigorous academic and physical requirements.',
    location: 'Colorado Springs, Colorado',
    rating: 4.9,
    serviceCommitment: '10 years',
    image: 'https://www.airandspaceforces.com/app/uploads/2020/07/6255683-scaled.jpg',
    branch: 'Air Force' as MilitaryBranch
  },
  {
    id: 'military-2',
    name: 'Air Force ROTC',
    description: 'College-based commissioning program with flight training opportunities. Scholarships available for qualified students. Flight training through specialized programs after commissioning.',
    location: 'Nationwide',
    rating: 4.7,
    serviceCommitment: '8-10 years',
    image: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/frames/video/2208/855196/DOD_109182983.0000001/2000w_q95.jpg',
    branch: 'Air Force' as MilitaryBranch
  },
  {
    id: 'military-3',
    name: 'Air Force OTS',
    description: 'Officer Training School for college graduates seeking commission. Accelerated 12-week program with subsequent flight training for selected officers.',
    location: 'Maxwell AFB, Alabama',
    rating: 4.6,
    serviceCommitment: '8-10 years',
    image: 'https://www.airforce.com/content/dam/airforce/en/dm-test/OTS_dmHeader.jpg',
    branch: 'Air Force' as MilitaryBranch
  },
  // Navy
  {
    id: 'military-4',
    name: 'NATO',
    description: 'NATO provides opportunities for military pilots through cooperative programs and training exercises. International aviation training and collaboration across allied nations.',
    location: 'International',
    rating: 4.9,
    serviceCommitment: 'Varies',
    image: 'https://www.collectivemag.com/wp-content/uploads/2026/03/pilote-suede-1024x771.jpg',
    branch: 'Navy' as MilitaryBranch
  },
  {
    id: 'military-5',
    name: 'RAF',
    description: 'Royal Air Force offers world-class flight training and career opportunities for military pilots. Elite aviation training with advanced aircraft and international operations.',
    location: 'United Kingdom',
    rating: 4.9,
    serviceCommitment: '12 years',
    image: 'https://www.raf.mod.uk/sites/raf-beta/assets/Image/A%20Main%20RAF%20News%20Imagery/CRN-OFFICIAL-20200521-0425-0004.jpg',
    branch: 'RAF' as MilitaryBranch
  },
  {
    id: 'military-6',
    name: 'OCS (Navy)',
    description: 'Officer Candidate School for college graduates. Intensive 12-week training program with aviation selection opportunities for qualified candidates.',
    location: 'Newport, Rhode Island',
    rating: 4.6,
    serviceCommitment: '8-10 years',
    image: 'https://bloximages.chicago2.vip.townnews.com/militarynews.com/content/tncms/assets/v3/editorial/2/cc/2cc822e2-49a6-590e-be02-0139f6f2583a/4cacf4f731220.image.jpg',
    branch: 'Navy' as MilitaryBranch
  },
  // Army
  {
    id: 'military-7',
    name: 'West Point',
    description: 'United States Military Academy with aviation career tracks. Comprehensive education with flight training for selected cadets. Elite officer commissioning program.',
    location: 'West Point, New York',
    rating: 4.9,
    serviceCommitment: '8-10 years',
    image: 'https://api.army.mil/e2/c/images/2022/03/25/96646228/original.jpg',
    branch: 'Army' as MilitaryBranch
  },
  {
    id: 'military-8',
    name: 'Army ROTC',
    description: 'Reserve Officers\' Training Corps for college students. Aviation branch selection for qualified cadets. Scholarships available nationwide.',
    location: 'Nationwide',
    rating: 4.7,
    serviceCommitment: '8 years',
    image: 'https://www.nsu.edu/NSU/media/Photos/2022/rotc/TM50003-A11-NSU-ROTC-017.jpg',
    branch: 'Army' as MilitaryBranch
  },
  {
    id: 'military-9',
    name: 'OCS (Army)',
    description: 'Officer Candidate School for college graduates. 12-week training program with aviation branch selection opportunities.',
    location: 'Fort Benning, Georgia',
    rating: 4.6,
    serviceCommitment: '8 years',
    image: 'https://www.goarmy.com/content/dam/goarmy/heros/officer-candidate-school-induction_lg.jpg',
    branch: 'Army' as MilitaryBranch
  },
  {
    id: 'military-13',
    name: 'Rotary-Wing Aviator (153A)',
    description: 'The primary helicopter pilots who operate the AH-64 Apache, UH-60 Black Hawk, and CH-47 Chinook.',
    location: 'Fort Rucker, Alabama',
    rating: 4.8,
    serviceCommitment: '6 years',
    image: 'https://armyaviationmagazine.com/images/articles/15_12/cwob_a.jpg',
    branch: 'Army' as MilitaryBranch
  },
  {
    id: 'military-14',
    name: 'Fixed-Wing Aviator (155A)',
    description: 'Responsible for flying the Army\'s fixed-wing fleet for intelligence gathering and transport.',
    location: 'Fort Rucker, Alabama',
    rating: 4.7,
    serviceCommitment: '6 years',
    image: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2306/7856835/2000w_q95.jpg',
    branch: 'Army' as MilitaryBranch
  },
  {
    id: 'military-15',
    name: 'Aviation Officer (15A)',
    description: 'Pilots who also serve as leaders and mission commanders, overseeing flight platoons and coordination.',
    location: 'Fort Rucker, Alabama',
    rating: 4.9,
    serviceCommitment: '8-10 years',
    image: 'https://www.adfcareers.gov.au/-/media/ADF/jobs/Air-Force/officer-aviation/New-Hero-Image-Aviation-Officer.jpg?sc_lang=en',
    branch: 'Army' as MilitaryBranch
  },
  {
    id: 'military-16',
    name: 'Unmanned Aircraft Systems Operator (15W)',
    description: 'Often referred to as "drone pilots," they operate UAVs for reconnaissance and surveillance.',
    location: 'Fort Huachuca, Arizona',
    rating: 4.5,
    serviceCommitment: '4-6 years',
    image: 'https://www.operationmilitarykids.org/wp-content/uploads/2019/10/Army-Unmanned-Aerial-Vehicle-Operator-MOS-15W.jpg',
    branch: 'Army' as MilitaryBranch
  },
  // Coast Guard
  {
    id: 'military-17',
    name: 'Coast Guard Pilot',
    description: 'Coast Guard pilots perform search and rescue, law enforcement, and environmental protection missions. Operate helicopters and fixed-wing aircraft in challenging maritime environments.',
    location: 'Elizabeth City, North Carolina',
    rating: 4.8,
    serviceCommitment: '8-10 years',
    image: 'https://foundationforwomenwarriors.org/wp-content/uploads/2020/06/Jeanine-Menze-1.jpg',
    branch: 'Coast Guard' as MilitaryBranch
  },
  // Police
  {
    id: 'military-18',
    name: 'NPAS (National Police Air Service)',
    description: 'UK National Police Air Service provides aerial support for law enforcement operations across England and Wales. Operates helicopters and fixed-wing aircraft for search, pursuit, and surveillance missions.',
    location: 'United Kingdom',
    rating: 4.6,
    serviceCommitment: 'Varies',
    image: 'https://www.airmedandrescue.com/sites/amr/files/styles/og_image/public/2022-05/gpolv.jpg?h=7c5055f4&itok=Lr4TtIcB',
    branch: 'Police' as MilitaryBranch
  },
  // Defense Contractor
  {
    id: 'military-19',
    name: 'Defense Contractor Pilot',
    description: 'Test pilots and demonstration pilots for major defense contractors like Lockheed Martin, Boeing, Northrop Grumman. Fly advanced military aircraft for testing, development, and customer demonstrations.',
    location: 'Various Locations',
    rating: 4.7,
    serviceCommitment: 'Varies',
    image: 'https://www.aerotechnews.com/wp-content/uploads/2018/06/F22-pilot1.jpg',
    branch: 'Defense Contractor' as MilitaryBranch
  },
  // Marine Corps
  {
    id: 'military-10',
    name: 'Marine Corps OCS',
    description: 'Officer Candidates School for college graduates. Intensive 10-week program with aviation selection for top performers.',
    location: 'Quantico, Virginia',
    rating: 4.7,
    serviceCommitment: '8-10 years',
    image: 'https://www.liveabout.com/thmb/04fsj5C8TWZJ4XzDKJceIbV2ZWE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/IMG_8107-5aa1c53a8e1b6e00360489ee.JPG',
    branch: 'Marine Corps' as MilitaryBranch
  },
  {
    id: 'military-11',
    name: 'PLC (Marine Corps)',
    description: 'Platoon Leaders Class for college students. Summer training programs with aviation career tracks. Commission upon graduation.',
    location: 'Quantico, Virginia',
    rating: 4.6,
    serviceCommitment: '8-10 years',
    image: 'https://www.operationmilitarykids.org/wp-content/uploads/2020/01/Marine-Corps-Pilot-Requirements.png',
    branch: 'Marine Corps' as MilitaryBranch
  },
  {
    id: 'military-12',
    name: 'NROTC Marine Option',
    description: 'Marine Corps option through Naval ROTC. Flight training opportunities for selected Marine officers. Combined naval and Marine training.',
    location: 'Nationwide',
    rating: 4.7,
    serviceCommitment: '8-10 years',
    image: 'https://media.defense.gov/2016/Nov/02/2001663065/-1/-1/0/161102-M-AF661-004.JPG',
    branch: 'Marine Corps' as MilitaryBranch
  }
];

// Helper function to get count of military pathways
export const getMilitaryPathwayCount = (): number => {
  return DUMMY_MILITARY_PATHWAYS.filter(pathway => pathway.id !== 'military-intro').length;
};
