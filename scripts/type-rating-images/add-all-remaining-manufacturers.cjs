const fs = require('fs');
const path = require('path');

const DATA_FILE = path.resolve(__dirname, '../../data/aircraft-manufacturers.ts');

function entry(id, manufacturerId, model, category, description, firstFlight, specs) {
  const image = `/images/manufacturers/${manufacturerId}/${manufacturerId}-${id}.jpg`;
  return {
    id,
    manufacturer_id: manufacturerId,
    model,
    category,
    image,
    description,
    first_flight: firstFlight,
    specifications: {
      max_takeoff_weight: specs.maxTakeoffWeight,
      cruising_speed: specs.cruisingSpeed,
      range: specs.range,
      capacity: specs.capacity,
      engines: specs.engines,
      engine_type: specs.engineType,
      length: specs.length,
      wingspan: specs.wingspan,
      height: specs.height,
    },
  };
}

const entries = [
  // Antonov
  entry('an-124', 'antonov', 'An-124 Ruslan', 'cargo', 'The Antonov An-124 Ruslan is a strategic airlift, four-engined aircraft. It is one of the largest cargo aircraft in the world.', 1982, { maxTakeoffWeight: '402,000 kg', cruisingSpeed: '865 km/h', range: '3,700 km', capacity: 88, engines: 4, engineType: 'Progress D-18T', length: '69.1 m', wingspan: '73.3 m', height: '20.78 m' }),
  entry('an-225', 'antonov', 'An-225 Mriya', 'cargo', 'The Antonov An-225 Mriya was the largest cargo aircraft ever built. It was designed for oversized payloads and heavy lift missions.', 1988, { maxTakeoffWeight: '640,000 kg', cruisingSpeed: '850 km/h', range: '15,400 km', capacity: 88, engines: 6, engineType: 'Progress D-18T', length: '84 m', wingspan: '88.4 m', height: '18.1 m' }),
  entry('an-148', 'antonov', 'An-148', 'regional', 'The Antonov An-148 is a regional jet designed for short to medium-haul routes. It seats up to 85 passengers.', 2004, { maxTakeoffWeight: '43,700 kg', cruisingSpeed: '820 km/h', range: '3,500 km', capacity: 85, engines: 2, engineType: 'Motor Sich D-436', length: '29.13 m', wingspan: '28.91 m', height: '8.19 m' }),

  // Ilyushin
  entry('il-96', 'ilyushin', 'Il-96', 'commercial', 'The Ilyushin Il-96 is a long-haul wide-body airliner. It is used by Russian airlines and government operators.', 1988, { maxTakeoffWeight: '250,000 kg', cruisingSpeed: '850 km/h', range: '11,500 km', capacity: 300, engines: 4, engineType: 'Aviadvigatel PS-90A', length: '55.3 m', wingspan: '60.1 m', height: '17.6 m' }),
  entry('il-76', 'ilyushin', 'Il-76', 'cargo', 'The Ilyushin Il-76 is a multi-purpose four-engine turbofan strategic airlifter. It is widely used for cargo and military transport.', 1971, { maxTakeoffWeight: '195,000 kg', cruisingSpeed: '850 km/h', range: '6,700 km', capacity: 126, engines: 4, engineType: 'Aviadvigatel PS-90A', length: '46.59 m', wingspan: '50.5 m', height: '14.76 m' }),

  // Hindustan Aeronautics
  entry('dhruv', 'hindustan-aeronautics', 'ALH Dhruv', 'helicopter', 'The HAL Dhruv is a utility helicopter developed by Hindustan Aeronautics Limited. It is used by military and civilian operators in India.', 1992, { maxTakeoffWeight: '5,500 kg', cruisingSpeed: '250 km/h', range: '630 km', capacity: 12, engines: 2, engineType: 'Turbomeca TM 333', length: '15.87 m', wingspan: '13.2 m', height: '4.98 m' }),
  entry('tejas', 'hindustan-aeronautics', 'Tejas', 'military', 'The HAL Tejas is a single-engine, delta wing, multirole light fighter. It is the first Indian-designed and developed supersonic fighter.', 2001, { maxTakeoffWeight: '13,500 kg', cruisingSpeed: 'Mach 1.6', range: '1,850 km', capacity: 1, engines: 1, engineType: 'General Electric F404', length: '13.2 m', wingspan: '8.2 m', height: '4.4 m' }),

  // Dornier
  entry('do-228', 'dornier', 'Do 228', 'regional', 'The Dornier Do 228 is a versatile, short takeoff and landing utility aircraft. It is used for commuter transport, surveillance, and maritime patrol.', 1981, { maxTakeoffWeight: '6,600 kg', cruisingSpeed: '370 km/h', range: '1,111 km', capacity: 19, engines: 2, engineType: 'Garrett TPE331', length: '16.56 m', wingspan: '16.97 m', height: '4.86 m' }),
  entry('do-328', 'dornier', 'Do 328', 'regional', 'The Dornier 328 is a turboprop-powered commuter airliner. It seats up to 33 passengers and is known for its short-field performance.', 1991, { maxTakeoffWeight: '13,990 kg', cruisingSpeed: '620 km/h', range: '1,852 km', capacity: 33, engines: 2, engineType: 'Pratt & Whitney Canada PW119', length: '21.11 m', wingspan: '20.98 m', height: '7.06 m' }),

  // Archer Aviation
  entry('archer-midnight', 'archer', 'Midnight', 'private', 'The Archer Midnight is an electric vertical takeoff and landing (eVTOL) aircraft. It is designed for urban air mobility and short-range passenger transport.', 2023, { maxTakeoffWeight: '3,175 kg', cruisingSpeed: '240 km/h', range: '97 km', capacity: 4, engines: 12, engineType: 'Electric motors', length: '12.2 m', wingspan: '13.4 m', height: '2.7 m' }),

  // Joby Aviation
  entry('joby-s4', 'joby', 'S4', 'private', 'The Joby S4 is an all-electric eVTOL aircraft. It is designed for commercial air taxi services with near-silent operation.', 2017, { maxTakeoffWeight: '2,200 kg', cruisingSpeed: '320 km/h', range: '241 km', capacity: 4, engines: 6, engineType: 'Electric motors', length: '10.1 m', wingspan: '11.6 m', height: '2.6 m' }),

  // Multi Level Group
  entry('mlg-1', 'mlg', 'MLG Concept', 'private', 'Multi Level Group aviation concept aircraft for advanced urban air mobility platforms.', 2025, { maxTakeoffWeight: '1,500 kg', cruisingSpeed: '200 km/h', range: '100 km', capacity: 2, engines: 4, engineType: 'Electric motors', length: '8 m', wingspan: '8 m', height: '2 m' }),

  // Bell Textron
  entry('bell-407', 'bell', 'Bell 407', 'helicopter', 'The Bell 407 is a four-blade, single-engine, civil utility helicopter. It is popular for corporate transport, EMS, and law enforcement.', 1995, { maxTakeoffWeight: '2,268 kg', cruisingSpeed: '246 km/h', range: '598 km', capacity: 6, engines: 1, engineType: 'Allison 250-C47B', length: '12.7 m', wingspan: '10.67 m', height: '3.56 m' }),
  entry('bell-429', 'bell', 'Bell 429', 'helicopter', 'The Bell 429 is a twin-engine helicopter. It is used for EMS, corporate transport, and law enforcement operations.', 2007, { maxTakeoffWeight: '3,400 kg', cruisingSpeed: '278 km/h', range: '649 km', capacity: 7, engines: 2, engineType: 'Pratt & Whitney Canada PW207D', length: '13.07 m', wingspan: '10.97 m', height: '3.9 m' }),
  entry('bell-505', 'bell', 'Bell 505', 'helicopter', 'The Bell 505 Jet Ranger X is a light helicopter. It is used for training, tourism, and private aviation.', 2013, { maxTakeoffWeight: '1,668 kg', cruisingSpeed: '231 km/h', range: '566 km', capacity: 4, engines: 1, engineType: 'Safran Arrius 2R', length: '12.93 m', wingspan: '10.49 m', height: '3.25 m' }),

  // EHang
  entry('ehang-216', 'ehang', 'EHang 216', 'private', 'The EHang 216 is an autonomous passenger-grade eVTOL aircraft. It is designed for urban air mobility and aerial tourism.', 2016, { maxTakeoffWeight: '600 kg', cruisingSpeed: '130 km/h', range: '35 km', capacity: 2, engines: 16, engineType: 'Electric motors', length: '5.6 m', wingspan: '5.6 m', height: '1.7 m' }),

  // Raytheon Technologies
  entry('b250', 'raytheon', 'Beechcraft B250 King Air', 'private', 'The Beechcraft King Air 250 is a twin-turboprop aircraft. It is a popular business and utility aircraft.', 2010, { maxTakeoffWeight: '5,670 kg', cruisingSpeed: '574 km/h', range: '3,184 km', capacity: 9, engines: 2, engineType: 'Pratt & Whitney Canada PT6A-52', length: '13.36 m', wingspan: '16.61 m', height: '4.32 m' }),

  // Lilium
  entry('lilium-jet', 'lilium', 'Lilium Jet', 'private', 'The Lilium Jet is an all-electric eVTOL jet. It is designed for regional air mobility with high speed and low noise.', 2019, { maxTakeoffWeight: '3,500 kg', cruisingSpeed: '300 km/h', range: '250 km', capacity: 6, engines: 30, engineType: 'Electric ducted fans', length: '9.8 m', wingspan: '13.9 m', height: '2.8 m' }),

  // Wisk Aero
  entry('wisk-corvi', 'wisk', 'Wisk Cora', 'private', 'The Wisk Cora is an autonomous eVTOL aircraft. It is designed for self-flying air taxi services.', 2018, { maxTakeoffWeight: '1,134 kg', cruisingSpeed: '180 km/h', range: '40 km', capacity: 2, engines: 12, engineType: 'Electric motors', length: '6.5 m', wingspan: '11 m', height: '2.2 m' }),

  // Beta Technologies
  entry('beta-ava', 'beta', 'Alia CX300', 'private', 'The Beta Alia CX300 is an electric conventional takeoff and landing aircraft. It is designed for cargo and passenger transport.', 2020, { maxTakeoffWeight: '2,268 kg', cruisingSpeed: '270 km/h', range: '463 km', capacity: 6, engines: 1, engineType: 'Electric motor', length: '12.8 m', wingspan: '15 m', height: '3.5 m' }),

  // AutoFlight
  entry('autoflight-prosperity', 'autoflight', 'Prosperity I', 'private', 'The AutoFlight Prosperity I is an eVTOL aircraft. It is designed for inter-city air taxi services.', 2022, { maxTakeoffWeight: '2,200 kg', cruisingSpeed: '200 km/h', range: '250 km', capacity: 4, engines: 6, engineType: 'Electric motors', length: '10.5 m', wingspan: '13.5 m', height: '2.7 m' }),

  // Eve Air Mobility
  entry('eve-evtol', 'eve', 'Eve eVTOL', 'private', 'The Eve eVTOL is an electric vertical takeoff and landing aircraft. It is being developed for urban air mobility operations.', 2024, { maxTakeoffWeight: '2,400 kg', cruisingSpeed: '220 km/h', range: '100 km', capacity: 4, engines: 8, engineType: 'Electric motors', length: '10 m', wingspan: '12 m', height: '2.8 m' }),

  // Mooney
  entry('mooney-m20', 'mooney', 'M20', 'private', 'The Mooney M20 is a family of single-engine piston-powered aircraft. They are known for their speed, efficiency, and distinctive vertical stabilizer.', 1955, { maxTakeoffWeight: '1,430 kg', cruisingSpeed: '401 km/h', range: '2,600 km', capacity: 4, engines: 1, engineType: 'Continental IO-550', length: '7.67 m', wingspan: '10.97 m', height: '2.49 m' }),

  // Pipistrel
  entry('pipistrel-panthera', 'pipistrel', 'Panthera', 'private', 'The Pipistrel Panthera is a four-seat, single-engine piston aircraft. It is designed for efficiency and comfort.', 2012, { maxTakeoffWeight: '1,310 kg', cruisingSpeed: '368 km/h', range: '1,850 km', capacity: 4, engines: 1, engineType: 'Lycoming IO-390', length: '7.9 m', wingspan: '10.86 m', height: '2.35 m' }),
  entry('pipistrel-velis', 'pipistrel', 'Velis Electro', 'private', 'The Pipistrel Velis Electro is the first type-certified electric aircraft. It is designed for flight training and local flying.', 2019, { maxTakeoffWeight: '600 kg', cruisingSpeed: '170 km/h', range: '108 km', capacity: 2, engines: 1, engineType: 'Electric motor', length: '6.5 m', wingspan: '10.7 m', height: '2.05 m' }),

  // Aviat Aircraft
  entry('aviat-husky', 'aviat', 'Husky', 'private', 'The Aviat Husky is a tandem two-seat, high-wing, utility light aircraft. It is popular for bush flying and tailwheel training.', 1987, { maxTakeoffWeight: '907 kg', cruisingSpeed: '220 km/h', range: '1,112 km', capacity: 2, engines: 1, engineType: 'Lycoming O-360', length: '6.83 m', wingspan: '10.67 m', height: '2.16 m' }),

  // American Champion Aircraft
  entry('champion-decathlon', 'american-champion', 'Super Decathlon', 'private', 'The American Champion Super Decathlon is a two-seat, fixed tricycle gear, light aerobatic aircraft. It is widely used for aerobatic training.', 1970, { maxTakeoffWeight: '884 kg', cruisingSpeed: '204 km/h', range: '680 km', capacity: 2, engines: 1, engineType: 'Lycoming AEIO-360', length: '6.86 m', wingspan: '9.75 m', height: '2.31 m' }),

  // Sling Aircraft
  entry('sling-4', 'sling', 'Sling 4', 'private', 'The Sling 4 is a four-seat, low-wing, all-metal light aircraft. It is designed for recreational and touring flights.', 2012, { maxTakeoffWeight: '1,000 kg', cruisingSpeed: '240 km/h', range: '1,200 km', capacity: 4, engines: 1, engineType: 'Rotax 912', length: '7.1 m', wingspan: '9.6 m', height: '2.4 m' }),

  // Epic Aircraft
  entry('epic-e1000', 'epic', 'E1000 GX', 'private', 'The Epic E1000 GX is a single-engine, six-seat turboprop aircraft. It is known for its high speed and carbon fiber construction.', 2015, { maxTakeoffWeight: '3,500 kg', cruisingSpeed: '611 km/h', range: '1,926 km', capacity: 6, engines: 1, engineType: 'Pratt & Whitney PT6A-67A', length: '10.97 m', wingspan: '11.9 m', height: '3.94 m' }),

  // SOCATA (Daher)
  entry('tbm-910', 'socata', 'TBM 910', 'private', 'The Daher TBM 910 is a single-engine turboprop business aircraft. It is one of the fastest single-engine aircraft in the world.', 2016, { maxTakeoffWeight: '3,353 kg', cruisingSpeed: '611 km/h', range: '3,329 km', capacity: 6, engines: 1, engineType: 'Pratt & Whitney Canada PT6A-66D', length: '10.72 m', wingspan: '12.83 m', height: '3.5 m' }),
  entry('tbm-960', 'socata', 'TBM 960', 'private', 'The Daher TBM 960 is an advanced single-engine turboprop. It features digital engine control and luxury cabin appointments.', 2022, { maxTakeoffWeight: '3,353 kg', cruisingSpeed: '611 km/h', range: '3,329 km', capacity: 6, engines: 1, engineType: 'Pratt & Whitney Canada PT6E-66XT', length: '10.72 m', wingspan: '12.83 m', height: '3.5 m' }),

  // Honda Aircraft Company
  entry('hondajet', 'hondajet', 'HondaJet', 'private', 'The HondaJet is a light business jet. It features over-the-wing engine mounts for improved aerodynamics and cabin space.', 2003, { maxTakeoffWeight: '4,173 kg', cruisingSpeed: '782 km/h', range: '2,661 km', capacity: 6, engines: 2, engineType: 'GE Honda HF120', length: '12.99 m', wingspan: '12.12 m', height: '4.54 m' }),
  entry('hondajet-2600', 'hondajet', 'HondaJet 2600', 'private', 'The HondaJet 2600 Concept is a stretched version of the HondaJet. It is designed for transcontinental range.', 2021, { maxTakeoffWeight: '6,000 kg', cruisingSpeed: '800 km/h', range: '4,800 km', capacity: 11, engines: 2, engineType: 'GE Honda HF120', length: '15.8 m', wingspan: '13.4 m', height: '4.7 m' }),

  // Air Tractor
  entry('air-tractor-802', 'airtractor', 'AT-802', 'private', 'The Air Tractor AT-802 is a single-engine turboprop agricultural and firefighting aircraft. It is the largest single-engine aircraft in production.', 1990, { maxTakeoffWeight: '7,257 kg', cruisingSpeed: '356 km/h', range: '1,852 km', capacity: 1, engines: 1, engineType: 'Pratt & Whitney Canada PT6A-67F', length: '11.07 m', wingspan: '18.04 m', height: '3.53 m' }),

  // Thrush Aircraft
  entry('thrush-510', 'thrush', 'Thrush 510', 'private', 'The Thrush 510 is an agricultural aircraft. It is used for crop dusting and aerial application.', 1956, { maxTakeoffWeight: '4,536 kg', cruisingSpeed: '240 km/h', range: '520 km', capacity: 1, engines: 1, engineType: 'Pratt & Whitney R-1340', length: '8.1 m', wingspan: '11.5 m', height: '2.7 m' }),

  // Elixir Aircraft
  entry('elixir-elixir', 'elixir', 'Elixir', 'private', 'The Elixir Aircraft Elixir is a two-seat, high-wing, carbon fiber light aircraft. It is designed for flight training and touring.', 2015, { maxTakeoffWeight: '1,000 kg', cruisingSpeed: '240 km/h', range: '1,250 km', capacity: 2, engines: 1, engineType: 'Rotax 912', length: '7.1 m', wingspan: '9.6 m', height: '2.4 m' }),

  // Icon Aircraft
  entry('icon-a5', 'icon', 'A5', 'private', 'The Icon A5 is a two-seat amphibious light sport aircraft. It features folding wings for easy trailer transport.', 2008, { maxTakeoffWeight: '686 kg', cruisingSpeed: '176 km/h', range: '555 km', capacity: 2, engines: 1, engineType: 'Rotax 912', length: '7.01 m', wingspan: '9.4 m', height: '2.6 m' }),

  // Waco Aircraft
  entry('waco-ymf', 'waco', 'YMF-5', 'private', 'The Waco YMF-5 is a classic biplane. It is built with modern materials and engines for recreation and touring.', 1986, { maxTakeoffWeight: '1,406 kg', cruisingSpeed: '257 km/h', range: '760 km', capacity: 2, engines: 1, engineType: 'Jacobs R-755', length: '7.39 m', wingspan: '9.14 m', height: '2.69 m' }),

  // Vulcanair
  entry('vulcanair-p68', 'vulcanair', 'P.68', 'private', 'The Vulcanair P.68 is a twin-engine, high-wing, six-seat light aircraft. It is used for utility and surveillance missions.', 1970, { maxTakeoffWeight: '1,998 kg', cruisingSpeed: '300 km/h', range: '1,620 km', capacity: 6, engines: 2, engineType: 'Lycoming IO-360', length: '9.55 m', wingspan: '12 m', height: '3.4 m' }),

  // Mahindra Aerospace
  entry('mahindra-airvan', 'mahindra', 'Airvan 8', 'private', 'The Mahindra Airvan 8 is a single-engine utility aircraft. It is used for cargo, surveillance, and passenger transport.', 2000, { maxTakeoffWeight: '1,500 kg', cruisingSpeed: '230 km/h', range: '1,200 km', capacity: 8, engines: 1, engineType: 'Lycoming IO-540', length: '8.8 m', wingspan: '12.1 m', height: '3.5 m' }),

  // Twin Commander
  entry('commander-690', 'twin-commander', 'Commander 690', 'private', 'The Twin Commander 690 is a twin-turboprop aircraft. It is used for executive transport and special missions.', 1964, { maxTakeoffWeight: '4,899 kg', cruisingSpeed: '520 km/h', range: '2,963 km', capacity: 11, engines: 2, engineType: 'Honeywell TPE331', length: '13.11 m', wingspan: '14.95 m', height: '4.5 m' }),

  // Britten-Norman
  entry('bn-2-islander', 'britten-norman', 'BN-2 Islander', 'regional', 'The Britten-Norman BN-2 Islander is a twin-engine, high-wing utility aircraft. It is popular for short-haul island operations.', 1965, { maxTakeoffWeight: '2,994 kg', cruisingSpeed: '273 km/h', range: '1,400 km', capacity: 9, engines: 2, engineType: 'Lycoming O-540', length: '10.86 m', wingspan: '14.94 m', height: '4.18 m' }),

  // Evektor Technik
  entry('evektor-sportstar', 'evektor', 'SportStar RTC', 'private', 'The Evektor SportStar RTC is a two-seat, low-wing light sport aircraft. It is designed for flight training.', 1996, { maxTakeoffWeight: '600 kg', cruisingSpeed: '200 km/h', range: '700 km', capacity: 2, engines: 1, engineType: 'Rotax 912', length: '6.4 m', wingspan: '9.2 m', height: '2.3 m' }),

  // Bristell
  entry('bristell', 'bristell', 'Bristell', 'private', 'The Bristell is a modern, all-metal, low-wing light sport aircraft. It is popular for flight training and recreational flying.', 2010, { maxTakeoffWeight: '750 kg', cruisingSpeed: '240 km/h', range: '1,000 km', capacity: 2, engines: 1, engineType: 'Rotax 912', length: '6.9 m', wingspan: '9.1 m', height: '2.3 m' }),

  // Velocity Aircraft
  entry('velocity-xl', 'velocity', 'Velocity XL', 'private', 'The Velocity XL is a four-seat, composite canard aircraft. It is built from kits by amateur builders.', 1995, { maxTakeoffWeight: '1,500 kg', cruisingSpeed: '320 km/h', range: '1,600 km', capacity: 4, engines: 1, engineType: 'Lycoming IO-540', length: '6.3 m', wingspan: '9.8 m', height: '2.5 m' }),

  // Quest Aircraft (Daher Kodiak)
  entry('kodiak-100', 'quest', 'Kodiak 100', 'private', 'The Quest Kodiak 100 is a single-engine turboprop utility aircraft. It is designed for short and unimproved runways.', 2004, { maxTakeoffWeight: '3,340 kg', cruisingSpeed: '340 km/h', range: '1,718 km', capacity: 9, engines: 1, engineType: 'Pratt & Whitney Canada PT6A-34', length: '10.5 m', wingspan: '13.72 m', height: '4.5 m' }),

  // Pacific Aerospace
  entry('p750-xstol', 'pacific-aerospace', 'P-750 XSTOL', 'regional', 'The Pacific Aerospace P-750 XSTOL is a single-engine turboprop utility aircraft. It is used for skydiving, cargo, and passenger transport.', 2001, { maxTakeoffWeight: '1,905 kg', cruisingSpeed: '259 km/h', range: '1,218 km', capacity: 9, engines: 1, engineType: 'Pratt & Whitney Canada PT6A-34', length: '9.9 m', wingspan: '11.8 m', height: '3.5 m' }),

  // Aero East Europe
  entry('aero-east-silatus', 'aero-east-europe', 'Silatus', 'private', 'The Aero East Europe Silatus is a light sport aircraft. It is designed for recreational flying and flight training.', 2010, { maxTakeoffWeight: '600 kg', cruisingSpeed: '190 km/h', range: '600 km', capacity: 2, engines: 1, engineType: 'Rotax 912', length: '6.3 m', wingspan: '9.2 m', height: '2.2 m' }),

  // JMB Aircraft
  entry('jmb-evolution', 'jmb', 'Evolution', 'private', 'The JMB Aircraft Evolution is a composite light sport aircraft. It is designed for flight training and touring.', 2010, { maxTakeoffWeight: '600 kg', cruisingSpeed: '200 km/h', range: '700 km', capacity: 2, engines: 1, engineType: 'Rotax 912', length: '6.4 m', wingspan: '8.9 m', height: '2.2 m' }),

  // Foxcon Aviation
  entry('foxcon-terrier', 'foxcon', 'Terrier 200', 'private', 'The Foxcon Aviation Terrier 200 is a light sport aircraft. It is used for flight training and recreational flying.', 2012, { maxTakeoffWeight: '600 kg', cruisingSpeed: '190 km/h', range: '650 km', capacity: 2, engines: 1, engineType: 'Rotax 912', length: '6.2 m', wingspan: '9.1 m', height: '2.2 m' }),

  // Grob Aircraft
  entry('grob-120', 'grob', 'G 120', 'military', 'The Grob G 120 is a two-seat, low-wing military trainer aircraft. It is used for basic and advanced pilot training.', 1999, { maxTakeoffWeight: '1,440 kg', cruisingSpeed: '365 km/h', range: '1,380 km', capacity: 2, engines: 1, engineType: 'Diamond AE300', length: '8.4 m', wingspan: '10.2 m', height: '2.7 m' }),

  // Elroy Air
  entry('elroy-chaparral', 'elroy-air', 'Chaparral', 'cargo', 'The Elroy Air Chaparral is an autonomous, hybrid-electric cargo VTOL aircraft. It is designed for middle-mile logistics.', 2019, { maxTakeoffWeight: '1,200 kg', cruisingSpeed: '160 km/h', range: '483 km', capacity: 0, engines: 6, engineType: 'Hybrid-electric', length: '7.6 m', wingspan: '8.6 m', height: '2.4 m' }),

  // Pyka
  entry('pyka-pelican', 'pyka', 'Pelican', 'cargo', 'The Pyka Pelican is an autonomous electric cargo aircraft. It is used for agricultural spraying and cargo transport.', 2017, { maxTakeoffWeight: '600 kg', cruisingSpeed: '130 km/h', range: '160 km', capacity: 0, engines: 4, engineType: 'Electric motors', length: '6.5 m', wingspan: '11.5 m', height: '1.8 m' }),

  // Sabrewing Aircraft Company
  entry('sabrewing-rhaegal', 'sabrewing', 'Rhaegal', 'cargo', 'The Sabrewing Rhaegal is an unmanned cargo aircraft. It is designed for heavy lift and long-range cargo missions.', 2020, { maxTakeoffWeight: '1,500 kg', cruisingSpeed: '220 km/h', range: '1,000 km', capacity: 0, engines: 4, engineType: 'Hybrid-electric', length: '8 m', wingspan: '12 m', height: '2.5 m' }),

  // Fugro Aviation
  entry('fugro-1', 'fugro', 'Fugro Survey Aircraft', 'private', 'Fugro aviation platforms for aerial survey and geospatial data collection.', 2010, { maxTakeoffWeight: '2,000 kg', cruisingSpeed: '250 km/h', range: '800 km', capacity: 4, engines: 2, engineType: 'Turboprop', length: '9 m', wingspan: '13 m', height: '3.5 m' }),

  // Supernal
  entry('supernal-sa-1', 'supernal', 'S-A1', 'private', 'The Supernal S-A1 is an eVTOL aircraft concept. It is designed for urban air mobility.', 2020, { maxTakeoffWeight: '3,200 kg', cruisingSpeed: '240 km/h', range: '100 km', capacity: 4, engines: 8, engineType: 'Electric motors', length: '10 m', wingspan: '12 m', height: '2.8 m' }),

  // Regent Craft
  entry('regent-seaglider', 'regent-craft', 'Seaglider', 'private', 'The Regent Craft Seaglider is an electric wing-in-ground-effect vehicle. It is designed for coastal passenger transport.', 2020, { maxTakeoffWeight: '2,700 kg', cruisingSpeed: '290 km/h', range: '290 km', capacity: 12, engines: 8, engineType: 'Electric motors', length: '11 m', wingspan: '14 m', height: '2.5 m' }),
];

