import React from 'react';
import { sanitizeJsonLd } from '@/lib/sanitize-html';

interface HomePageSchemaProps {
  url?: string;
}

export const HomePageSchema: React.FC<HomePageSchemaProps> = ({ url = 'https://pilotrecognition.com' }) => {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PilotRecognition',
    alternateName: 'Pilotrecognition.com',
    url: url,
    logo: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
    description: 'Aviation Industry\'s First Pilot Recognition-Based Platform operated by Benjamin Bowler pending incorporation of Aviation Pathways Ltd. Transform your aviation career with industry-accredited pilot recognition profiles, EBT CBTA training, and direct airline pathways.',
    foundingDate: '2025',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AE',
      addressLocality: 'Dubai'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: 'https://pilotrecognition.com/contact-support'
    },
    sameAs: [
      // Add social media URLs when available
    ],
    knowsAbout: [
      'Pilot Recognition',
      'Aviation Career Development',
      'EBT CBTA Training',
      'Airline Pathways',
      'Pilot Assessment',
      'Aviation Mentorship',
      'Flight Training',
      'Commercial Pilot License',
      'Airline Pilot Careers'
    ]
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Pilotrecognition.com',
    alternateName: 'Pilot Recognition',
    url: url,
    description: 'Aviation Industry\'s First Pilot Recognition-Based Platform. Transform your aviation career with industry-accredited pilot recognition profiles, EBT CBTA training, Foundation and Transition programs, AI-powered career matching, and direct airline pathways.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Benjamin Bowler (pending Aviation Pathways Ltd)',
      url: url
    }
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Pilot Recognition Platform',
    description: 'Comprehensive pilot recognition and career development platform featuring verified pilot profiles, EBT CBTA training programs, and direct airline pathway matching.',
    provider: {
      '@type': 'Organization',
      name: 'PilotRecognition',
      url: url
    },
    serviceType: 'Pilot Career Development',
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Pilot Recognition Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Foundation Program',
            description: '50-hour mentorship program with EBT/CBTA competency baseline assessment'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Transition Program',
            description: 'Airline transition readiness with ATLAS CV optimization and industry alignment'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Recognition Plus Membership',
            description: 'Annual premium membership with unlimited pathway access and priority matching'
          }
        }
      ]
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is PilotRecognition?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'PilotRecognition is the Aviation Industry\'s First Pilot Recognition-Based Platform that transforms pilot careers through verified recognition profiles, EBT CBTA training, and direct airline pathways.'
        }
      },
      {
        '@type': 'Question',
        name: 'How does the Pilot Recognition Profile work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Pilot Recognition Profile is a comprehensive, living document that evolves with your aviation career, presenting verified scores, skills, flight hours, and ATS-optimized CV formatting for airline recruitment systems.'
        }
      },
      {
        '@type': 'Question',
        name: 'What programs does PilotRecognition offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'PilotRecognition offers the Foundation Program (50-hour mentorship), Transition Program (airline readiness), and Recognition Plus membership with unlimited pathway access.'
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(faqSchema) }}
      />
    </>
  );
};
