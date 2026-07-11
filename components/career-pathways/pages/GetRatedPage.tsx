import React from 'react';
import { PathwayLandingPage } from './PathwayLandingPage';

export const GetRatedPage: React.FC = () => {
  return (
    <PathwayLandingPage
      heroTitle="Discover ratings"
      heroCtaTargetId="ato-content"
      choiceRectangles={[
        {
          label: 'Type Ratings',
          title: 'Search',
          description: 'Find your next rating',
          path: '/type-ratings',
        },
        {
          label: 'Pathways',
          title: 'View all pathways',
          description: 'Browse every career pathway',
          path: '/pathways',
        },
        {
          label: 'Recognition+',
          title: 'Get verified first',
          description: 'Operators and airlines prefer pre-screened pilots',
          path: '/recognition-plus',
          accentColor: '#f87171',
        },
      ]}
      searchPath="/type-ratings"
      contentTagline="ATOs & type rating centers"
      contentDescription="Compare type rating offerings from ATOs and type rating centers, then submit interest to start your pathway."
      contentPrimaryCta={{ label: 'Browse type ratings', path: '/type-ratings' }}
      contentSecondaryCta={{ label: 'Close', path: '/discover' }}
      contentFeatures={[
        { label: 'ATO Directory', color: '#34d399' },
        { label: 'Submit Interest', color: '#818cf8' },
        { label: 'Career Pathways', color: '#fbbf24' },
      ]}
      carouselTitle="Recommended pathways"
      recommendedManufacturerId="embraer"
      additionalAircraftIds={['a320-200', 'b737-max', 'cessna-172', 'atr-72-600', 'crj900']}
      detailCtaPath="/type-ratings"
    />
  );
};

export default GetRatedPage;
