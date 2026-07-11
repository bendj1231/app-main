import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  DollarSign,
  Clock,
  Plane,
  Briefcase,
  Target,
  Users,
  Shield,
  CheckCircle2,
  Brain,
  GraduationCap,
  TrendingUp,
  Zap,
  Globe,
  Star,
  Calendar,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import type { Airline } from '../pages/PortalAirlineExpectationsPage';
import { PilotAptitudeTest } from '../../components/PilotAptitudeTest';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

const tabs = [
  'Overview',
  'Expectations',
  'Fleet',
  'Requirements',
  'Career',
  'Recruitment',
  'Profile',
  'Recognition Plus',
  'Aptitude Test',
];

const nySerif = { fontFamily: "'Georgia', 'Times New Roman', serif" };
const sans = { fontFamily: "'Inter', system-ui, -apple-system, sans-serif" };

interface AirlineArticleViewProps {
  airline: Airline;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasRecognitionAccess: boolean;
  isDarkMode: boolean;
  getSalaryRange: (a: Airline) => string;
  getAssessmentProcess: (a: Airline) => string;
  onBack?: () => void;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-2xl md:text-3xl font-normal text-slate-900 mb-6" style={nySerif}>
    {children}
  </h2>
);

const Paragraph: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <p
    className={`text-base md:text-lg leading-[1.75] text-slate-700 mb-5 ${className}`}
    style={nySerif}
  >
    {children}
  </p>
);

const Lead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-xl md:text-2xl leading-relaxed text-slate-800 mb-10" style={nySerif}>
    {children}
  </p>
);

const PullQuote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <blockquote className="my-8 pl-6 border-l-4 border-red-600">
    <p className="text-xl md:text-2xl font-normal text-slate-900 leading-relaxed" style={nySerif}>
      {children}
    </p>
  </blockquote>
);

const StatBox: React.FC<{ label: string; value: string; icon?: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => (
  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
    <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs uppercase tracking-wider">
      {icon}
      <span>{label}</span>
    </div>
    <p className="text-lg font-semibold text-slate-900" style={sans}>
      {value}
    </p>
  </div>
);

const ImageBlock: React.FC<{ src: string; alt: string; caption?: string }> = ({
  src,
  alt,
  caption,
}) => (
  <figure className="my-10">
    <img src={src} alt={alt} className="w-full rounded-lg shadow-md object-cover" />
    {caption && (
      <figcaption className="text-sm text-slate-500 mt-2 text-center" style={sans}>
        {caption}
      </figcaption>
    )}
  </figure>
);

const getManufacturerId = (aircraftName: string): string | null => {
  const name = aircraftName.toLowerCase();
  if (name.includes('airbus')) return 'airbus';
  if (name.includes('boeing')) return 'boeing';
  if (name.includes('atr')) return 'atr';
  if (name.includes('embraer')) return 'embraer';
  if (name.includes('bombardier')) return 'bombardier';
  if (name.includes('gulfstream')) return 'gulfstream';
  if (name.includes('cessna')) return 'cessna';
  if (name.includes('dassault')) return 'dassault-falcon';
  if (name.includes('pilatus')) return 'pilatus';
  if (name.includes('beechcraft')) return 'beechcraft';
  if (name.includes('sikorsky')) return 'sikorsky';
  if (name.includes('leonardo')) return 'leonardo';
  if (name.includes('de havilland')) return 'de-havilland';
  if (name.includes('mitsubishi')) return 'mitsubishi-mrj';
  if (name.includes('comac')) return 'comac-c919';
  if (name.includes('tecnam')) return 'tecnam';
  if (name.includes('piper')) return 'piper';
  if (name.includes('cirrus')) return 'cirrus';
  if (name.includes('let')) return 'let';
  if (name.includes('aeroprakt')) return 'aeroprakt';
  if (name.includes('antonov')) return 'antonov';
  if (name.includes('ilyushin')) return 'ilyushin';
  if (name.includes('dornier')) return 'dornier';
  if (name.includes('archer')) return 'archer';
  if (name.includes('joby')) return 'joby';
  if (name.includes('lilium')) return 'lilium';
  if (name.includes('wisk')) return 'wisk';
  if (name.includes('beta')) return 'beta';
  if (name.includes('autoflight')) return 'autoflight';
  if (name.includes('eve')) return 'eve';
  if (name.includes('mooney')) return 'mooney';
  if (name.includes('bell')) return 'bell';
  if (name.includes('ehang')) return 'ehang';
  if (name.includes('raytheon')) return 'raytheon';
  return null;
};

const FleetItem: React.FC<{ aircraft: string; index: number }> = ({ aircraft, index }) => {
  const manufacturerId = getManufacturerId(aircraft);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_OUT_EXPO, delay: index * 0.05 }}
      className="group flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-400 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
          <Plane className="w-5 h-5" />
        </div>
        <span className="font-medium text-slate-900">{aircraft}</span>
      </div>
      {manufacturerId && (
        <a
          href={`/manufacturer/${manufacturerId}/expectations`}
          className="text-xs font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Type rating <ChevronRight className="w-3 h-3" />
        </a>
      )}
    </motion.div>
  );
};

