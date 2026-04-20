export interface AirlineDetail {
  id: string; name: string; established: string; headquarters: string;
  branches: string[]; hubAirports: string[];
  destinations: { region: string; count: number; highlights: string[] }[];
  fleetDetails: { type: string; aircraft: string; count: number }[];
  description: string;
  jobs: { title: string; location: string; type: string; requirements: string }[];
}

const d = (r:string,c:number,h:string[]) => ({region:r,count:c,highlights:h});
const f = (t:string,a:string,c:number) => ({type:t,aircraft:a,count:c});
const j = (t:string,l:string,tp:string,r:string) => ({title:t,location:l,type:tp,requirements:r});

export const airlineDetailsMap: Record<string, AirlineDetail> = {
  qatar: {
    id:'qatar',name:'Qatar Airways',established:'1993',
    headquarters:'Qatar Airways Tower, Doha, Qatar',
    branches:['London, UK','Dubai, UAE','Singapore','Sydney, Australia','New York, USA','Mumbai, India'],
    hubAirports:['Hamad International Airport (DOH)'],
    destinations:[d('Middle East',15,['Doha','Dubai','Riyadh','Jeddah']),d('Europe',35,['London','Paris','Frankfurt','Milan']),d('Asia Pacific',40,['Singapore','Tokyo','Sydney','Bangkok']),d('Americas',12,['New York','Los Angeles','São Paulo']),d('Africa',10,['Cairo','Nairobi','Cape Town'])],
    fleetDetails:[f('Wide-Body','Airbus A350-900/1000',55),f('Wide-Body','Boeing 777-300ER',47),f('Wide-Body','Airbus A380-800',10),f('Wide-Body','Boeing 787-8/9',30)],
    description:'Qatar Airways is the state-owned flag carrier of Qatar, renowned for exceptional service and a global network spanning 160+ destinations.',
    jobs:[j('A350 First Officer','Doha, Qatar','Full-Time','3,000+ hrs TT, A320/A330 type rating preferred'),j('B777 Captain','Doha, Qatar','Full-Time','6,000+ hrs TT, B777 type rating, 1,000+ hrs PIC'),j('B787 First Officer','Doha, Qatar','Full-Time','2,500+ hrs TT, ME/IR, MCC completed')]
  },
  singapore: {
    id:'singapore',name:'Singapore Airlines',established:'1947',
    headquarters:'Airline House, Singapore Changi Airport',
    branches:['London, UK','Sydney, Australia','Tokyo, Japan','New York, USA','Mumbai, India'],
    hubAirports:['Singapore Changi Airport (SIN)'],
    destinations:[d('Southeast Asia',25,['Bangkok','Kuala Lumpur','Jakarta','Manila']),d('East Asia',15,['Tokyo','Seoul','Hong Kong','Taipei']),d('Europe',12,['London','Paris','Frankfurt','Amsterdam']),d('Oceania',8,['Sydney','Melbourne','Auckland']),d('Americas',5,['New York','Los Angeles','San Francisco'])],
    fleetDetails:[f('Wide-Body','Airbus A350-900/ULR',55),f('Wide-Body','Airbus A380-800',12),f('Wide-Body','Boeing 777-300ER',27),f('Wide-Body','Boeing 787-10',20)],
    description:'Singapore Airlines maintains one of the highest service standards globally.',
    jobs:[j('A350 First Officer','Singapore','Full-Time','3,000+ hrs TT, ATPL'),j('B777 Captain','Singapore','Full-Time','6,000+ hrs TT, B777 type rating')]
  },
  cathay: {
    id:'cathay',name:'Cathay Pacific',established:'1946',
    headquarters:'Cathay Pacific City, Hong Kong International Airport',
    branches:['London, UK','Sydney, Australia','Tokyo, Japan','Vancouver, Canada','San Francisco, USA'],
    hubAirports:['Hong Kong International Airport (HKG)'],
    destinations:[d('East Asia',20,['Tokyo','Seoul','Taipei','Shanghai']),d('Southeast Asia',15,['Bangkok','Singapore','Kuala Lumpur','Manila']),d('Europe',10,['London','Paris','Frankfurt','Amsterdam']),d('Americas',8,['New York','Los Angeles','Vancouver']),d('Oceania',6,['Sydney','Melbourne','Auckland'])],
    fleetDetails:[f('Wide-Body','Airbus A350-900/1000',42),f('Wide-Body','Airbus A330-300',25),f('Wide-Body','Boeing 777-300ER',32)],
    description:'Cathay Pacific offers a dynamic work environment with extensive Asian network coverage.',
    jobs:[j('A350 Second Officer','Hong Kong','Full-Time','1,500+ hrs TT, ATPL'),j('B777 Captain','Hong Kong','Full-Time','5,000+ hrs TT, B777 type rating')]
  },
  emirates: {
    id:'emirates',name:'Emirates',established:'1985',
    headquarters:'Emirates Group HQ, Dubai, UAE',
    branches:['London, UK','New York, USA','Sydney, Australia','Mumbai, India','Singapore','Tokyo, Japan'],
    hubAirports:['Dubai International Airport (DXB)'],
    destinations:[d('Middle East',12,['Dubai','Riyadh','Jeddah','Doha']),d('Europe',40,['London','Paris','Frankfurt','Rome']),d('Asia Pacific',35,['Singapore','Tokyo','Sydney','Bangkok']),d('Africa',20,['Cairo','Nairobi','Cape Town','Lagos']),d('Americas',10,['New York','Los Angeles','São Paulo'])],
    fleetDetails:[f('Wide-Body','Airbus A380-800',115),f('Wide-Body','Boeing 777-300ER',135),f('Wide-Body','Boeing 777-200LR',10)],
    description:'Emirates operates one of the largest A380 and B777 fleets globally.',
    jobs:[j('A380 First Officer','Dubai, UAE','Full-Time','4,000+ hrs TT, A330/A340 or B777 type rating'),j('B777 Captain','Dubai, UAE','Full-Time','8,000+ hrs TT, B777 type rating'),j('B777 First Officer','Dubai, UAE','Full-Time','2,500+ hrs TT, ME/IR, MCC')]
  },
  etihad: {
    id:'etihad',name:'Etihad Airways',established:'2003',
    headquarters:'Etihad Airways Centre, Abu Dhabi, UAE',
    branches:['London, UK','Sydney, Australia','Mumbai, India','New York, USA','Singapore'],
    hubAirports:['Abu Dhabi International Airport (AUH)'],
    destinations:[d('Middle East',10,['Abu Dhabi','Riyadh','Jeddah','Doha']),d('Europe',18,['London','Paris','Frankfurt','Rome']),d('Asia Pacific',22,['Singapore','Tokyo','Sydney','Bangkok']),d('Americas',5,['New York','Chicago','Toronto']),d('Africa',6,['Cairo','Nairobi','Lagos'])],
    fleetDetails:[f('Wide-Body','Boeing 787-9/10',35),f('Wide-Body','Boeing 777-300ER',20),f('Wide-Body','Airbus A350-1000',10)],
    description:'Etihad Airways provides competitive tax-free packages from its Abu Dhabi base.',
    jobs:[j('B787 First Officer','Abu Dhabi, UAE','Full-Time','2,500+ hrs TT, ME/IR, MCC'),j('B777 Captain','Abu Dhabi, UAE','Full-Time','6,000+ hrs TT, B777 type rating')]
  }
};
