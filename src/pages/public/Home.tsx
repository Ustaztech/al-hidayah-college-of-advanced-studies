import React, { useState } from 'react';
import { Hero } from '../../components/home/Hero';
import { RectorWelcome } from '../../components/home/RectorWelcome';
import { InteractiveCourseFinder } from '../../components/home/InteractiveCourseFinder';
import { WhyAHCAS } from '../../components/home/WhyAHCAS';
import { CampusGallery } from '../../components/home/CampusGallery';
import { NewsPreview } from '../../components/home/NewsPreview';
import { CalendarPreview } from '../../components/home/CalendarPreview';
import { FAQAccordion } from '../../components/home/FAQAccordion';
import { ScratchCardModal } from '../../components/common/ScratchCardModal';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const [scratchModalOpen, setScratchModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="space-y-0 bg-[#F4F6F5] selection:bg-[#196855] selection:text-white">
      {/* 1. Hero Showcase matching alhidayahcollege.com with 10-Col Slider & Top News */}
      <Hero onOpenScratchCardModal={() => setScratchModalOpen(true)} />

      {/* 2. Welcome & Administrative Messages + Quick Links, Mission, Vision */}
      <RectorWelcome />

      {/* 3. Interactive Direct Entry 200L Career & Subject Combination Matcher */}
      <InteractiveCourseFinder />

      {/* 4. Why Us? 6 Strategic Institutional Highlights */}
      <WhyAHCAS />

      {/* 5. Campus Media & Orientation Showcase */}
      <CampusGallery />

      {/* 6. News and Events Highlights */}
      <NewsPreview />

      {/* 7. School Academic Calendar & Session Milestones */}
      <CalendarPreview />

      {/* 8. Frequently Asked Questions */}
      <FAQAccordion />

      {/* Scratch Card Verification Modal */}
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

export default Home;
