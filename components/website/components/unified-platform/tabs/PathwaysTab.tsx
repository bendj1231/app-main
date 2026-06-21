import React from 'react';
import { PathwaysPageModern } from '@/portal/pages/PathwaysPageModern';

export const PathwaysTab: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7">
    <PathwaysPageModern isDarkMode={true} embedded={true} onNavigate={onNavigate} onNavigateToPathway={(id) => onNavigate(`pathways-detail/${id}`)} />
  </div>
);