const OverviewSection: React.FC<{ airline: Airline }> = ({ airline }) => (
  <>
    <Lead>{airline.description}</Lead>

    <PullQuote>
      {airline.name} operates from {airline.location} with a fleet focused on{' '}
      {airline.fleet || 'modern aircraft'}.
    </PullQuote>

    {airline.image && airline.image !== airline.heroImage && (
      <ImageBlock
        src={airline.image}
        alt={airline.name}
        caption={`${airline.name} is known for ${airline.tags.join(', ')}.`}
      />
    )}

    <SectionTitle>At a Glance</SectionTitle>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <StatBox label="Location" value={airline.location} icon={<MapPin className="w-4 h-4" />} />
      <StatBox label="Region" value={airline.region} icon={<Globe className="w-4 h-4" />} />
      <StatBox label="Fleet" value={airline.fleet || '—'} icon={<Plane className="w-4 h-4" />} />
      <StatBox
        label="Flight Hours"
        value={airline.flightHours}
        icon={<Clock className="w-4 h-4" />}
      />
    </div>

    <SectionTitle>What Pilots Should Know</SectionTitle>
    <Paragraph>
      Airlines in the {airline.region} region often emphasize long-haul operations, multi-cultural
      crews, and rapid fleet modernization. {airline.name} is positioned as a{' '}
      {airline.tags.slice(0, 2).join(' and ')} operator, which shapes both the lifestyle and the
      career progression expectations for pilots joining the airline.
    </Paragraph>
  </>
);

