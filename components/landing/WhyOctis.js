import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Receipt,
  Network,
  BarChart3,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

export default function WhyOctis() {
  const [activeStage, setActiveStage] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const stages = [
    {
      step: '01',
      stageName: 'Jewellery ERP',
      headline: 'Run Every Transaction',
      supportingText:
        'Manage billing, inventory, metal, vendors, karigars and customer operations in one jewellery-specific ERP.',
      imageSrc: '/landing/journey-stage1-erp.jpg',
      alt: 'Octis jewellery ERP billing terminal and operations counter in a luxury showroom displaying transaction details for a gold necklace',
      icon: Receipt,
      category: 'Operations',
    },
    {
      step: '02',
      stageName: 'Connected Data',
      headline: 'Connect Every Part of Your Business',
      supportingText:
        'Bring articles, gold, customers, vendors and karigars into one connected data layer.',
      imageSrc: '/landing/journey-stage2-data.jpg',
      alt: 'Central tablet showing unified system overview connected via gold conduits to bullion, scale, jewellery trays, and karigar records',
      icon: Network,
      category: 'Data Layer',
    },
    {
      step: '03',
      stageName: 'Business Intelligence',
      headline: 'Understand What Is Happening',
      supportingText:
        'Explore jewellery-specific reports, traceability, stock movement and business performance.',
      imageSrc: '/landing/journey-stage3-bi.jpg',
      alt: 'Executive studio monitor displaying jewellery sales velocity curves, gross margin indicators, and stock turnover metrics',
      icon: BarChart3,
      category: 'Analytics',
    },
    {
      step: '04',
      stageName: 'AI Insights & Recommendations',
      headline: 'Discover What Needs Attention',
      supportingText:
        'Identify patterns, exceptions, risks and opportunities, then decide what to do next.',
      imageSrc: '/landing/journey-stage4-ai.jpg',
      alt: 'Boardroom laptop displaying an AI restock recommendation alert with demand velocity metrics and review action button',
      icon: Sparkles,
      category: 'Decisions',
    },
    {
      step: '05',
      stageName: 'Digital Commerce',
      headline: 'Bring Your Inventory Online',
      supportingText:
        'Turn ERP inventory into a customer-facing digital catalogue with AI-assisted product imagery.',
      imageSrc: '/landing/journey-stage5-commerce.jpg',
      alt: 'Showroom presentation table with upright tablet displaying live synchronized digital jewellery catalogue alongside handcrafted diamond necklace',
      icon: ShoppingBag,
      category: 'Omnichannel',
    },
  ];

  const current = stages[activeStage];

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveStage((prev) => (prev + 1) % stages.length);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveStage((prev) => (prev - 1 + stages.length) % stages.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveStage(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveStage(stages.length - 1);
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      setActiveStage((prev) => (prev + 1) % stages.length);
    } else if (diff < -50) {
      setActiveStage((prev) => (prev - 1 + stages.length) % stages.length);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      id="why-octis"
      className="py-20 md:py-28 landing-surface relative scroll-mt-20 overflow-hidden"
      aria-label="Five-Stage Product Journey"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ======================================================== */}
        {/* 1. SECTION HEADER: REPLACED VALUE PROPOSITION           */}
        {/* ======================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <p className="landing-section-label mb-3">Five-Stage Product Journey</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1a2f4a] mb-4">
            Why Octis: The Complete Jewellery Journey
          </h2>
          <p className="text-base sm:text-lg text-[#334155] leading-relaxed max-w-2xl mx-auto font-normal">
            Connecting daily showroom transactions to a unified data layer, business intelligence,
            actionable AI recommendations, and customer-facing digital commerce.
          </p>
        </div>

        {/* ======================================================== */}
        {/* 2. RESTRAINED CONNECTING JOURNEY RAIL                    */}
        {/* ======================================================== */}
        <div
          role="tablist"
          aria-label="Product Journey Stages"
          onKeyDown={handleKeyDown}
          className="mb-10 sm:mb-12 relative"
        >
          {/* Subtle connecting background line on desktop */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-1/2 left-8 right-8 -translate-y-1/2 h-[2px] bg-gradient-to-r from-gold-300/30 via-gold-400/50 to-gold-300/30 pointer-events-none z-0"
          />

          {/* Connected 5-stage navigation pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 relative z-10">
            {stages.map((stage, idx) => {
              const IconComp = stage.icon;
              const isActive = activeStage === idx;
              return (
                <button
                  key={stage.step}
                  type="button"
                  role="tab"
                  id={`stage-tab-${stage.step}`}
                  aria-selected={isActive}
                  aria-controls={`stage-panel-${stage.step}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveStage(idx)}
                  className={`group relative text-left p-3 sm:p-3.5 rounded-xl transition-all duration-300 border flex flex-col justify-between ${
                    isActive
                      ? 'bg-white border-gold-400 shadow-md shadow-gold-900/10 ring-2 ring-gold-400/30 -translate-y-0.5'
                      : 'bg-white/70 hover:bg-white border-gold-200/60 hover:border-gold-300/80 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded transition-colors ${
                        isActive
                          ? 'bg-gold-500 text-white'
                          : 'bg-gold-100/80 text-[#855e05] group-hover:bg-gold-200/80'
                      }`}
                    >
                      {stage.step}
                    </span>
                    <IconComp
                      className={`w-3.5 h-3.5 transition-colors ${
                        isActive ? 'text-gold-600' : 'text-[#64748b] group-hover:text-gold-600'
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-semibold tracking-tight truncate transition-colors ${
                        isActive ? 'text-[#1a2f4a]' : 'text-[#475569] group-hover:text-[#1a2f4a]'
                      }`}
                    >
                      {stage.stageName}
                    </p>
                    <p className="text-[10px] text-[#64748b] truncate mt-0.5 font-light">
                      {stage.headline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. FEATURED ACTIVE STAGE HERO THEATER                    */}
        {/* ======================================================== */}
        <div
          role="tabpanel"
          id={`stage-panel-${current.step}`}
          aria-labelledby={`stage-tab-${current.step}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="rounded-3xl bg-gradient-to-br from-white via-[#FAF8F4] to-white border border-gold-200/90 shadow-xl shadow-brown-900/5 p-6 sm:p-8 lg:p-10 relative overflow-hidden transition-all duration-300"
        >
          {/* Subtle Ambient Gold Gradient Accent */}
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 w-80 h-80 bg-gold-200/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Narrative Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
              {/* Stage Counter & Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-xs font-bold tracking-wider text-[#855e05] uppercase px-2.5 py-1 rounded bg-gold-100/90 border border-gold-300/60">
                  Stage {current.step} — {current.stageName}
                </span>
              </div>

              {/* Verified Headline */}
              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a2f4a] tracking-tight mb-4 leading-tight">
                {current.headline}
              </h3>

              {/* Verified Supporting Text */}
              <p className="text-base sm:text-lg text-[#334155] leading-relaxed mb-8 font-normal">
                {current.supportingText}
              </p>

              {/* Interactive Stage Controls & Next Breadcrumb */}
              <div className="pt-6 border-t border-gold-200/60 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveStage((prev) => (prev - 1 + stages.length) % stages.length)}
                    aria-label="View previous stage"
                    className="w-10 h-10 rounded-xl bg-white hover:bg-gold-50 border border-gold-200/80 hover:border-gold-300 text-[#1a2f4a] flex items-center justify-center transition-all shadow-2xs active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStage((prev) => (prev + 1) % stages.length)}
                    aria-label="View next stage"
                    className="w-10 h-10 rounded-xl bg-white hover:bg-gold-50 border border-gold-200/80 hover:border-gold-300 text-[#1a2f4a] flex items-center justify-center transition-all shadow-2xs active:scale-95"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-[#64748b] ml-1">
                    {activeStage + 1} of {stages.length}
                  </span>
                </div>

                {/* Direct quick step progression prompt */}
                {activeStage < stages.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setActiveStage((prev) => prev + 1)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#855e05] hover:text-[#5a3f03] transition-colors group"
                  >
                    <span>Next: {stages[activeStage + 1].stageName}</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveStage(0)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#855e05] hover:text-[#5a3f03] transition-colors group"
                  >
                    <span>Restart Journey</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Visual Canvas Column (7 cols) */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-brown-900/10 border border-gold-200/80 bg-[#080e18] group">
                <Image
                  src={current.imageSrc}
                  alt={current.alt}
                  width={1280}
                  height={720}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="!h-auto !w-full object-cover aspect-[16/9] transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
