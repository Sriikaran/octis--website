import Image from 'next/image';
import { ArrowRight, RefreshCw, Sparkles, Globe } from 'lucide-react';

export default function SpotlightDigitalCommerce() {
  const capabilities = [
    {
      title: 'Real-Time Catalogue Sync',
      tierBadge: 'Professional+',
      description: 'Live sync of tagged showroom inventory with weight, purity, and BIS hallmarking directly to customer browsing.',
      isAi: false,
    },
    {
      title: 'AI Catalogue Image Creation',
      tierBadge: 'Enterprise Exclusive',
      description: 'Studio-grade digital product presentations created directly from jewellery ERP specifications without photoshoots.',
      isAi: true,
    },
  ];

  return (
    <div id="digital-commerce" className="scroll-mt-24 pt-4">
      {/* Outer Editorial Container with Fine Gold Accents */}
      <div className="rounded-3xl border border-gold-400/30 bg-gradient-to-br from-[#111e33] via-[#0c1524] to-[#080e18] p-6 sm:p-10 lg:p-12 shadow-2xl shadow-black/50 relative overflow-hidden">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-14 items-center relative z-10">
          {/* Narrative Column */}
          <div className="md:col-span-6 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-[11px] font-mono font-bold tracking-widest text-gold-300 uppercase px-2.5 py-1 rounded bg-gold-500/15 border border-gold-400/30 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-gold-300" />
                <span>Digital Commerce</span>
              </span>
            </div>

            <h3 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold text-white tracking-tight leading-[1.18] mb-5">
              From Your ERP to Your Digital Storefront
            </h3>

            <p className="text-base sm:text-lg text-cream-200/85 font-light leading-relaxed mb-8">
              Turn live ERP inventory into a customer-facing jewellery catalogue without duplicate stock entry.
            </p>

            {/* Two Distinct Capabilities with Discreet Tier Labels */}
            <div className="space-y-4 mb-8">
              {capabilities.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
                    item.isAi
                      ? 'bg-gradient-to-r from-gold-500/10 via-[#1a2f4a]/50 to-gold-500/5 border-gold-400/40 shadow-lg'
                      : 'bg-white/[0.03] border-white/10 hover:border-gold-400/30'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        item.isAi
                          ? 'bg-gold-500/25 border border-gold-400/50 text-gold-300'
                          : 'bg-white/10 border border-white/20 text-cream-200'
                      }`}
                    >
                      {item.isAi ? (
                        <Sparkles className="w-4 h-4" strokeWidth={2.2} />
                      ) : (
                        <RefreshCw className="w-4 h-4" strokeWidth={2.2} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <h4 className="text-white font-semibold text-base">
                          {item.title}
                        </h4>
                        <span
                          className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            item.isAi
                              ? 'bg-gold-400/20 text-gold-300 border border-gold-400/40'
                              : 'bg-white/10 text-cream-200/80 border border-white/10'
                          }`}
                        >
                          {item.tierBadge}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-cream-200/70 font-light leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Preserved Navigation Link to Pricing */}
            <div className="pt-1">
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gold-300 hover:text-gold-200 transition-colors uppercase tracking-wider group"
              >
                <span>Compare Digital Commerce in Pricing</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Visual Column */}
          <div className="md:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-gold-400/30 bg-[#080e18] shadow-2xl shadow-black/60 group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1320]/70 via-transparent to-transparent z-10 pointer-events-none" />
              <Image
                src="/landing/digital-commerce-editorial.jpg"
                alt="Digital jewellery catalogue displayed on a tablet synchronized live with Octis ERP showroom stock"
                width={1280}
                height={720}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="!h-auto !w-full object-cover aspect-[16/9] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