const ExpectationsSection: React.FC<{ airline: Airline }> = ({ airline }) => (
  <>
    <Lead>
      Beyond hours and ratings, {airline.name} looks for specific competencies and cultural traits
      that align with its operational profile.
    </Lead>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {(airline.expectations || []).map((exp, idx) => {
        const Icon = exp.icon || Target;
        return (
          <motion.div
            key={exp.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO, delay: idx * 0.08 }}
            className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: exp.color || '#0ea5e9' }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{exp.title}</h3>
            </div>
            <p className="text-sm text-slate-600 mb-3">{exp.desc}</p>
            <ul className="space-y-2">
              {exp.bullets.map((bullet, bidx) => (
                <li key={bidx} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        );
      })}
    </div>
  </>
);

const FleetSection: React.FC<{ airline: Airline }> = ({ airline }) => {
  const fleetItems =
    airline.fleetWithEndOfService ||
    (airline.fleet
      ? airline.fleet.split(',').map((a) => ({ aircraft: a.trim(), endOfService: 'In service' }))
      : []);

  return (
    <>
      <Lead>
        Fleet composition is one of the strongest signals of where a pilot&apos;s type-rating
        investment should be directed.
      </Lead>

      <SectionTitle>Current Fleet</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {fleetItems.map((item, idx) => (
          <FleetItem key={idx} aircraft={item.aircraft} index={idx} />
        ))}
      </div>

      {airline.futureFleetPlans && (
        <>
          <SectionTitle>Future Fleet Plans</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {airline.futureFleetPlans.newAircraft.length > 0 && (
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 mb-3 text-sky-600">
                  <TrendingUp className="w-5 h-5" />
                  <h3 className="font-semibold">New Aircraft on Order</h3>
                </div>
                <ul className="space-y-1">
                  {airline.futureFleetPlans.newAircraft.map((a, i) => (
                    <li key={i} className="text-sm text-slate-700">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {airline.futureFleetPlans.retiringAircraft.length > 0 && (
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 mb-3 text-amber-600">
                  <Calendar className="w-5 h-5" />
                  <h3 className="font-semibold">Phasing Out</h3>
                </div>
                <ul className="space-y-1">
                  {airline.futureFleetPlans.retiringAircraft.map((a, i) => (
                    <li key={i} className="text-sm text-slate-700">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Paragraph>{airline.futureFleetPlans.expansionPlans}</Paragraph>
        </>
      )}

      {airline.aircraftDemand && (
        <>
          <SectionTitle>Aircraft Demand</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatBox
              label="Airbus Preference"
              value={`${airline.aircraftDemand.airbusPreference}%`}
              icon={<Plane className="w-4 h-4" />}
            />
            <StatBox
              label="Boeing Preference"
              value={`${airline.aircraftDemand.boeingPreference}%`}
              icon={<Plane className="w-4 h-4" />}
            />
            <StatBox
              label="Primary Manufacturer"
              value={airline.aircraftDemand.primaryManufacturer}
              icon={<Target className="w-4 h-4" />}
            />
          </div>
          <Paragraph>
            Trending aircraft include: {airline.aircraftDemand.trendingAircraft.join(', ')}.
          </Paragraph>
        </>
      )}
    </>
  );
};

const RequirementsSection: React.FC<{
  airline: Airline;
  hasRecognitionAccess: boolean;
  getAssessmentProcess: (a: Airline) => string;
}> = ({ airline, hasRecognitionAccess, getAssessmentProcess }) => (
  <>
    <Lead>
      Understanding the formal requirements — and the hidden filters — helps pilots decide when they
      are truly competitive for {airline.name}.
    </Lead>

    {airline.pilotRequirements && (
      <>
        <SectionTitle>Pilot Requirements</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <StatBox
            label="Minimum Hours"
            value={`${airline.pilotRequirements.minHours.toLocaleString()} hrs`}
            icon={<Clock className="w-4 h-4" />}
          />
          <StatBox
            label="Preferred Hours"
            value={`${airline.pilotRequirements.preferredHours.toLocaleString()} hrs`}
            icon={<Star className="w-4 h-4" />}
          />
          <StatBox
            label="Type Ratings Required"
            value={airline.pilotRequirements.typeRatingRequired.join(', ') || '—'}
            icon={<Plane className="w-4 h-4" />}
          />
          <StatBox
            label="Languages"
            value={airline.pilotRequirements.languageRequirements.join(', ')}
            icon={<Globe className="w-4 h-4" />}
          />
        </div>
        {airline.pilotRequirements.additionalCertifications.length > 0 && (
          <Paragraph>
            Additional certifications:{' '}
            {airline.pilotRequirements.additionalCertifications.join(', ')}.
          </Paragraph>
        )}
      </>
    )}

    <SectionTitle>Assessment Process</SectionTitle>
    <Paragraph>{getAssessmentProcess(airline)}</Paragraph>

    {airline.detailedInfo?.entryRequirements && (
      <>
        <SectionTitle>Entry Requirements</SectionTitle>
        <div className="space-y-4">
          {airline.detailedInfo.entryRequirements.captains && (
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Direct Entry Captains</h3>
              <p className="text-sm text-slate-700">
                {airline.detailedInfo.entryRequirements.captains}
              </p>
            </div>
          )}
          {airline.detailedInfo.entryRequirements.firstOfficers && (
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">First Officers</h3>
              <p className="text-sm text-slate-700">
                {airline.detailedInfo.entryRequirements.firstOfficers}
              </p>
            </div>
          )}
          {airline.detailedInfo.entryRequirements.licensesMedical && (
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Licenses & Medical</h3>
              <p className="text-sm text-slate-700">
                {airline.detailedInfo.entryRequirements.licensesMedical}
              </p>
            </div>
          )}
          {airline.detailedInfo.entryRequirements.recency && (
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Recency</h3>
              <p className="text-sm text-slate-700">
                {airline.detailedInfo.entryRequirements.recency}
              </p>
            </div>
          )}
        </div>
      </>
    )}

    {!hasRecognitionAccess && airline.detailedInfo?.entryRequirements && (
      <div className="mt-8 p-5 rounded-xl bg-amber-50 border border-amber-200">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900 mb-1">PilotRecognition+ Required</h3>
            <p className="text-sm text-amber-800">
              Full entry requirements and assessment details are available with PilotRecognition+
              membership.
            </p>
          </div>
        </div>
      </div>
    )}
  </>
);

const CareerSection: React.FC<{
  airline: Airline;
  hasRecognitionAccess: boolean;
  getSalaryRange: (a: Airline) => string;
}> = ({ airline, hasRecognitionAccess, getSalaryRange }) => (
  <>
    <Lead>
      Career value at {airline.name} extends beyond salary — it includes roster patterns, training
      culture, and long-term fleet growth.
    </Lead>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <StatBox
        label="Salary Range"
        value={getSalaryRange(airline)}
        icon={<DollarSign className="w-4 h-4" />}
      />
      <StatBox
        label="Flight Hours"
        value={airline.flightHours}
        icon={<Clock className="w-4 h-4" />}
      />
      <StatBox label="Location" value={airline.location} icon={<MapPin className="w-4 h-4" />} />
      <StatBox
        label="Primary Tags"
        value={airline.tags.slice(0, 2).join(', ')}
        icon={<Star className="w-4 h-4" />}
      />
    </div>

    {airline.detailedInfo?.workingConditions && (
      <>
        <SectionTitle>Working Conditions</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {airline.detailedInfo.workingConditions.rostering && (
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-1">Rostering</h3>
              <p className="text-sm text-slate-700">
                {airline.detailedInfo.workingConditions.rostering}
              </p>
            </div>
          )}
          {airline.detailedInfo.workingConditions.culture && (
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-1">Culture</h3>
              <p className="text-sm text-slate-700">
                {airline.detailedInfo.workingConditions.culture}
              </p>
            </div>
          )}
          {airline.detailedInfo.workingConditions.training && (
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-1">Training</h3>
              <p className="text-sm text-slate-700">
                {airline.detailedInfo.workingConditions.training}
              </p>
            </div>
          )}
          {airline.detailedInfo.workingConditions.bonds && (
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-1">Bonds & Contracts</h3>
              <p className="text-sm text-slate-700">
                {airline.detailedInfo.workingConditions.bonds}
              </p>
            </div>
          )}
        </div>
      </>
    )}

    {airline.detailedInfo?.compensationBenefits && (
      <>
        <SectionTitle>Compensation & Benefits</SectionTitle>
        <div className="space-y-4 mb-8">
          {airline.detailedInfo.compensationBenefits.salary && (
            <Paragraph>{airline.detailedInfo.compensationBenefits.salary}</Paragraph>
          )}
          {airline.detailedInfo.compensationBenefits.livingSupport && (
            <Paragraph>{airline.detailedInfo.compensationBenefits.livingSupport}</Paragraph>
          )}
          {airline.detailedInfo.compensationBenefits.travelPerks && (
            <Paragraph>{airline.detailedInfo.compensationBenefits.travelPerks}</Paragraph>
          )}
          {airline.detailedInfo.compensationBenefits.insurance && (
            <Paragraph>{airline.detailedInfo.compensationBenefits.insurance}</Paragraph>
          )}
        </div>
      </>
    )}

    {!hasRecognitionAccess && airline.detailedInfo?.compensationBenefits && (
      <div className="p-5 rounded-xl bg-amber-50 border border-amber-200">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900 mb-1">Detailed compensation data</h3>
            <p className="text-sm text-amber-800">
              Full salary bands, living support, and benefits breakdowns are available with
              PilotRecognition+.
            </p>
          </div>
        </div>
      </div>
    )}
  </>
);

const RecruitmentSection: React.FC<{ airline: Airline }> = ({ airline }) => (
  <>
    <Lead>
      Recruitment channels and current openings change frequently. Here is the latest status for{' '}
      {airline.name}.
    </Lead>

    {airline.detailedInfo?.recruitmentStatus ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {airline.detailedInfo.recruitmentStatus.typeRatedPositions && (
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-2 text-sky-600">
              <Briefcase className="w-5 h-5" />
              <h3 className="font-semibold">Type-Rated Positions</h3>
            </div>
            <p className="text-sm text-slate-700">
              {airline.detailedInfo.recruitmentStatus.typeRatedPositions}
            </p>
          </div>
        )}
        {airline.detailedInfo.recruitmentStatus.directEntryCaptains && (
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-2 text-sky-600">
              <Users className="w-5 h-5" />
              <h3 className="font-semibold">Direct Entry Captains</h3>
            </div>
            <p className="text-sm text-slate-700">
              {airline.detailedInfo.recruitmentStatus.directEntryCaptains}
            </p>
          </div>
        )}
        {airline.detailedInfo.recruitmentStatus.applicationMethod && (
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-2 text-sky-600">
              <Globe className="w-5 h-5" />
              <h3 className="font-semibold">How to Apply</h3>
            </div>
            <p className="text-sm text-slate-700">
              {airline.detailedInfo.recruitmentStatus.applicationMethod}
            </p>
          </div>
        )}
        {airline.detailedInfo.recruitmentStatus.assessmentProcess && (
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-2 text-sky-600">
              <Target className="w-5 h-5" />
              <h3 className="font-semibold">Assessment Process</h3>
            </div>
            <p className="text-sm text-slate-700">
              {airline.detailedInfo.recruitmentStatus.assessmentProcess}
            </p>
          </div>
        )}
      </div>
    ) : (
      <Paragraph>
        Recruitment status data is not yet available for {airline.name}. Check the airline&apos;s
        official careers portal for the latest openings.
      </Paragraph>
    )}

    {airline.detailedInfo?.latestUpdates && (
      <>
        <SectionTitle>Latest Updates</SectionTitle>
        <div className="space-y-3">
          {airline.detailedInfo.latestUpdates.fleetNews && (
            <Paragraph>Fleet news: {airline.detailedInfo.latestUpdates.fleetNews}</Paragraph>
          )}
          {airline.detailedInfo.latestUpdates.futureOrders && (
            <Paragraph>Future orders: {airline.detailedInfo.latestUpdates.futureOrders}</Paragraph>
          )}
          {airline.detailedInfo.latestUpdates.openings && (
            <Paragraph>Openings: {airline.detailedInfo.latestUpdates.openings}</Paragraph>
          )}
          {airline.detailedInfo.latestUpdates.a380Status && (
            <Paragraph>A380 status: {airline.detailedInfo.latestUpdates.a380Status}</Paragraph>
          )}
        </div>
      </>
    )}
  </>
);

const ProfileSection: React.FC<{ airline: Airline }> = ({ airline }) => (
  <>
    <Lead>
      Pilots who align their profiles with {airline.name}&apos;s stated competencies tend to move
      faster through screening and onboarding.
    </Lead>

    {airline.detailedInfo?.profileAlignment && (
      <>
        <SectionTitle>Profile Alignment</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {airline.detailedInfo.profileAlignment.technicalMastery && (
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-2 text-sky-600">
                <Zap className="w-5 h-5" />
                <h3 className="font-semibold">Technical Mastery</h3>
              </div>
              <p className="text-sm text-slate-700">
                {airline.detailedInfo.profileAlignment.technicalMastery}
              </p>
            </div>
          )}
          {airline.detailedInfo.profileAlignment.crmManualFlying && (
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-2 text-sky-600">
                <Users className="w-5 h-5" />
                <h3 className="font-semibold">CRM & Manual Flying</h3>
              </div>
              <p className="text-sm text-slate-700">
                {airline.detailedInfo.profileAlignment.crmManualFlying}
              </p>
            </div>
          )}
          {airline.detailedInfo.profileAlignment.professionalism && (
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-2 text-sky-600">
                <Shield className="w-5 h-5" />
                <h3 className="font-semibold">Professionalism</h3>
              </div>
              <p className="text-sm text-slate-700">
                {airline.detailedInfo.profileAlignment.professionalism}
              </p>
            </div>
          )}
          {airline.detailedInfo.profileAlignment.culturalAdaptability && (
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-2 text-sky-600">
                <Globe className="w-5 h-5" />
                <h3 className="font-semibold">Cultural Adaptability</h3>
              </div>
              <p className="text-sm text-slate-700">
                {airline.detailedInfo.profileAlignment.culturalAdaptability}
              </p>
            </div>
          )}
        </div>
      </>
    )}

    {airline.detailedInfo?.coreCompetencies && (
      <>
        <SectionTitle>Core Competencies</SectionTitle>
        <div className="space-y-4">
          {airline.detailedInfo.coreCompetencies.oneTeam && (
            <Paragraph>
              <strong>One Team:</strong> {airline.detailedInfo.coreCompetencies.oneTeam}
            </Paragraph>
          )}
          {airline.detailedInfo.coreCompetencies.drivingExcellence && (
            <Paragraph>
              <strong>Driving Excellence:</strong>{' '}
              {airline.detailedInfo.coreCompetencies.drivingExcellence}
            </Paragraph>
          )}
          {airline.detailedInfo.coreCompetencies.customerFirst && (
            <Paragraph>
              <strong>Customer First:</strong> {airline.detailedInfo.coreCompetencies.customerFirst}
            </Paragraph>
          )}
          {airline.detailedInfo.coreCompetencies.safetySituational && (
            <Paragraph>
              <strong>Safety & Situational Awareness:</strong>{' '}
              {airline.detailedInfo.coreCompetencies.safetySituational}
            </Paragraph>
          )}
          {airline.detailedInfo.coreCompetencies.futureFleetInsights && (
            <Paragraph>
              <strong>Future Fleet Insights:</strong>{' '}
              {airline.detailedInfo.coreCompetencies.futureFleetInsights}
            </Paragraph>
          )}
        </div>
      </>
    )}
  </>
);

const RecognitionPlusSection: React.FC<{
  airline: Airline;
  hasRecognitionAccess: boolean;
  getSalaryRange: (a: Airline) => string;
}> = ({ airline, hasRecognitionAccess, getSalaryRange }) => (
  <>
    <Lead>
      PilotRecognition+ unlocks deeper insights into {airline.name}&apos;s expectations, salary
      bands, and assessment preparation.
    </Lead>

    {hasRecognitionAccess ? (
      <>
        <SectionTitle>Member Insights</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <StatBox
            label="Detailed Salary"
            value={getSalaryRange(airline)}
            icon={<DollarSign className="w-4 h-4" />}
          />
          <StatBox
            label="Assessment"
            value="Full breakdown available"
            icon={<Brain className="w-4 h-4" />}
          />
          <StatBox
            label="Preparation"
            value="Interview guides & question bank"
            icon={<GraduationCap className="w-4 h-4" />}
          />
          <StatBox
            label="Profile Match"
            value="AI-powered alignment"
            icon={<Target className="w-4 h-4" />}
          />
        </div>

        {airline.detailedInfo?.preparationResources && (
          <>
            <SectionTitle>Preparation Resources</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {airline.detailedInfo.preparationResources.psychometricCognitive && (
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">Psychometric & Cognitive</h3>
                  <p className="text-sm text-slate-700 mb-2">
                    {airline.detailedInfo.preparationResources.psychometricCognitive.description}
                  </p>
                  <p className="text-xs text-slate-500">
                    Cost: {airline.detailedInfo.preparationResources.psychometricCognitive.cost}
                  </p>
                </div>
              )}
              {airline.detailedInfo.preparationResources.atplQuestionBank && (
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">ATPL Question Bank</h3>
                  <p className="text-sm text-slate-700 mb-2">
                    {airline.detailedInfo.preparationResources.atplQuestionBank.description}
                  </p>
                  <p className="text-xs text-slate-500">
                    Cost: {airline.detailedInfo.preparationResources.atplQuestionBank.cost}
                  </p>
                </div>
              )}
              {airline.detailedInfo.preparationResources.interviewCoaching && (
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">Interview Coaching</h3>
                  <p className="text-sm text-slate-700 mb-2">
                    {airline.detailedInfo.preparationResources.interviewCoaching.description}
                  </p>
                  <p className="text-xs text-slate-500">
                    Cost: {airline.detailedInfo.preparationResources.interviewCoaching.cost}
                  </p>
                </div>
              )}
              {airline.detailedInfo.preparationResources.technicalGuides && (
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">Technical Guides</h3>
                  <p className="text-sm text-slate-700 mb-2">
                    {airline.detailedInfo.preparationResources.technicalGuides.description}
                  </p>
                  <p className="text-xs text-slate-500">
                    Cost: {airline.detailedInfo.preparationResources.technicalGuides.cost}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </>
    ) : (
      <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 text-center">
        <Shield className="w-12 h-12 text-amber-600 mx-auto mb-4" />
        <h3 className="text-2xl font-normal text-amber-900 mb-3" style={nySerif}>
          Unlock the full article
        </h3>
        <p className="text-base text-amber-800 mb-6 max-w-lg mx-auto">
          PilotRecognition+ members get detailed salary data, full assessment breakdowns, interview
          guides, and AI-powered profile matching for {airline.name}.
        </p>
        <button className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition-colors">
          Upgrade to PilotRecognition+
        </button>
      </div>
    )}
  </>
);

const Sidebar: React.FC<{
  airline: Airline;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasRecognitionAccess: boolean;
  getSalaryRange: (a: Airline) => string;
}> = ({ airline, activeTab, setActiveTab, hasRecognitionAccess, getSalaryRange }) => (
  <aside className="space-y-6">
    <div className="sticky top-24 space-y-6">
      {/* Mini table of contents */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
          In this article
        </h3>
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === tab
                  ? 'bg-sky-50 text-sky-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Quick stats */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          Quick Stats
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-sky-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400">Salary</p>
              <p className="text-sm font-medium">{getSalaryRange(airline)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-sky-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400">Hours</p>
              <p className="text-sm font-medium">{airline.flightHours}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-sky-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400">Base</p>
              <p className="text-sm font-medium">{airline.location}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Plane className="w-5 h-5 text-sky-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400">Fleet</p>
              <p className="text-sm font-medium">{airline.fleet || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {airline.logo && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-center shadow-sm">
          <img src={airline.logo} alt={airline.name} className="max-h-16 w-auto object-contain" />
        </div>
      )}

      {!hasRecognitionAccess && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-semibold text-amber-900 mb-2">PilotRecognition+</h3>
          <p className="text-sm text-amber-800 mb-4">
            Get full requirements, salary bands, and assessment guides.
          </p>
          <button className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold transition-colors">
            Upgrade
          </button>
        </div>
      )}
    </div>
  </aside>
);

export const AirlineArticleView: React.FC<AirlineArticleViewProps> = ({
  airline,
  activeTab,
  setActiveTab,
  hasRecognitionAccess,
  isDarkMode,
  getSalaryRange,
  getAssessmentProcess,
  onBack,
}) => {
  return (
    <div className="bg-white min-h-screen">
      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-4 md:px-6 pt-10 pb-6 text-center">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to airlines
          </button>
        )}
        <div
          className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500 mb-4"
          style={sans}
        >
          {airline.region}
        </div>
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-normal text-slate-900 leading-[1.05] mb-4"
          style={nySerif}
        >
          {airline.name}
        </h1>
        <p className="text-lg md:text-xl text-slate-600 italic mb-4" style={nySerif}>
          {airline.location}
        </p>
        <div className="flex items-center justify-center gap-3 text-sm text-slate-500" style={sans}>
          <span className="font-medium text-slate-900">PilotRecognition Network</span>
          <span>•</span>
          <span>{airline.lastUpdated || 'Updated recently'}</span>
        </div>
      </header>

      {/* Hero Image */}
      <figure className="max-w-6xl mx-auto px-4 md:px-6 mb-10">
        <div className="relative aspect-[21/9] rounded-xl overflow-hidden shadow-lg">
          <img
            src={airline.heroImage || airline.image}
            alt={airline.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex flex-wrap gap-2">
              {airline.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-semibold bg-white/90 text-slate-900 rounded-full"
                  style={sans}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <figcaption className="text-sm text-slate-500 mt-3 text-center" style={sans}>
          {airline.name} operates across {airline.region} with a focus on {airline.tags.join(', ')}.
        </figcaption>
      </figure>

      {/* Lead / Deck */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 mb-12">
        <p className="text-xl md:text-2xl leading-relaxed text-slate-800" style={nySerif}>
          {airline.description}
        </p>
      </div>

      {/* Sticky Tab Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-y border-slate-200 py-3">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-colors ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                style={sans}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Article Body + Sidebar */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <main className="lg:col-span-8">
            {activeTab === 'Overview' && <OverviewSection airline={airline} />}
            {activeTab === 'Expectations' && <ExpectationsSection airline={airline} />}
            {activeTab === 'Fleet' && <FleetSection airline={airline} />}
            {activeTab === 'Requirements' && (
              <RequirementsSection
                airline={airline}
                hasRecognitionAccess={hasRecognitionAccess}
                getAssessmentProcess={getAssessmentProcess}
              />
            )}
            {activeTab === 'Career' && (
              <CareerSection
                airline={airline}
                hasRecognitionAccess={hasRecognitionAccess}
                getSalaryRange={getSalaryRange}
              />
            )}
            {activeTab === 'Recruitment' && <RecruitmentSection airline={airline} />}
            {activeTab === 'Profile' && <ProfileSection airline={airline} />}
            {activeTab === 'Recognition Plus' && (
              <RecognitionPlusSection
                airline={airline}
                hasRecognitionAccess={hasRecognitionAccess}
                getSalaryRange={getSalaryRange}
              />
            )}
            {activeTab === 'Aptitude Test' && (
              <div className="py-8">
                <Lead>Test your knowledge against {airline.name}&apos;s expectations.</Lead>
                <PilotAptitudeTest airlineName={airline.name} isDarkMode={isDarkMode} />
              </div>
            )}
          </main>

          <div className="lg:col-span-4">
            <Sidebar
              airline={airline}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              hasRecognitionAccess={hasRecognitionAccess}
              getSalaryRange={getSalaryRange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
