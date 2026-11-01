import { useState, Fragment } from 'react';
import {
  Check,
  Sparkles,
  Store,
  TrendingUp,
  Building2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from 'lucide-react';

export default function Pricing() {
  const [showComparison, setShowComparison] = useState(false);

  // Concise, benefit-led plans following Linear, Stripe, and Vercel SaaS pricing principles
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      concept: 'RUN',
      progressionTag: '01 RUN',
      headline: 'Run your showroom.',
      description: 'Everyday billing, inventory, and reconciliation.',
      featured: false,
      icon: Store,
      priceLabel: 'Custom pricing',
      priceSubtext: 'Tailored to your business and branch requirements.',
      ctaText: 'Contact for pricing',
      ctaHref: '#cta',
      badge: null,
      buttonStyle:
        'border border-gold-300 bg-white hover:bg-gold-50/80 text-[#1a2f4a] shadow-xs hover:border-gold-400',
      keyBenefits: [
        'Fast POS and GST billing',
        'Inventory tagging',
        'Daily reports',
        'Email support',
      ],
      note: 'Business Intelligence and AI are not included.',
      noteType: 'exclusion',
    },
    {
      id: 'professional',
      name: 'Professional',
      concept: 'UNDERSTAND',
      progressionTag: '02 UNDERSTAND',
      headline: 'Understand your business.',
      description: 'Turn showroom data into actionable insights.',
      featured: true,
      icon: TrendingUp,
      priceLabel: 'Custom pricing',
      priceSubtext: 'Tailored to your business and branch requirements.',
      ctaText: 'Contact for pricing',
      ctaHref: '#cta',
      badge: 'Most Popular',
      buttonStyle:
        'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white shadow-md shadow-gold-900/15 font-bold',
      keyBenefits: [
        'AI business insights',
        'Stock and margin intelligence',
        'Vendor performance',
        '100+ business reports',
        'CRM and karigar management',
        'Digital catalogue',
      ],
      note: 'Includes Starter capabilities.',
      noteType: 'inheritance',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      concept: 'PREDICT • OPTIMISE • SCALE',
      progressionTag: '03 SCALE',
      headline: 'Scale with intelligence.',
      description: 'Advanced AI, multi-branch control, and tailored workflows.',
      featured: false,
      icon: Building2,
      priceLabel: 'Custom pricing',
      priceSubtext: 'Tailored to your business and branch requirements.',
      ctaText: 'Contact for pricing',
      ctaHref: '#cta',
      badge: null,
      buttonStyle:
        'bg-[#1a2f4a] hover:bg-[#122236] text-white shadow-sm font-semibold',
      keyBenefits: [
        {
          text: 'AI catalogue image generation',
          highlight: 'Studio-Grade AI',
        },
        'Predictive sales and purchasing',
        'Advanced AI alerts',
        'Multi-branch management',
        'Custom workflows and permissions',
        'Centralised reporting',
      ],
      note: 'Includes Professional capabilities.',
      noteType: 'inheritance',
    },
  ];

  // Granular capability matrix for optional deep-dive comparison
  const comparisonSections = [
    {
      categoryName: 'SHOWROOM OPERATIONS',
      items: [
        {
          name: 'POS, Touch Billing & Barcode Scanning',
          starter: true,
          professional: true,
          enterprise: true,
        },
        {
          name: 'GST Invoicing, HUID & BIS Compliance',
          starter: true,
          professional: true,
          enterprise: true,
        },
        {
          name: 'Inventory Tagging & Daily Reconciliation',
          starter: true,
          professional: true,
          enterprise: true,
        },
        {
          name: 'Karigar Management & Job Tracking',
          starter: false,
          professional: true,
          enterprise: true,
        },
        {
          name: 'Gold & Silver Savings Schemes',
          starter: false,
          professional: true,
          enterprise: true,
        },
        {
          name: 'Customer 360 CRM & WhatsApp Invoicing',
          starter: false,
          professional: true,
          enterprise: true,
        },
        {
          name: 'Digital Customer Catalogue Sync',
          starter: false,
          professional: true,
          enterprise: true,
        },
      ],
    },
    {
      categoryName: 'BUSINESS INTELLIGENCE & AI',
      items: [
        {
          name: 'Standard Daily & Monthly Reports',
          starter: true,
          professional: true,
          enterprise: true,
        },
        {
          name: '100+ Advanced Business Reports',
          starter: false,
          professional: true,
          enterprise: true,
        },
        {
          name: 'Stock Velocity & Dead Stock Analysis',
          starter: false,
          professional: true,
          enterprise: true,
        },
        {
          name: 'Article-Level Margin & Profit Intelligence',
          starter: false,
          professional: true,
          enterprise: true,
        },
        {
          name: 'Vendor Scorecards & Price Comparison',
          starter: false,
          professional: true,
          enterprise: true,
        },
        {
          name: 'Actionable AI Business Alerts & Advice',
          starter: false,
          professional: true,
          enterprise: true,
        },
        {
          name: 'Predictive Sales & Purchasing Intelligence',
          starter: false,
          professional: false,
          enterprise: true,
        },
        {
          name: 'AI Catalogue Image Generation',
          starter: false,
          professional: false,
          enterprise: true,
        },
      ],
    },
    {
      categoryName: 'GOVERNANCE, SCALE & SERVICE',
      items: [
        {
          name: 'Multi-Branch Oversight & Aggregation',
          starter: false,
          professional: false,
          enterprise: true,
        },
        {
          name: 'Centralised Control & Role Permissions',
          starter: false,
          professional: false,
          enterprise: true,
        },
        {
          name: 'Configurable Workflows & Approvals',
          starter: false,
          professional: 'Standard',
          enterprise: 'Custom',
        },
        {
          name: 'Support Channel',
          starter: 'Email',
          professional: 'Priority Email & Phone',
          enterprise: 'Dedicated SLA',
        },
      ],
    },
  ];

  // Helper to render table cell with absolute mathematical center alignment
  const renderCellContent = (value) => {
    if (value === true) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gold-100/60 text-gold-700">
          <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-label="Included" />
        </span>
      );
    }
    if (value === false) {
      return (
        <span className="text-stone-300 font-light select-none text-base" aria-label="Not included">
          —
        </span>
      );
    }
    if (value === 'Standard') {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-md bg-stone-100 text-[#475569] font-mono text-[11px] font-medium border border-stone-200/70">
          Standard
        </span>
      );
    }
    if (value === 'Custom') {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-md bg-gold-100/90 text-[#855e05] font-mono text-[11px] font-bold border border-gold-300/70">
          Custom
        </span>
      );
    }
    if (value === 'Email') {
      return <span className="text-xs font-medium text-[#475569]">Email</span>;
    }
    if (value === 'Priority Email & Phone') {
      return (
        <span className="text-xs font-semibold text-[#855e05]">
          Priority Email &amp; Phone
        </span>
      );
    }
    if (value === 'Dedicated SLA') {
      return <span className="text-xs font-bold text-[#1a2f4a]">Dedicated SLA</span>;
    }
    return <span className="text-xs text-[#475569]">{value}</span>;
  };

  return (
    <section id="pricing" className="py-20 md:py-28 landing-surface-tinted scroll-mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ======================================================== */}
        {/* 1. SECTION HEADER & VALUE PROGRESSION CONTINUUM          */}
        {/* ======================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <p className="landing-section-label mb-3">Pricing & Plans</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-5 text-[#1a2f4a]">
            Structured for Showroom Growth
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-[#475569] max-w-2xl mx-auto mb-8 font-normal">
            Three clear stages of capability designed to scale with your jewellery business.
          </p>

          {/* Continuum Bar: 01 RUN -> 02 UNDERSTAND -> 03 SCALE */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-white/95 border border-gold-300/50 shadow-xs text-xs">
            <span className="px-3.5 py-1 rounded-full bg-stone-100 font-bold text-[#1a2f4a] tracking-wide">
              01 RUN
            </span>
            <span className="text-gold-500 font-bold" aria-hidden="true">→</span>
            <span className="px-3.5 py-1 rounded-full bg-gold-100/90 font-bold text-[#855e05] tracking-wide">
              02 UNDERSTAND
            </span>
            <span className="text-gold-500 font-bold" aria-hidden="true">→</span>
            <span className="px-3.5 py-1 rounded-full bg-[#1a2f4a] font-bold text-white tracking-wide">
              03 SCALE
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. THREE BENEFIT-LED, AIRY PRICING CARDS                 */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch max-w-7xl mx-auto">
          {plans.map((plan) => {
            const IconComp = plan.icon;
            return (
              <div
                key={plan.id}
                className={`rounded-3xl flex flex-col justify-between transition-all duration-300 relative ${
                  plan.featured
                    ? 'lg:col-span-4 bg-white border-2 border-gold-400/90 shadow-xl shadow-gold-950/10 lg:-translate-y-2 lg:scale-[1.02] p-7 sm:p-8 ring-1 ring-gold-400/30'
                    : 'lg:col-span-4 bg-white/95 border border-gold-200/80 hover:border-gold-300 shadow-sm p-6 sm:p-7'
                }`}
              >
                <div>
                  {/* Top Tier Tag & Most Popular Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-md ${
                        plan.featured
                          ? 'bg-gold-100/90 text-[#855e05] border border-gold-300/70'
                          : 'bg-stone-100 text-[#475569] border border-stone-200/70'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5 text-gold-600" aria-hidden="true" />
                      <span>{plan.progressionTag}</span>
                    </span>

                    {plan.featured && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-gold-500 text-white shadow-xs">
                        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{plan.badge}</span>
                      </span>
                    )}
                  </div>

                  {/* Plan Name & Tagline */}
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#1a2f4a] tracking-tight mb-1">
                    {plan.name}
                  </h3>

                  <p className="text-xs font-semibold text-[#855e05] uppercase tracking-wide mb-2">
                    {plan.headline}
                  </p>

                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-6 min-h-[38px]">
                    {plan.description}
                  </p>

                  {/* Pricing Display */}
                  <div className="py-4 border-y border-gold-200/60 mb-6">
                    <p className="text-2xl sm:text-3xl font-display font-bold text-[#1a2f4a] tracking-tight">
                      {plan.priceLabel}
                    </p>
                    <p className="text-xs text-[#64748b] mt-1 font-light">
                      {plan.priceSubtext}
                    </p>
                  </div>

                  {/* Key Benefits List (4 to 6 concise scannable bullets) */}
                  <div className="mb-6">
                    <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1a2f4a] mb-3">
                      Key Capabilities:
                    </p>
                    <ul className="space-y-3">
                      {plan.keyBenefits.map((item, idx) => {
                        const isObject = typeof item === 'object';
                        const text = isObject ? item.text : item;
                        const highlight = isObject ? item.highlight : null;

                        return (
                          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                            <span className="mt-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gold-100/70 text-gold-700 flex-shrink-0">
                              <Check className="w-3 h-3 stroke-[2.5]" aria-hidden="true" />
                            </span>
                            <div className="flex-1">
                              <span className="font-medium text-[#1a2f4a]">{text}</span>
                              {highlight && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gold-200/70 text-[#855e05] border border-gold-300/60">
                                  {highlight}
                                </span>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Understated Boundary or Inheritance Note */}
                  {plan.note && (
                    <div
                      className={`p-3 rounded-xl text-xs mb-6 ${
                        plan.noteType === 'exclusion'
                          ? 'bg-stone-50 border border-stone-200/80 text-[#64748b] italic'
                          : 'bg-gold-50/60 border border-gold-200/60 text-[#855e05] font-medium'
                      }`}
                    >
                      {plan.note}
                    </div>
                  )}
                </div>

                {/* Primary Card CTA */}
                <div className="mt-auto pt-2">
                  <a
                    href={plan.ctaHref}
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 active:scale-[0.98] h-12 px-5 py-3 w-full group ${plan.buttonStyle}`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight
                      className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* 3. OPTIONAL EXPANDABLE CAPABILITY COMPARISON TABLE       */}
        {/* ======================================================== */}
        <div className="mt-14 max-w-5xl mx-auto">
          {/* Drawer Toggle Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gold-300 hover:border-gold-400 text-[#1a2f4a] font-medium text-xs sm:text-sm shadow-xs transition-all duration-200 hover:bg-gold-50/50"
              aria-expanded={showComparison}
            >
              <SlidersHorizontal className="w-4 h-4 text-gold-600" aria-hidden="true" />
              <span>
                {showComparison ? 'Hide Capability Comparison' : 'Compare All Capabilities in Detail'}
              </span>
              {showComparison ? (
                <ChevronUp className="w-4 h-4 text-gold-600 ml-1" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gold-600 ml-1" />
              )}
            </button>
          </div>

          {/* Centered, Mathematically Aligned Comparison Table */}
          <div
            className={`rounded-3xl border border-gold-200/80 bg-white shadow-sm overflow-hidden transition-all duration-300 ${
              showComparison ? 'block' : 'hidden'
            }`}
          >
            <div className="overflow-x-auto">
                <table className="w-full table-fixed border-collapse min-w-[640px]">
                  {/* Strict column percentages guaranteeing mathematically centered ticks */}
                  <colgroup>
                    <col className="w-[43%]" />
                    <col className="w-[19%]" />
                    <col className="w-[19%]" />
                    <col className="w-[19%]" />
                  </colgroup>

                  {/* Header Row */}
                  <thead>
                    <tr className="border-b border-gold-200 bg-[#fffdfa]">
                      <th className="py-4 pl-6 sm:pl-8 pr-4 text-left font-display text-base sm:text-lg font-bold text-[#1a2f4a]">
                        Capability
                      </th>
                      <th className="py-4 px-3 text-center font-display text-sm sm:text-base font-semibold text-[#1a2f4a]">
                        Starter
                      </th>
                      <th className="py-4 px-3 text-center">
                        <span className="inline-block px-4 py-1.5 rounded-xl bg-gold-50 border border-gold-300/80 font-display text-sm sm:text-base font-bold text-[#855e05] shadow-2xs">
                          Professional
                        </span>
                      </th>
                      <th className="py-4 px-3 text-center font-display text-sm sm:text-base font-semibold text-[#1a2f4a]">
                        Enterprise
                      </th>
                    </tr>
                  </thead>

                  {/* Body with Categories & Items */}
                  <tbody>
                    {comparisonSections.map((section, sIdx) => (
                      <Fragment key={sIdx}>
                        {/* Category Heading Row */}
                        <tr>
                          <td
                            colSpan={4}
                            className="py-2.5 pl-6 sm:pl-8 pr-4 bg-[#faf7f0] border-y border-gold-200/60 text-[11px] font-mono font-bold tracking-wider text-[#855e05] uppercase"
                          >
                            {section.categoryName}
                          </td>
                        </tr>

                        {/* Capability Items */}
                        {section.items.map((item, iIdx) => (
                          <tr
                            key={iIdx}
                            className="border-b border-gold-100/70 hover:bg-gold-50/30 transition-colors"
                          >
                            <td className="py-3.5 pl-6 sm:pl-8 pr-4 text-xs sm:text-sm font-medium text-[#1a2f4a] align-middle">
                              {item.name}
                            </td>
                            <td className="py-3.5 px-3 text-center align-middle">
                              <div className="flex items-center justify-center">
                                {renderCellContent(item.starter)}
                              </div>
                            </td>
                            <td className="py-3.5 px-3 text-center align-middle bg-gold-50/25">
                              <div className="flex items-center justify-center">
                                {renderCellContent(item.professional)}
                              </div>
                            </td>
                            <td className="py-3.5 px-3 text-center align-middle">
                              <div className="flex items-center justify-center">
                                {renderCellContent(item.enterprise)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