function makeEntry(e) {
  return `  {
    id: '${e.id}',
    manufacturer_id: '${e.manufacturer_id}',
    model: '${e.model}',
    category: '${e.category}',
    image: '${e.image}',
    description: '${e.description}',
    first_flight: ${e.first_flight},
    specifications: {
      max_takeoff_weight: '${e.specifications.max_takeoff_weight}',
      cruising_speed: '${e.specifications.cruising_speed}',
      range: '${e.specifications.range}',
      capacity: ${e.specifications.capacity},
      engines: ${e.specifications.engines},
      engine_type: '${e.specifications.engine_type}',
      length: '${e.specifications.length}',
      wingspan: '${e.specifications.wingspan}',
      height: '${e.specifications.height}'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      {
        phase: 'Ground School',
        duration: '4 weeks',
        topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures']
      },
      {
        phase: 'Simulator Training',
        duration: '3 weeks',
        topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures']
      },
      {
        phase: 'Flight Training',
        duration: '2 weeks',
        topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around']
      }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      {
        type: 'Type Rating Instructor',
        requirements: ['500 hours on type', 'TRI certification', 'Instructor rating']
      }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  },`;
}

let content = fs.readFileSync(DATA_FILE, 'utf8');
const marker = 'export const getManufacturerById';
const markerIndex = content.indexOf(marker);
const bracketBefore = content.lastIndexOf('\n];', markerIndex);
const insertAt = bracketBefore >= 0 ? bracketBefore : markerIndex;

const existingIds = new Set(content.match(/\n\s+id:\s+'([^']+)',\n\s+manufacturer_id:/g)?.map(s => s.match(/'([^']+)'/)[1]) || []);
const newEntries = entries.filter(e => !existingIds.has(e.id)).map(makeEntry).join('\n');

if (newEntries.length > 0) {
  content = content.slice(0, insertAt) + ',\n' + newEntries + '\n' + content.slice(insertAt);
  fs.writeFileSync(DATA_FILE, content);
  const added = entries.filter(e => !existingIds.has(e.id));
  console.log(`Added ${added.length} aircraft entries for ${[...new Set(added.map(e => e.manufacturer_id))].join(', ')}`);
} else {
  console.log('No new entries to add; all IDs already exist.');
}
