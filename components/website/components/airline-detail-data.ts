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
  },
  lufthansa: {
    id:'lufthansa',name:'Lufthansa',established:'1953',
    headquarters:'Lufthansa Aviation Center, Frankfurt Airport, Germany',
    branches:['Munich, Germany','Berlin, Germany','New York, USA','London, UK','Tokyo, Japan'],
    hubAirports:['Frankfurt Airport (FRA)','Munich Airport (MUC)'],
    destinations:[d('Europe',80,['London','Paris','Rome','Madrid','Vienna']),d('North America',20,['New York','Los Angeles','Chicago','Toronto']),d('Asia',18,['Tokyo','Singapore','Shanghai','Seoul']),d('Middle East',8,['Dubai','Riyadh','Tel Aviv']),d('Africa',10,['Cairo','Nairobi','Johannesburg'])],
    fleetDetails:[f('Wide-Body','Airbus A350-900',25),f('Wide-Body','Boeing 747-8',19),f('Wide-Body','Boeing 777-300ER',10),f('Narrow-Body','Airbus A320 Family',90)],
    description:'Lufthansa is Europes largest airline and a founding member of Star Alliance.',
    jobs:[j('A350 First Officer','Frankfurt/Munich, Germany','Full-Time','1,500+ hrs TT, ATPL, German language'),j('A320 Captain','Frankfurt/Munich, Germany','Full-Time','4,000+ hrs TT, A320 type rating')]
  },
  british: {
    id:'british',name:'British Airways',established:'1974',
    headquarters:'Waterside, Harmondsworth, UK',
    branches:['New York, USA','Singapore','Sydney, Australia','Hong Kong','Mumbai, India'],
    hubAirports:['London Heathrow (LHR)','London Gatwick (LGW)'],
    destinations:[d('Europe',60,['Paris','Frankfurt','Rome','Madrid','Amsterdam']),d('North America',22,['New York','Los Angeles','Chicago','Toronto']),d('Asia',12,['Tokyo','Singapore','Hong Kong','Seoul']),d('Middle East',8,['Dubai','Doha','Tel Aviv']),d('Africa',12,['Cairo','Nairobi','Johannesburg','Lagos'])],
    fleetDetails:[f('Wide-Body','Boeing 777-300ER/200ER',46),f('Wide-Body','Boeing 787-8/9/10',30),f('Wide-Body','Airbus A350-1000',10),f('Wide-Body','Airbus A380-800',12),f('Narrow-Body','Airbus A320 Family',70)],
    description:'British Airways operates from London Heathrow with a vast global network.',
    jobs:[j('A320 First Officer','London Heathrow, UK','Full-Time','1,500+ hrs TT, ATPL'),j('B777 Captain','London Heathrow, UK','Full-Time','5,000+ hrs TT, B777 type rating')]
  },
  airfrance: {
    id:'airfrance',name:'Air France',established:'1933',
    headquarters:'Air France HQ, Roissy CDG, France',
    branches:['New York, USA','London, UK','Tokyo, Japan','Mumbai, India','Montreal, Canada'],
    hubAirports:['Paris CDG (CDG)','Paris Orly (ORY)'],
    destinations:[d('Europe',70,['London','Frankfurt','Rome','Madrid','Amsterdam']),d('Africa',35,['Cairo','Dakar','Lagos','Nairobi','Casablanca']),d('Americas',15,['New York','Los Angeles','São Paulo','Montreal']),d('Asia',10,['Tokyo','Singapore','Shanghai','Seoul']),d('Middle East',6,['Dubai','Riyadh','Tel Aviv'])],
    fleetDetails:[f('Wide-Body','Boeing 777-300ER/200ER',40),f('Wide-Body','Boeing 787-9',10),f('Wide-Body','Airbus A350-900',10),f('Narrow-Body','Airbus A320 Family',55)],
    description:'Air France is the French flag carrier with a rich history dating back to 1933.',
    jobs:[j('A320 First Officer','Paris CDG, France','Full-Time','1,500+ hrs TT, ATPL, French language'),j('B777 Captain','Paris CDG, France','Full-Time','5,000+ hrs TT, B777 type rating')]
  },
  klm: {
    id:'klm',name:'KLM',established:'1919',
    headquarters:'Amstel Business Park, Schiphol, Netherlands',
    branches:['New York, USA','London, UK','Tokyo, Japan','Singapore','Nairobi, Kenya'],
    hubAirports:['Amsterdam Schiphol Airport (AMS)'],
    destinations:[d('Europe',65,['London','Paris','Frankfurt','Rome','Berlin']),d('North America',15,['New York','Los Angeles','Chicago','Toronto']),d('Asia',12,['Tokyo','Singapore','Hong Kong','Seoul']),d('Africa',15,['Cairo','Nairobi','Lagos','Casablanca']),d('South America',8,['São Paulo','Buenos Aires','Bogota'])],
    fleetDetails:[f('Wide-Body','Boeing 777-300ER/200ER',25),f('Wide-Body','Boeing 787-9/10',20),f('Narrow-Body','Boeing 737-700/800/900',30)],
    description:'KLM is the oldest airline still operating under its original name.',
    jobs:[j('B737 First Officer','Amsterdam, Netherlands','Full-Time','1,200+ hrs TT, ATPL'),j('B777 Captain','Amsterdam, Netherlands','Full-Time','5,000+ hrs TT, B777 type rating')]
  },
  turkish: {
    id:'turkish',name:'Turkish Airlines',established:'1933',
    headquarters:'Turkish Airlines HQ, Istanbul Airport, Turkey',
    branches:['London, UK','New York, USA','Frankfurt, Germany','Dubai, UAE','Tokyo, Japan'],
    hubAirports:['Istanbul Airport (IST)'],
    destinations:[d('Europe',80,['London','Paris','Frankfurt','Rome','Amsterdam']),d('Asia',35,['Tokyo','Singapore','Bangkok','Seoul','Mumbai']),d('Africa',40,['Cairo','Nairobi','Lagos','Casablanca','Addis Ababa']),d('Americas',15,['New York','Los Angeles','São Paulo','Toronto']),d('Middle East',12,['Dubai','Riyadh','Doha','Tel Aviv'])],
    fleetDetails:[f('Wide-Body','Boeing 777-300ER',33),f('Wide-Body','Boeing 787-9',25),f('Wide-Body','Airbus A330-300',35),f('Narrow-Body','Airbus A320/A321',60),f('Narrow-Body','Boeing 737-800/900',50)],
    description:'Turkish Airlines flies to more countries than any other airline.',
    jobs:[j('A330 First Officer','Istanbul, Turkey','Full-Time','2,000+ hrs TT, ATPL'),j('B777 Captain','Istanbul, Turkey','Full-Time','5,000+ hrs TT, B777 type rating')]
  }
};
