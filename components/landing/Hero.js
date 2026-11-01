import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Coins, TrendingUp } from 'lucide-react';
import LiveMetalPricesModal from './LiveMetalPricesModal';

/**
 * Hero Component — Octis Premium Interactive Hero Experience
 *
 * Art-directed for Indian jewellery retail leadership:
 * - Single primary <h1>: "OCTIS AI-POWERED JEWELLERY ERP"
 * - Exact supporting caption and 4 verified capability indicators
 * - Three-action hierarchy: [Sign In] [Request Demo] [Live Metal Prices]
 * - Truthful, accessible Live Metal Prices panel with keyboard/Escape handling
 * - Restored foreground floating sales card with independent subtle float animation
 */
export default function Hero() {
  const [isMetalPricesOpen, setIsMetalPricesOpen] = useState(false);
  const metalPricesBtnRef = useRef(null);

  return (
    <section className="relative pt-24 pb-16 md:pt-28 md:pb-20 overflow-hidden landing-hero-bg min-h-[calc(100vh-72px)] flex items-center">
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(107,58,42,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(107,58,42,.05) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Copy Column */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Primary Heading */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#1a2f4a] leading-[1.12] mb-4 tracking-tight max-w-xl">
              OCTIS AI-POWERED{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-600 to-[#9a7209]">
                JEWELLERY ERP
              </span>
            </h1>

            {/* Supporting Caption */}
            <p className="text-base sm:text-lg text-brown-500 leading-relaxed mb-7 max-w-xl">
              Octis connects every part of your jewellery business and turns its data into smarter decisions with AI. Your data stays private and protected.
            </p>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <a
                href="https://app.octis.in/login"
                className="w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold rounded-lg border border-border/80 bg-white/80 hover:bg-white hover:border-gold-300 text-[#1a2f4a] shadow-xs h-12 px-7 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
              >
                Sign In
              </a>
              <Link
                href="/request-demo"
                className="w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 h-12 px-7 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
              >
                Request Demo
              </Link>
              <button
                ref={metalPricesBtnRef}
                type="button"
                onClick={() => setIsMetalPricesOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={isMetalPricesOpen}
                aria-controls="metal-rates-heading"
                className="w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold rounded-lg border border-gold-300/80 bg-white/90 hover:bg-gold-50/80 text-[#1a2f4a] shadow-xs h-12 px-6 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 group"
              >
                <Coins className="w-4 h-4 mr-2 text-gold-600 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                <span>Live Metal Prices</span>
              </button>
            </div>

            {/* Product Capability Indicators */}
            <div className="mt-8 pt-6 border-t border-gold-200/50 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-muted-foreground w-full">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="font-medium text-[#1a2f4a]/85">Taxation Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="font-medium text-[#1a2f4a]/85">Business Intelligence</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="font-medium text-[#1a2f4a]/85">Dynamic Billing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="font-medium text-[#1a2f4a]/85">AI-POWERED SAAS ERP</span>
              </div>
            </div>
          </div>

          {/* Right Graphic Column: Laptop Showcase with Overlapping Floating Sales Card */}
          <div className="relative flex items-center justify-center mt-6 lg:mt-0">
            <div className="landing-mockup-glow" />

            {/* Positioning wrapper: anchors both laptop mockup and overlapping floating card */}
            <div className="relative w-full max-w-xl mx-auto z-10">
              {/* Laptop Image Frame */}
              <div className="landing-mockup-frame transition-all duration-500 hover:shadow-2xl">
                <Image
                  src="/hero-product.png"
                  alt="Octis Jewellery ERP Dashboard preview showing live showroom operations"
                  width={1536}
                  height={1024}
                  priority
                  sizes="(min-width: 1024px) 36rem, 100vw"
                  className="relative z-10 !h-auto !w-full rounded-xl"
                />
              </div>

              {/* Floating Sales Card — Restored Foreground Layer */}
              <div
                className="hero-sales-float absolute -bottom-4 left-3 sm:-bottom-5 sm:-left-5 z-20 bg-[#fdfcf8]/95 backdrop-blur-md border border-gold-300/70 rounded-xl p-3 sm:p-3.5 shadow-xl shadow-[#152a45]/15 flex items-center gap-3 max-w-[240px] pointer-events-auto"
                aria-label="Demonstrative Today's Sales Metric"
              >
                <div className="w-10 h-10 rounded-lg icon-gradient-gold flex items-center justify-center text-white flex-shrink-0 shadow-sm shadow-gold-600/30">
                  <TrendingUp className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
                      Today&apos;s Sales
                    </p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-bold tracking-wide">
                      DEMO
                    </span>
                  </div>
                  <p className="text-base sm:text-lg font-bold text-[#1a2f4a] font-mono tabular-nums leading-none">
                    ₹4,85,200
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Metal Prices Interactive Modal */}
      <LiveMetalPricesModal
        isOpen={isMetalPricesOpen}
        onClose={() => setIsMetalPricesOpen(false)}
        triggerRef={metalPricesBtnRef}
      />
    </section>
  );
}
