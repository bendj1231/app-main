import React from 'react';
import TypeRatingSearchPage from '@/pages/TypeRatingSearchPage';

export const ManufacturersTab: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7">
    <TypeRatingSearchPage onNavigate={onNavigate} />
  </div>
);
