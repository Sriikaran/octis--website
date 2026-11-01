import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Layers,
  Scale,
  CircleDollarSign,
  TrendingUp,
  ShoppingBag,
  Coins,
  Hammer,
  ShieldCheck,
  Receipt,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

export default function WhatMakesOctisDifferent() {
  // Interactive Before/After slider state for the flagship feature (0 to 100%)
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="mb-24 sm:mb-32">
      {/* ======================================================== */}
      {/* SECTION HEADER & EXACT APPROVED COPY                     */}
      {/* ======================================================== */}
      <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-[#1a2f4a]">
          What Makes Octis Truly Different
        </h2>
        <p className="text-base sm:text-lg text-[#334155] max-w-2xl mx-auto leading-relaxed">
          Moving beyond generic showroom software with end-to-end traceability, vendor visibility, article profitability, and unified accounting.
        </p>
      </div>

      {/* ======================================================== */}
      {/* FLAGSHIP FEATURE: AI CATALOGUE IMAGE GENERATION (45%)    */}
      {/* ======================================================== */}
      <div className="mb-12 sm:mb-16">
        <div className="relative rounded-3xl bg-gradient-to-b from-[#FAF8F4] to-white border border-gold-200/80 shadow-xl shadow-brown-900/5 p-6 sm:p-8 lg:p-10 overflow-hidden">
          {/* Subtle Ambient Gold Gradient Accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-200/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Copy Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100/90 border border-gold-300/60 text-[#855e05] text-xs font-semibold uppercase tracking-wider w-fit mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enterprise Tier</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a2f4a] tracking-tight mb-4">
                AI Catalogue Image Generation
              </h3>

              <p className="text-base sm:text-lg text-[#334155] leading-relaxed mb-6 font-normal">
                Create professional, catalogue-ready jewellery imagery with AI-powered image generation.
              </p>

              <div className="p-4 rounded-xl bg-gold-50/60 border border-gold-200/70 text-xs sm:text-sm text-[#1a2f4a] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-gold-300/60 flex items-center justify-center text-primary flex-shrink-0 shadow-2xs">
                  <Sparkles className="w-4 h-4 text-gold-600" />
                </div>
                <span>
                  Turns raw showroom photographs into editorial studio catalogue imagery in seconds while preserving 100% metal and gemstone craftsmanship.
                </span>
              </div>
            </div>

            {/* Interactive Before/After Studio Showcase (7 cols) */}
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gold-200/90 bg-[#FAF8F4] select-none">
                {/* Visual Canvas Container */}
                <div
                  ref={containerRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className="relative w-full aspect-[4/3] cursor-ew-resize overflow-hidden"
                >
                  {/* Base Image: Enhanced Catalogue Presentation (Visible on Right) */}
                  <Image
                    src="/landing/catalogue-studio-enhanced.jpg"
                    alt="Polished luxury jewellery catalogue studio presentation generated by Octis AI"
                    fill
                    priority
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover pointer-events-none"
                  />

                  {/* Overlaid Image: Raw Showroom Capture (Clipped to Slider Position on Left) */}
                  <div
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    style={{ width: `${sliderPos}%` }}
                  >
                    <Image
                      src="/landing/catalogue-studio-raw.jpg"
                      alt="Raw unedited showroom photograph of gold necklace before AI enhancement"
                      width={1600}
                      height={1200}
                      className="absolute left-0 top-0 !max-w-none object-cover"
                      style={{
                        width: containerRef.current
                          ? `${containerRef.current.clientWidth}px`
                          : '100%',
                        height: '100%',
                        maxWidth: 'none',
                      }}
                    />
                  </div>

                  {/* Slider Divider Line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
                    style={{ left: `${sliderPos}%` }}
                  >
                    {/* Center Handle Button */}
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/95 border-2 border-gold-500 shadow-xl flex items-center justify-center text-[#1a2f4a] backdrop-blur-xs">
                      <ChevronLeft className="w-3.5 h-3.5 -mr-0.5 text-gold-700" />
                      <ChevronRight className="w-3.5 h-3.5 -ml-0.5 text-gold-700" />
                    </div>
                  </div>

                  {/* Labels on Visual */}
                  <div className="absolute top-3.5 left-3.5 pointer-events-none">
                    <span className="px-3 py-1 rounded-md bg-black/60 text-white text-xs font-medium tracking-wide backdrop-blur-xs shadow-xs">
                      Raw Showroom Photo
                    </span>
                  </div>

                  <div className="absolute top-3.5 right-3.5 pointer-events-none">
                    <span className="px-3 py-1 rounded-md bg-[#1a2f4a]/90 text-gold-200 text-xs font-semibold tracking-wide backdrop-blur-xs shadow-xs border border-gold-400/30">
                      AI Studio Catalogue
                    </span>
                  </div>

                  {/* Bottom Drag Instruction */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-white/85 text-[#1a2f4a] text-[11px] font-medium tracking-wider uppercase backdrop-blur-xs shadow-xs">
                      Drag to compare
                    </span>
                  </div>
                </div>

                {/* Accessible Range Input for Keyboard / Screen Readers */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  aria-label="Before and after jewellery AI catalogue image enhancement slider"
                  className="sr-only"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SIX SUPPORTING FEATURES: VISUALLY VARIED ASYMMETRIC GRID */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* ------------------------------------------------------ */}
        {/* SUPPORTING FEATURE 1: AI DIGITAL COMMERCE (FIRST)      */}
        {/* ------------------------------------------------------ */}
        <div className="lg:col-span-7 rounded-2xl bg-white border border-gold-200/80 p-6 sm:p-8 flex flex-col justify-between shadow-md hover:border-gold-400/80 transition-all duration-300">
          <div className="mb-6">
            <h4 className="font-display text-xl sm:text-2xl font-bold text-[#1a2f4a] mb-2 tracking-tight">
              AI Digital Commerce
            </h4>
            <p className="text-sm sm:text-base text-[#334155] leading-relaxed">
              Turn ERP inventory into a customer-facing catalogue and website with AI-assisted imagery.
            </p>
          </div>

          {/* Visual: Editorial Catalogue Showcase Image */}
          <div className="relative rounded-xl overflow-hidden border border-gold-200/70 bg-[#FAF8F4] shadow-xs group">
            <Image
              src="/landing/feature-digital-commerce.jpg"
              alt="Editorial jewellery digital catalogue showcase powered by Octis ERP"
              width={1280}
              height={960}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="!h-auto !w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
            />
          </div>
        </div>

        {/* ------------------------------------------------------ */}
        {/* SUPPORTING FEATURE 2: COMPLETE TRACEABILITY            */}
        {/* ------------------------------------------------------ */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-gold-200/80 p-6 sm:p-8 flex flex-col justify-between shadow-md hover:border-gold-400/80 transition-all duration-300">
          <div className="mb-6">
            <h4 className="font-display text-xl sm:text-2xl font-bold text-[#1a2f4a] mb-2 tracking-tight">
              Complete Traceability
            </h4>
            <p className="text-sm sm:text-base text-[#334155] leading-relaxed">
              Track every article and every gram from purchase through production, stock, and sale.
            </p>
          </div>

          {/* Visual: Stepped Connected Lifecycle Illustration (Fills Vertical Space) */}
          <div className="rounded-xl bg-[#FAF8F4] border border-gold-200/70 p-5 flex flex-col justify-between flex-1">
            <div className="text-[11px] font-bold text-[#855e05] uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Article Lifecycle Journey</span>
              <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                100% Gram Fidelity
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-gold-400 before:via-gold-300 before:to-emerald-500">
              {[
                {
                  stage: 'Purchase',
                  desc: 'Raw gold bullion & metal inward',
                  icon: Coins,
                  color: 'text-gold-700 bg-gold-100 border-gold-300',
                },
                {
                  stage: 'Production / Karigar',
                  desc: 'Artisan crafting, wastage & stone issue',
                  icon: Hammer,
                  color: 'text-amber-700 bg-amber-100 border-amber-300',
                },
                {
                  stage: 'Stock',
                  desc: 'Vault inventory with HUID hallmark tag',
                  icon: ShieldCheck,
                  color: 'text-blue-700 bg-blue-100 border-blue-300',
                },
                {
                  stage: 'Sale',
                  desc: 'Showroom point-of-sale customer invoice',
                  icon: Receipt,
                  color: 'text-emerald-700 bg-emerald-100 border-emerald-300',
                },
              ].map((step, idx) => {
                const IconComponent = step.icon;
                return (
                  <div key={idx} className="relative flex items-center gap-3.5">
                    {/* Node Dot */}
                    <div
                      className={`absolute -left-6 -translate-x-1/2 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center ${step.color} shadow-xs z-10`}
                    >
                      <IconComponent className="w-3 h-3" strokeWidth={2.5} />
                    </div>

                    <div className="flex-1 bg-white p-2.5 rounded-lg border border-gold-200/60 shadow-2xs">
                      <p className="text-xs font-bold text-[#1a2f4a] leading-tight">{step.stage}</p>
                      <p className="text-[11px] text-[#64748b] mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------ */}
        {/* SUPPORTING FEATURE 3: VENDOR INTELLIGENCE              */}
        {/* ------------------------------------------------------ */}
        <div className="lg:col-span-6 rounded-2xl bg-white border border-gold-200/80 p-6 sm:p-8 flex flex-col justify-between shadow-md hover:border-gold-400/80 transition-all duration-300">
          <div className="mb-6">
            <h4 className="font-display text-xl sm:text-2xl font-bold text-[#1a2f4a] mb-2 tracking-tight">
              Vendor Intelligence
            </h4>
            <p className="text-sm sm:text-base text-[#334155] leading-relaxed">
              Compare vendor prices, sales, margins, outstanding balances, and metal balances.
            </p>
          </div>

          {/* Visual: Distinct Supplier Comparative Cards */}
          <div className="rounded-xl bg-[#FAF8F4] border border-gold-200/70 p-4 space-y-3">
            <div className="text-[11px] font-bold text-[#855e05] uppercase tracking-wider">
              Supplier Comparison At A Glance
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Supplier Option A */}
              <div className="p-3.5 rounded-lg bg-white border-2 border-emerald-500/40 shadow-xs relative">
                <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-600 text-white uppercase tracking-wider">
                  Top Margin
                </span>
                <p className="text-xs font-bold text-[#1a2f4a]">Artisan Guild</p>
                <div className="mt-2.5 space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-[#64748b]">
                    <span>Wastage</span>
                    <span className="font-semibold text-[#1a2f4a]">1.8%</span>
                  </div>
                  <div className="flex justify-between text-[#64748b]">
                    <span>Making Term</span>
                    <span className="font-semibold text-emerald-700">Favorable</span>
                  </div>
                </div>
              </div>

              {/* Supplier Option B */}
              <div className="p-3.5 rounded-lg bg-white border border-gold-200/70 shadow-2xs opacity-85">
                <p className="text-xs font-bold text-[#1a2f4a]">Direct Chains</p>
                <div className="mt-2.5 space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-[#64748b]">
                    <span>Wastage</span>
                    <span className="font-semibold text-[#1a2f4a]">2.6%</span>
                  </div>
                  <div className="flex justify-between text-[#64748b]">
                    <span>Making Term</span>
                    <span className="font-semibold text-amber-700">Standard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------ */}
        {/* SUPPORTING FEATURE 4: ARTICLE PROFITABILITY            */}
        {/* ------------------------------------------------------ */}
        <div className="lg:col-span-6 rounded-2xl bg-white border border-gold-200/80 p-6 sm:p-8 flex flex-col justify-between shadow-md hover:border-gold-400/80 transition-all duration-300">
          <div className="mb-6">
            <h4 className="font-display text-xl sm:text-2xl font-bold text-[#1a2f4a] mb-2 tracking-tight">
              Article Profitability
            </h4>
            <p className="text-sm sm:text-base text-[#334155] leading-relaxed">
              Understand the true margin on every article, from procurement costs to final sale.
            </p>
          </div>

          {/* Visual: Clean Cost-to-Margin Anatomy */}
          <div className="rounded-xl bg-[#FAF8F4] border border-gold-200/70 p-4 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#855e05] uppercase tracking-wider">
              <span>Article Margin Anatomy</span>
              <span className="text-[#1a2f4a] font-mono">Net Realized Profit</span>
            </div>

            {/* Proportion Bar */}
            <div className="h-4 w-full rounded-md overflow-hidden flex text-[10px] font-bold text-white shadow-inner">
              <div className="bg-[#1a2f4a] h-full flex items-center justify-center w-[68%]" title="Raw Metal 68%">
                Metal 68%
              </div>
              <div className="bg-gold-500 h-full flex items-center justify-center w-[16%]" title="Making 16%">
                Making
              </div>
              <div className="bg-emerald-600 h-full flex items-center justify-center w-[16%]" title="Margin 16%">
                Margin
              </div>
            </div>

            {/* Meaningful Equation Breakdown */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-gold-200/60 font-medium">
              <span className="text-[#64748b]">Procurement + Craftsmanship</span>
              <span className="text-gold-500 font-bold select-none">➔</span>
              <span className="text-[#1a2f4a] font-semibold">Selling Price</span>
              <span className="text-gold-500 font-bold select-none">➔</span>
              <span className="text-emerald-700 font-bold">True Margin</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------ */}
        {/* SUPPORTING FEATURE 5: TALLY + JEWELLERY, ONE SYSTEM    */}
        {/* ------------------------------------------------------ */}
        <div className="lg:col-span-6 rounded-2xl bg-white border border-gold-200/80 p-6 sm:p-8 flex flex-col justify-between shadow-md hover:border-gold-400/80 transition-all duration-300">
          <div className="mb-6">
            <h4 className="font-display text-xl sm:text-2xl font-bold text-[#1a2f4a] mb-2 tracking-tight">
              Tally + Jewellery, One System
            </h4>
            <p className="text-sm sm:text-base text-[#334155] leading-relaxed">
              Bring accounts, ledgers, and jewellery operations together in one system.
            </p>
          </div>

          {/* Visual: Cohesive Unified Two-Domain Integration Hub */}
          <div className="rounded-xl bg-[#FAF8F4] border border-gold-200/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 p-3 rounded-lg bg-white border border-gold-200/80 text-center shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-gold-500 inline-block mb-1" />
                <p className="text-xs font-bold text-[#1a2f4a]">Jewellery Operations</p>
                <p className="text-[11px] text-[#64748b] mt-0.5">Metals, tags & stock</p>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#1a2f4a] text-gold-300 flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
                ↔
              </div>

              <div className="flex-1 p-3 rounded-lg bg-white border border-gold-200/80 text-center shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mb-1" />
                <p className="text-xs font-bold text-[#1a2f4a]">Financial Accounting</p>
                <p className="text-[11px] text-[#64748b] mt-0.5">Tally ledgers & GST</p>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------ */}
        {/* SUPPORTING FEATURE 6: AI-POWERED BUSINESS INTELLIGENCE */}
        {/* ------------------------------------------------------ */}
        <div className="lg:col-span-6 rounded-2xl bg-white border border-gold-200/80 p-6 sm:p-8 flex flex-col justify-between shadow-md hover:border-gold-400/80 transition-all duration-300">
          <div className="mb-6">
            <h4 className="font-display text-xl sm:text-2xl font-bold text-[#1a2f4a] mb-2 tracking-tight">
              AI-Powered Business Intelligence
            </h4>
            <p className="text-sm sm:text-base text-[#334155] leading-relaxed">
              Turn business data into insights, alerts, and recommendations.
            </p>
          </div>

          {/* Visual: Clear Trend Curve Paired with Concise Actionable Insight */}
          <div className="rounded-xl bg-[#FAF8F4] border border-gold-200/70 p-4 flex items-center gap-4">
            {/* Trend Curve SVG Graphic */}
            <div className="w-24 h-14 flex-shrink-0 bg-white rounded-lg border border-gold-200/70 p-1 flex items-center justify-center">
              <svg viewBox="0 0 100 50" className="w-full h-full stroke-gold-500 fill-none" strokeWidth="3">
                <path d="M 5 45 Q 35 40 50 25 T 95 8" />
                <circle cx="95" cy="8" r="4" className="fill-emerald-600 stroke-white" strokeWidth="2" />
              </svg>
            </div>

            {/* Actionable Signal Callout */}
            <div className="flex-1 bg-white p-2.5 rounded-lg border border-gold-200/70 shadow-2xs">
              <span className="text-[10px] font-bold text-[#855e05] uppercase tracking-wider block">
                Actionable Signal
              </span>
              <p className="text-xs font-semibold text-[#1a2f4a] mt-0.5 leading-snug">
                Early bridal demand spike detected: Reorder recommendation generated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
