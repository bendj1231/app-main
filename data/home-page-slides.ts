/**
 * Home Page Slides Configuration
 * Extracted from HomePage component for better maintainability
 */

export interface Slide {
    image: string;
    title: string;
    subtitle: string;
    category: 'program' | 'systems_automation' | 'network' | 'application' | 'pathways';
    regions?: { name: string; flag?: string }[];
    isDarkCard?: boolean;
}

export const HOME_PAGE_SLIDES: Slide[] = [
    {
        image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
        title: 'Foundational Program',
        subtitle: 'Build a solid foundation for your aviation career',
        category: 'program',
        regions: [
            { name: 'Global', flag: '🌍' }
        ]
    },
    {
        image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
        title: 'Transition Program',
        subtitle: 'Advance your skills for commercial aviation',
        category: 'program',
        regions: [
            { name: 'Global', flag: '🌍' }
        ]
    },
    {
        image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
        title: 'Pilot Recognition',
        subtitle: 'Get recognized for your achievements',
        category: 'program',
        regions: [
            { name: 'Global', flag: '🌍' }
        ]
    },
    {
        image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
        title: 'Career Pathways',
        subtitle: 'Explore diverse aviation career paths',
        category: 'pathways',
        regions: [
            { name: 'Global', flag: '🌍' }
        ]
    }
];

export const ANIMATED_HEADER_ITEMS = [
    { text: 'Programs', color: 'text-white' },
    { text: 'Recognition', color: 'text-[#DAA520]' },
    { text: 'Pathways', color: 'text-white' }
];
