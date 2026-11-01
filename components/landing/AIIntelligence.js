import { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function AIIntelligence() {
  // activeStage: null means "All Stages Active" (full narrative visible), or 0..3 for focused spotlight
  const [activeStage, setActiveStage] = useState(null);

  const stages = [
    {
      id: 'recording',
      step: '01',
      title: 'Recording',
      question: 'What happened',
      summary: 'Raw transactions and bullion receipts recorded as isolated ledger entries.',
    },
    {
      id: 'understanding',
      step: '02',
      title: 'Understanding',
      question: 'Why it happened & what needs attention',
      summary: 'Connecting metal inwards, craftsmanship, and sales to isolate margin leakage.',
    },
    {
      id: 'anticipating',
      step: '03',
      title: 'Anticipating',
      question: 'What could happen next',
      summary: 'Projecting seasonal velocity and early warning indicators on slow-moving bridal inventory.',
    },
    {
      id: 'acting',
      step: '04',
      title: 'Acting',
      question: 'What to consider doing',
      summary: 'Resolving insights into decisive executive actions ready for one-click execution in Octis ERP.',
    },
  ];

  return (
    <section id="intelligence" className="py-20 md:py-28 landing-surface relative scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ======================================================== */}
        {/* SECTION HEADER                                           */}
        {/* ======================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <p className="landing-section-label mb-3">Jewellery Intelligence</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1a2f4a] mb-4">
            From Jewellery Software to Jewellery Intelligence
          </h2>
        </div>

        {/* ======================================================== */}
        {/* CONCISE EDITORIAL PREMISE: TRADITIONAL VS OCTIS          */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 max-w-4xl mx-auto mb-10 sm:mb-14 pb-8 border-b border-gold-200/60">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#64748b] block mb-1.5">
              Traditional Software
            </span>
            <p className="font-display text-xl sm:text-2xl font-bold text-[#475569] leading-snug">
              Tells you what happened.
            </p>
            <p className="text-xs sm:text-sm text-[#64748b] mt-1.5 leading-relaxed">
              Logs sales, bills, and bullion weights as passive historical entries.
            </p>
          </div>

          <div className="md:border-l md:border-gold-200/80 md:pl-8">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#855e05] block mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Octis Jewellery Intelligence</span>
            </span>
            <p className="font-display text-xl sm:text-2xl font-bold text-[#1a2f4a] leading-snug">
              Helps you understand what happened, why it happened, what needs attention, what could happen next, and what to consider doing.
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* LIGHTWEIGHT STAGE FOCUS SELECTOR                         */}
        {/* ======================================================== */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-10">
          <div
            role="tablist"
            aria-label="Intelligence transformation phases"
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
          >
            <button
              role="tab"
              aria-selected={activeStage === null}
              onClick={() => setActiveStage(null)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${
                activeStage === null
                  ? 'bg-[#1a2f4a] text-white shadow-md ring-2 ring-gold-400/40'
                  : 'bg-white border border-gold-200/80 text-[#64748b] hover:text-[#1a2f4a] hover:border-gold-300'
              }`}
            >
              Full Transformation Flow
            </button>

            {stages.map((stg, idx) => {
              const isSelected = activeStage === idx;
              return (
                <button
                  key={stg.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveStage(isSelected ? null : idx)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${
                    isSelected
                      ? 'bg-[#855e05] text-white shadow-md ring-2 ring-gold-400/40'
                      : 'bg-white border border-gold-200/80 text-[#64748b] hover:text-[#1a2f4a] hover:border-gold-300'
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-80">{stg.step}</span>
                  <span>{stg.title}</span>
                </button>
              );
            })}
          </div>

          {/* Clean single-line stage descriptor callout */}
          <div className="h-6 mt-3 text-center">
            <p className="text-xs sm:text-sm text-[#855e05] font-medium transition-all duration-200">
              {activeStage !== null
                ? `${stages[activeStage].step}. ${stages[activeStage].title}: ${stages[activeStage].summary}`
                : 'A single, continuous visual journey from raw transactions into decisive executive actions.'}
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 1. DESKTOP/TABLET CONTINUOUS INTELLIGENCE GRAPH           */}
        {/* ======================================================== */}
        <div className="hidden md:block max-w-7xl mx-auto rounded-3xl bg-white border border-gold-200/80 p-5 sm:p-7 lg:p-8 shadow-xl shadow-gold-900/5 relative">
          <svg
            viewBox="0 0 1200 480"
            className="w-full h-auto overflow-visible select-none"
            aria-label="Octis Jewellery Intelligence Transformation flow from Recording to Understanding, Anticipating, and Acting"
          >
            <defs>
              {/* Subtle focal glow filter */}
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Vertical Stage Divider Guidelines */}
            <line x1="300" y1="35" x2="300" y2="445" stroke="#e8dfd1" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="600" y1="35" x2="600" y2="445" stroke="#e8dfd1" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="900" y1="35" x2="900" y2="445" stroke="#e8dfd1" strokeWidth="1" strokeDasharray="4 4" />

            {/* ==================================================== */}
            {/* STAGE 01: RECORDING (X: 40 - 300)                    */}
            {/* ==================================================== */}
            <g
              className="transition-opacity duration-300 ease-in-out cursor-pointer"
              style={{ opacity: activeStage === null || activeStage === 0 ? 1 : 0.22 }}
              onClick={() => setActiveStage(activeStage === 0 ? null : 0)}
            >
              {/* Header */}
              <text x="50" y="48" fontFamily="'Playfair Display', Georgia, serif" fontSize="16" fontWeight="bold" fill="#1a2f4a">
                01 • RECORDING
              </text>
              <text x="50" y="68" fontFamily="system-ui, sans-serif" fontSize="12" fill="#64748b">
                What happened
              </text>
              {activeStage === 0 && (
                <rect x="50" y="76" width="105" height="2" fill="#855e05" rx="1" />
              )}

              {/* Signal A: Bullion Inward (Text positioned cleanly ABOVE starting point) */}
              <text x="60" y="125" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="700" fill="#1a2f4a">
                Bullion Inward
              </text>
              <text x="60" y="142" fontFamily="system-ui, sans-serif" fontSize="11" fill="#64748b">
                1,000g Fine Gold @ ₹6,120/g
              </text>
              <circle cx="60" cy="160" r="5" fill="#1a2f4a" />
              <path
                d="M 60 160 C 130 160, 160 250, 220 250"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Signal B: Counter Sale (Text positioned cleanly BELOW starting point) */}
              <circle cx="60" cy="340" r="5" fill="#1a2f4a" />
              <text x="60" y="372" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="700" fill="#1a2f4a">
                Counter Sale
              </text>
              <text x="60" y="388" fontFamily="system-ui, sans-serif" fontSize="11" fill="#64748b">
                240g 22K Bangle (Billed)
              </text>
              <path
                d="M 60 340 C 130 340, 160 250, 220 250"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Merged Entry Node (Shared baseline origin) */}
              <text x="220" y="215" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="700" fill="#475569">
                Ledger Entry
              </text>
              <text x="220" y="230" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="10.5" fill="#94a3b8">
                Isolated Record
              </text>
              <circle cx="220" cy="250" r="8" fill="#f1f5f9" stroke="#64748b" strokeWidth="2.5" />
              <circle cx="220" cy="250" r="3.5" fill="#1a2f4a" />

              {/* Traditional Ceiling Tag */}
              <text
                x="288"
                y="435"
                fontFamily="system-ui, sans-serif"
                fontSize="10"
                fontWeight="700"
                fill="#94a3b8"
                textAnchor="end"
                letterSpacing="0.05em"
              >
                TRADITIONAL SOFTWARE CEILING
              </text>
            </g>

            {/* Continuous Spine: Stage 1 into Stage 2 (DIMS when not in Stage 0 or 1) */}
            <path
              d="M 220 250 L 320 250"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2.5"
              className="transition-opacity duration-300"
              style={{ opacity: activeStage === null || activeStage === 0 || activeStage === 1 ? 1 : 0.22 }}
            />

            {/* ==================================================== */}
            {/* STAGE 02: UNDERSTANDING (X: 300 - 600)               */}
            {/* ==================================================== */}
            <g
              className="transition-opacity duration-300 ease-in-out cursor-pointer"
              style={{ opacity: activeStage === null || activeStage === 1 ? 1 : 0.22 }}
              onClick={() => setActiveStage(activeStage === 1 ? null : 1)}
            >
              {/* Header */}
              <text x="320" y="48" fontFamily="'Playfair Display', Georgia, serif" fontSize="16" fontWeight="bold" fill="#1a2f4a">
                02 • UNDERSTANDING
              </text>
              <text x="320" y="68" fontFamily="system-ui, sans-serif" fontSize="12" fill="#855e05">
                Why it happened & what needs attention
              </text>
              {activeStage === 1 && (
                <rect x="320" y="76" width="135" height="2" fill="#855e05" rx="1" />
              )}

              {/* Analytical Branch: Wastage Variance Detection */}
              <path
                d="M 320 250 C 355 250, 375 145, 415 145"
                fill="none"
                stroke="#e11d48"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <circle
                cx="415"
                cy="145"
                r="6.5"
                fill="#e11d48"
                filter="url(#softGlow)"
              />
              <circle cx="415" cy="145" r="2.5" fill="#ffffff" />

              {/* Wastage Callout Box (Positioned safely ABOVE node with vertical connector) */}
              <line x1="415" y1="126" x2="415" y2="145" stroke="#e11d48" strokeWidth="1.2" strokeDasharray="2 2" />
              <g transform="translate(340, 82)">
                <rect
                  x="0"
                  y="0"
                  width="150"
                  height="44"
                  rx="8"
                  fill="#fff1f2"
                  stroke="#fecdd3"
                  strokeWidth="1"
                />
                <text x="10" y="18" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" fill="#be123c">
                  Wastage Variance +1.8%
                </text>
                <text x="10" y="33" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="600" fill="#e11d48">
                  Margin Leakage: -₹38,400
                </text>
              </g>

              {/* Loop rejoining margin calculation */}
              <path
                d="M 415 145 C 475 145, 495 250, 520 250"
                fill="none"
                stroke="#e11d48"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Central Direct Baseline */}
              <path
                d="M 320 250 L 520 250"
                fill="none"
                stroke="#c5a880"
                strokeWidth="2.5"
              />

              {/* Realized Margin Node on Baseline */}
              <circle
                cx="520"
                cy="250"
                r="8"
                fill="#fef3c7"
                stroke="#b8860b"
                strokeWidth="2.5"
              />
              <circle cx="520" cy="250" r="3.5" fill="#b8860b" />

              {/* Realized Margin Callout (Safely positioned below baseline at Y=290) */}
              <line x1="520" y1="258" x2="520" y2="290" stroke="#b8860b" strokeWidth="1.2" strokeDasharray="3 3" />
              <g transform="translate(445, 290)">
                <rect
                  x="0"
                  y="0"
                  width="150"
                  height="44"
                  rx="7"
                  fill="#fefce8"
                  stroke="#fde047"
                  strokeWidth="1"
                />
                <text x="75" y="18" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="700" fill="#855e05">
                  Realized Margin: 3.4%
                </text>
                <text x="75" y="33" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="9.5" fill="#a16207">
                  Target 5.5% • Leakage Found
                </text>
              </g>
            </g>

            {/* ========================================================================= */}
            {/* CONTINUOUS SPINE: STAGE 2 INTO STAGE 3 (CIRCLED BY USER!)                */}
            {/* PROPERLY TIED TO STAGE OPACITY: DIMS WHEN NOT IN STAGE 1 OR 2           */}
            {/* ========================================================================= */}
            <path
              d="M 520 250 L 625 250"
              fill="none"
              stroke="#b8860b"
              strokeWidth="2.5"
              className="transition-opacity duration-300"
              style={{ opacity: activeStage === null || activeStage === 1 || activeStage === 2 ? 1 : 0.22 }}
            />

            {/* ==================================================== */}
            {/* STAGE 03: ANTICIPATING (X: 600 - 900)                */}
            {/* ==================================================== */}
            <g
              className="transition-opacity duration-300 ease-in-out cursor-pointer"
              style={{ opacity: activeStage === null || activeStage === 2 ? 1 : 0.22 }}
              onClick={() => setActiveStage(activeStage === 2 ? null : 2)}
            >
              {/* Header */}
              <text x="620" y="48" fontFamily="'Playfair Display', Georgia, serif" fontSize="16" fontWeight="bold" fill="#1a2f4a">
                03 • ANTICIPATING
              </text>
              <text x="620" y="68" fontFamily="system-ui, sans-serif" fontSize="12" fill="#855e05">
                What could happen next
              </text>
              {activeStage === 2 && (
                <rect x="620" y="76" width="130" height="2" fill="#855e05" rx="1" />
              )}

              {/* Established "TODAY" Transition Node (Origin of forecasts) */}
              <text x="625" y="218" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="700" fill="#1a2f4a" letterSpacing="0.05em">
                TODAY
              </text>
              <text x="625" y="233" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="9.5" fill="#64748b">
                Historical → Forecast
              </text>
              <circle cx="625" cy="250" r="6" fill="#1a2f4a" />
              <line x1="625" y1="240" x2="625" y2="260" stroke="#94a3b8" strokeWidth="2" />

              {/* Curve 1: Positive Festive Demand Surge (Dashed forecast) */}
              <path
                d="M 625 250 C 685 250, 725 155, 765 155"
                fill="none"
                stroke="#059669"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                strokeLinecap="round"
              />
              <circle
                cx="765"
                cy="155"
                r="7"
                fill="#059669"
                filter="url(#softGlow)"
              />
              <circle cx="765" cy="155" r="2.5" fill="#ffffff" />
              {/* Demand Surge Label placed STRICTLY ABOVE node (never touches outgoing line) */}
              <text x="765" y="118" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="700" fill="#047857">
                Demand Surge: +32%
              </text>
              <text x="765" y="134" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="10.5" fill="#059669">
                Festive 18K Lightweight Wear
              </text>

              {/* Curve 2: Downward Idle Capital Drag (Dashed forecast) */}
              <path
                d="M 625 250 C 685 250, 725 345, 765 345"
                fill="none"
                stroke="#d97706"
                strokeWidth="2.2"
                strokeDasharray="5 4"
                strokeLinecap="round"
              />
              <circle
                cx="765"
                cy="345"
                r="6.5"
                fill="#d97706"
              />
              <circle cx="765" cy="345" r="2" fill="#ffffff" />
              {/* Capital Drag Label placed STRICTLY BELOW node (never touches outgoing line) */}
              <text x="765" y="380" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="700" fill="#b45309">
                Capital Drag: 85+ Days
              </text>
              <text x="765" y="398" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="10.5" fill="#92400e">
                1.8kg Slow-Moving Bridal Stock
              </text>
            </g>

            {/* Stage 3 Forecast Curves Visibly Converging into Stage 4 Action Focal Node (DIMS appropriately) */}
            <path
              d="M 765 155 C 825 155, 870 250, 920 250"
              fill="none"
              stroke="#059669"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="transition-opacity duration-300"
              style={{ opacity: activeStage === null || activeStage === 2 || activeStage === 3 ? 1 : 0.22 }}
            />
            <path
              d="M 765 345 C 825 345, 870 250, 920 250"
              fill="none"
              stroke="#d97706"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="transition-opacity duration-300"
              style={{ opacity: activeStage === null || activeStage === 2 || activeStage === 3 ? 1 : 0.22 }}
            />

            {/* ==================================================== */}
            {/* STAGE 04: ACTING (X: 900 - 1200)                     */}
            {/* ==================================================== */}
            <g
              className="transition-opacity duration-300 ease-in-out cursor-pointer"
              style={{ opacity: activeStage === null || activeStage === 3 ? 1 : 0.22 }}
              onClick={() => setActiveStage(activeStage === 3 ? null : 3)}
            >
              {/* Header */}
              <text x="920" y="48" fontFamily="'Playfair Display', Georgia, serif" fontSize="16" fontWeight="bold" fill="#1a2f4a">
                04 • ACTING
              </text>
              <text x="920" y="68" fontFamily="system-ui, sans-serif" fontSize="12" fill="#166534">
                What to consider doing
              </text>
              {activeStage === 3 && (
                <rect x="920" y="76" width="115" height="2" fill="#166534" rx="1" />
              )}

              {/* Single Focal Decision Node with Clear Breathing Room */}
              <circle cx="920" cy="250" r="22" fill="none" stroke="#c5a880" strokeWidth="1.5" opacity="0.5" />
              <circle
                cx="920"
                cy="250"
                r="14"
                fill="#1a2f4a"
                filter="url(#softGlow)"
              />
              <circle cx="920" cy="250" r="5" fill="#f5e6c8" />

              {/* 1-Click Execution Label in Solid Badge (No line interference) */}
              <g transform="translate(850, 285)">
                <rect x="0" y="0" width="140" height="34" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                <text x="70" y="15" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="700" fill="#1a2f4a">
                  1-Click ERP Execution
                </text>
                <text x="70" y="27" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="9" fill="#64748b">
                  Verified &amp; Ready
                </text>
              </g>

              {/* Connectors Branching Right to Action Callouts */}
              <path d="M 942 250 L 975 250" stroke="#1a2f4a" strokeWidth="2" />
              <path d="M 975 250 C 990 250, 990 150, 1010 150" fill="none" stroke="#15803d" strokeWidth="1.8" />
              <path d="M 975 250 C 990 250, 990 350, 1010 350" fill="none" stroke="#b45309" strokeWidth="1.8" />

              {/* Action Outcome 1: Rebalance Metal (Spacious Top Placement) */}
              <g transform="translate(1010, 125)">
                <rect
                  x="0"
                  y="0"
                  width="165"
                  height="50"
                  rx="8"
                  fill="#f0fdf4"
                  stroke="#bbf7d0"
                  strokeWidth="1.2"
                />
                <text x="12" y="20" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" fill="#166534">
                  1. Reallocate 450g Casting
                </text>
                <text x="12" y="36" fontFamily="system-ui, sans-serif" fontSize="10" fill="#15803d">
                  Shift to 18K • +₹1.85L liquidity
                </text>
              </g>

              {/* Action Outcome 2: Recover Wastage (Spacious Bottom Placement - 150px below Action 1) */}
              <g transform="translate(1010, 325)">
                <rect
                  x="0"
                  y="0"
                  width="165"
                  height="50"
                  rx="8"
                  fill="#fffbeb"
                  stroke="#fde68a"
                  strokeWidth="1.2"
                />
                <text x="12" y="20" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" fill="#92400e">
                  2. Recover ₹38,400 Wastage
                </text>
                <text x="12" y="36" fontFamily="system-ui, sans-serif" fontSize="10" fill="#b45309">
                  Auto-offset on Karigar B ledger
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* ======================================================== */}
        {/* 2. MOBILE STREAM NARRATIVE (TOP-TO-BOTTOM CONNECTED GRAPH) */}
        {/* ======================================================== */}
        <div className="block md:hidden max-w-md mx-auto rounded-3xl bg-white border border-gold-200/80 p-5 shadow-lg relative">
          <svg
            viewBox="0 0 360 760"
            className="w-full h-auto overflow-visible select-none"
            aria-label="Octis Jewellery Intelligence Transformation vertical flow for mobile"
          >
            <defs>
              <linearGradient id="streamVertical" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="25%" stopColor="#c5a880" />
                <stop offset="60%" stopColor="#b8860b" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            {/* Central Vertical Intelligence Spine */}
            <path
              d="M 180 50 L 180 610"
              fill="none"
              stroke="url(#streamVertical)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* ==================================================== */}
            {/* MOBILE STAGE 01: RECORDING                           */}
            {/* ==================================================== */}
            <g
              className="transition-opacity duration-300"
              style={{ opacity: activeStage === null || activeStage === 0 ? 1 : 0.22 }}
            >
              <text x="180" y="28" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontSize="14" fontWeight="bold" fill="#1a2f4a">
                01 • RECORDING (What happened)
              </text>

              {/* Signal Left: Bullion Inward */}
              <circle cx="55" cy="65" r="4.5" fill="#64748b" />
              <text x="55" y="82" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="600" fill="#1a2f4a">
                Bullion Inward
              </text>
              <text x="55" y="96" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="9" fill="#64748b">
                1,000g @ ₹6,120/g
              </text>
              <path d="M 55 102 C 55 125, 155 130, 180 130" fill="none" stroke="#94a3b8" strokeWidth="1.8" />

              {/* Signal Right: Counter Sale */}
              <circle cx="305" cy="65" r="4.5" fill="#64748b" />
              <text x="305" y="82" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="600" fill="#1a2f4a">
                Counter Sale
              </text>
              <text x="305" y="96" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="9" fill="#64748b">
                240g 22K Bangle
              </text>
              <path d="M 305 102 C 305 125, 205 130, 180 130" fill="none" stroke="#94a3b8" strokeWidth="1.8" />

              {/* Merger Node */}
              <circle cx="180" cy="130" r="7" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.8" />
              <circle cx="180" cy="130" r="3" fill="#1a2f4a" />
              <text x="180" y="152" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="10" fill="#64748b">
                Isolated Ledger Entry
              </text>

              {/* Ceiling Divider */}
              <line x1="30" y1="168" x2="330" y2="168" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
              <text x="180" y="182" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="9" fontWeight="700" fill="#94a3b8">
                TRADITIONAL SOFTWARE CEILING
              </text>
            </g>

            {/* ==================================================== */}
            {/* MOBILE STAGE 02: UNDERSTANDING                       */}
            {/* ==================================================== */}
            <g
              className="transition-opacity duration-300"
              style={{ opacity: activeStage === null || activeStage === 1 ? 1 : 0.22 }}
            >
              <text x="180" y="212" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontSize="14" fontWeight="bold" fill="#1a2f4a">
                02 • UNDERSTANDING (Why it happened)
              </text>

              {/* Leakage Anomaly (Left Branch) */}
              <path d="M 180 218 C 110 218, 75 238, 75 252" fill="none" stroke="#e11d48" strokeWidth="1.8" />
              <circle cx="75" cy="252" r="5" fill="#e11d48" />
              <rect x="15" y="262" width="135" height="36" rx="6" fill="#fff1f2" stroke="#fecdd3" strokeWidth="1" />
              <text x="82" y="277" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="bold" fill="#be123c">
                Wastage Leakage
              </text>
              <text x="82" y="291" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="9" fill="#e11d48">
                +1.8% (-₹38,400)
              </text>

              {/* Margin Insight (Right Branch) */}
              <path d="M 180 218 C 250 218, 285 238, 285 252" fill="none" stroke="#c5a880" strokeWidth="1.8" />
              <circle cx="285" cy="252" r="5" fill="#b8860b" />
              <rect x="210" y="262" width="135" height="36" rx="6" fill="#fefce8" stroke="#fef08a" strokeWidth="1" />
              <text x="277" y="277" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="bold" fill="#855e05">
                Realized Margin
              </text>
              <text x="277" y="291" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="9" fill="#a16207">
                3.4% (Target: 5.5%)
              </text>

              {/* Loop Reconnect */}
              <path d="M 75 298 C 75 328, 170 328, 180 328" fill="none" stroke="#e11d48" strokeWidth="1.2" strokeDasharray="3 3" />
              <path d="M 285 298 C 285 328, 190 328, 180 328" fill="none" stroke="#c5a880" strokeWidth="1.2" />
            </g>

            {/* ==================================================== */}
            {/* MOBILE STAGE 03: ANTICIPATING                        */}
            {/* ==================================================== */}
            <g
              className="transition-opacity duration-300"
              style={{ opacity: activeStage === null || activeStage === 2 ? 1 : 0.22 }}
            >
              <text x="180" y="365" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontSize="14" fontWeight="bold" fill="#1a2f4a">
                03 • ANTICIPATING (What could happen next)
              </text>

              {/* Shared "Today" Origin */}
              <circle cx="180" cy="385" r="5" fill="#1a2f4a" />
              <text x="180" y="402" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="9" fontWeight="bold" fill="#64748b">
                TODAY (Projection)
              </text>

              {/* Upward Surge (Right Branch) */}
              <path d="M 180 385 C 240 385, 280 420, 280 435" fill="none" stroke="#059669" strokeWidth="2" strokeDasharray="4 3" />
              <circle cx="280" cy="435" r="5" fill="#059669" />
              <text x="280" y="452" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="bold" fill="#047857">
                +32% Demand Surge
              </text>
              <text x="280" y="465" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="9" fill="#059669">
                18K Lightweight Wear
              </text>

              {/* Downward Risk (Left Branch) */}
              <path d="M 180 385 C 120 385, 80 420, 80 435" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="4 3" />
              <circle cx="80" cy="435" r="5" fill="#d97706" />
              <text x="80" y="452" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="bold" fill="#b45309">
                85+ Days Capital Lock
              </text>
              <text x="80" y="465" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="9" fill="#92400e">
                Slow Bridal Inventory
              </text>

              {/* Both Forecasts Converging into Action Beacon */}
              <path d="M 280 475 C 280 505, 190 515, 180 515" fill="none" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 80 475 C 80 505, 170 515, 180 515" fill="none" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3 3" />
            </g>

            {/* ==================================================== */}
            {/* MOBILE STAGE 04: ACTING                              */}
            {/* ==================================================== */}
            <g
              className="transition-opacity duration-300"
              style={{ opacity: activeStage === null || activeStage === 3 ? 1 : 0.22 }}
            >
              <text x="180" y="550" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontSize="14" fontWeight="bold" fill="#1a2f4a">
                04 • ACTING (What to consider doing)
              </text>

              {/* Focal Decision Beacon */}
              <circle cx="180" cy="580" r="15" fill="none" stroke="#c5a880" strokeWidth="1.5" opacity="0.6" />
              <circle cx="180" cy="580" r="10" fill="#1a2f4a" />
              <circle cx="180" cy="580" r="4" fill="#f5e6c8" />

              {/* Action 1 */}
              <rect x="25" y="612" width="310" height="38" rx="7" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.2" />
              <text x="37" y="628" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="bold" fill="#166534">
                1. Reallocate 450g Casting → 18K Line
              </text>
              <text x="37" y="642" fontFamily="system-ui, sans-serif" fontSize="9.5" fill="#15803d">
                Captures festive surge &amp; frees ₹1.85L liquidity
              </text>

              {/* Action 2 */}
              <rect x="25" y="658" width="310" height="38" rx="7" fill="#fffbeb" stroke="#fde68a" strokeWidth="1.2" />
              <text x="37" y="674" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="bold" fill="#92400e">
                2. Recover ₹38,400 Karigar Wastage
              </text>
              <text x="37" y="688" fontFamily="system-ui, sans-serif" fontSize="9.5" fill="#b45309">
                Auto-offset on Karigar B ledger at settlement
              </text>

              <text x="180" y="722" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="700" fill="#1a2f4a">
                Ready for 1-Click Execution in Octis ERP
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}



