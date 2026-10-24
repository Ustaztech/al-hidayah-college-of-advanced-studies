import React, { useState } from 'react';
import { Hero } from '../../components/home/Hero';
import { QuickLinksGrid } from '../../components/home/QuickLinksGrid';
import { RectorWelcome } from '../../components/home/RectorWelcome';
import { StatsSection } from '../../components/home/StatsSection';
import { ProgrammeFilter } from '../../components/home/ProgrammeFilter';
import { AdmissionsGuide } from '../../components/home/AdmissionsGuide';
import { StudentServicesGrid } from '../../components/home/StudentServicesGrid';
import { WhyAHCAS } from '../../components/home/WhyAHCAS';
import { NewsPreview } from '../../components/home/NewsPreview';
import { CalendarPreview } from '../../components/home/CalendarPreview';
import { FAQAccordion } from '../../components/home/FAQAccordion';
import { ScratchCardModal } from '../../components/common/ScratchCardModal';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const [scratchModalOpen, setScratchModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="space-y-0">
      <Hero onOpenScratchCardModal={() => setScratchModalOpen(true)} />
      <QuickLinksGrid onOpenScratchCardModal={() => setScratchModalOpen(true)} />
      <RectorWelcome />
      <StatsSection />
      <ProgrammeFilter />
      <AdmissionsGuide />
      <StudentServicesGrid />
      <WhyAHCAS />
      <NewsPreview />
      <CalendarPreview />
      <FAQAccordion />

      {/* Scratch Card Result Verification Modal */}
      <ScratchCardModal
        isOpen={scratchModalOpen}
        onClose={() => setScratchModalOpen(false)}
        expectedType="RESULT_CHECKING"
        title="AHCAS Scratch Card Result Verification"
        onSuccessUnlock={() => {
          navigate('/student/dashboard');
        }}
      />
    </div>
  );
};
