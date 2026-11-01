import React from 'react';
import LandingLayout from '../components/landing/LandingLayout';
import Features from '../components/landing/Features';
import AIIntelligence from '../components/landing/AIIntelligence';

export default function FeaturesPage() {
  return (
    <LandingLayout path="/features">
      <Features />
      <AIIntelligence />
    </LandingLayout>
  );
}
