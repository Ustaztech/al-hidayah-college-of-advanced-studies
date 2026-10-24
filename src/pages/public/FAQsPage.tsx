import React from 'react';
import { FAQAccordion } from '../../components/home/FAQAccordion';

export const FAQsPage: React.FC = () => {
  return (
    <div className="py-12 bg-white dark:bg-[#1A222C] transition-colors">
      <FAQAccordion />
    </div>
  );
};
