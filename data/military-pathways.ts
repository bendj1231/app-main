export type MilitaryBranch = 'All' | 'Air Force' | 'Navy' | 'Army' | 'Marine Corps';

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
    image: 'https://www.usafa.af.mil/Portals/14/Photos/2022/06/220616-F-YM425-1002.JPG?ver=2022-06-17-125327-667',
    branch: 'Air Force' as MilitaryBranch
  },
  {
    id: 'military-2',
    name: 'Air Force ROTC',
    description: 'College-based commissioning program with flight training opportunities. Scholarships available for qualified students. Flight training through specialized programs after commissioning.',
    location: 'Nationwide',
    rating: 4.7,
    serviceCommitment: '8-10 years',
    image: 'https://www.afrotc.com/sites/default/files/2021-09/AFROTC_Logo_0.png',
    branch: 'Air Force' as MilitaryBranch
  },
  {
    id: 'military-3',
    name: 'Air Force OTS',
    description: 'Officer Training School for college graduates seeking commission. Accelerated 12-week program with subsequent flight training for selected officers.',
    location: 'Maxwell AFB, Alabama',
    rating: 4.6,
    serviceCommitment: '8-10 years',
    image: 'https://media.defense.gov/2019/Mar/08/2002106653/-1/-1/0/190308-F-QY965-002.JPG',
    branch: 'Air Force' as MilitaryBranch
  },
  // Navy
  {
    id: 'military-4',
    name: 'Naval Academy',
    description: 'Elite naval officer training with aviation career paths. Offers bachelor\'s degree and flight training for selected midshipmen. Highly competitive with comprehensive education.',
    location: 'Annapolis, Maryland',
    rating: 4.9,
    serviceCommitment: '8-10 years',
    image: 'https://www.usna.edu/Images/homepage/hero-images/hero-home.jpg',
    branch: 'Navy' as MilitaryBranch
  },
  {
    id: 'military-5',
    name: 'NROTC',
    description: 'Naval Reserve Officers Training Corps for college students. Scholarships and flight training opportunities available. Commission as Navy or Marine Corps officer.',
    location: 'Nationwide',
    rating: 4.7,
    serviceCommitment: '8-10 years',
    image: 'https://www.nrotc.navy.mil/Portals/82/NROTC_Logo.png?ver=2020-01-15-110234-980',
    branch: 'Navy' as MilitaryBranch
  },
  {
    id: 'military-6',
    name: 'OCS (Navy)',
    description: 'Officer Candidate School for college graduates. Intensive 12-week training program with aviation selection opportunities for qualified candidates.',
    location: 'Newport, Rhode Island',
    rating: 4.6,
    serviceCommitment: '8-10 years',
    image: 'https://www.navy.mil/Portals/54/Content/News/2021/March/210325-N-NO997-1001.JPG?ver=2021-03-25-103732-390',
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
    image: 'https://www.westpoint.edu/sites/default/files/2022-06/west-point-campus-aerial.jpg',
    branch: 'Army' as MilitaryBranch
  },
  {
    id: 'military-8',
    name: 'Army ROTC',
    description: 'Reserve Officers\' Training Corps for college students. Aviation branch selection for qualified cadets. Scholarships available nationwide.',
    location: 'Nationwide',
    rating: 4.7,
    serviceCommitment: '8 years',
    image: 'https://www.armyrotc.com/wp-content/uploads/2021/09/Army-ROTC-Logo.png',
    branch: 'Army' as MilitaryBranch
  },
  {
    id: 'military-9',
    name: 'OCS (Army)',
    description: 'Officer Candidate School for college graduates. 12-week training program with aviation branch selection opportunities.',
    location: 'Fort Benning, Georgia',
    rating: 4.6,
    serviceCommitment: '8 years',
    image: 'https://www.army.mil/e2/c/downloads/2021/08/210823-A-ZZ614-001.JPG',
    branch: 'Army' as MilitaryBranch
  },
  // Marine Corps
  {
    id: 'military-10',
    name: 'Marine Corps OCS',
    description: 'Officer Candidates School for college graduates. Intensive 10-week program with aviation selection for top performers.',
    location: 'Quantico, Virginia',
    rating: 4.7,
    serviceCommitment: '8-10 years',
    image: 'https://www.marines.mil/Portals/1/Marines%20OCS%20Logo.jpg?ver=2020-06-01-120234-567',
    branch: 'Marine Corps' as MilitaryBranch
  },
  {
    id: 'military-11',
    name: 'PLC (Marine Corps)',
    description: 'Platoon Leaders Class for college students. Summer training programs with aviation career tracks. Commission upon graduation.',
    location: 'Quantico, Virginia',
    rating: 4.6,
    serviceCommitment: '8-10 years',
    image: 'https://www.marines.mil/Portals/1/PLC%20Logo.jpg?ver=2020-06-01-120234-890',
    branch: 'Marine Corps' as MilitaryBranch
  },
  {
    id: 'military-12',
    name: 'NROTC Marine Option',
    description: 'Marine Corps option through Naval ROTC. Flight training opportunities for selected Marine officers. Combined naval and Marine training.',
    location: 'Nationwide',
    rating: 4.7,
    serviceCommitment: '8-10 years',
    image: 'https://www.marines.mil/Portals/1/Marine%20NROTC%20Logo.jpg?ver=2020-06-01-120234-123',
    branch: 'Marine Corps' as MilitaryBranch
  }
];

// Helper function to get count of military pathways
export const getMilitaryPathwayCount = (): number => {
  return DUMMY_MILITARY_PATHWAYS.filter(pathway => pathway.id !== 'military-intro').length;
};
