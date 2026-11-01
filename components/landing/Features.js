import WhatMakesOctisDifferent from './WhatMakesOctisDifferent';
import WhyOctis from './WhyOctis';

export default function Features() {
  return (
    <div id="features" className="scroll-mt-20">
      <section className="pt-20 md:pt-28 landing-surface-tinted relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <WhatMakesOctisDifferent />
        </div>
      </section>
      <WhyOctis />
    </div>
  );
}
