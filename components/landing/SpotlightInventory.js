import Image from 'next/image';
import { QrCode, SlidersHorizontal, Scale } from 'lucide-react';

export default function SpotlightInventory() {
  const highlights = [
    { label: 'HUID barcode generation', icon: QrCode },
    { label: '22K, 24K and 18K purity filters', icon: SlidersHorizontal },
    { label: 'Stone weight versus net gold weight', icon: Scale },
  ];

  return (
    <div id="inventory" className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-14 items-center scroll-mt-24">
      {/* Editorial Visual Column (Left on desktop for alternating visual rhythm) */}
      <div className="md:col-span-7 order-2 md:order-1">
        <div className="relative rounded-2xl overflow-hidden border border-gold-400/20 bg-navy-950/40 shadow-2xl shadow-black/40 group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1320]/60 via-transparent to-transparent z-10 pointer-events-none" />
          <Image
            src="/landing/inventory-traceability-editorial.jpg"
            alt="Meticulously organized jewellery inventory in display trays with HUID micro-barcode tags and carat scale"
            width={1280}
            height={720}
            sizes="(min-width: 768px) 58vw, 100vw"
            className="!h-auto !w-full object-cover aspect-[16/9] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        </div>
      </div>

      {/* Narrative Column (Right on desktop) */}
      <div className="md:col-span-5 order-1 md:order-2 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="text-[11px] font-mono font-bold tracking-widest text-gold-300 uppercase px-2.5 py-1 rounded bg-gold-500/15 border border-gold-400/25">
            Octis Inventory System
          </span>
        </div>

        <h3 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold text-white tracking-tight leading-[1.18] mb-5">
          Every Gram. Accounted For.
        </h3>

        <p className="text-base sm:text-lg text-cream-200/85 font-light leading-relaxed mb-8">
          Track jewellery from procurement to sale with precise weight, purity and stock visibility.
        </p>

        {/* 3 Concise Highlights */}
        <div className="space-y-3">
          {highlights.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-gold-400/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gold-500/15 border border-gold-400/30 flex items-center justify-center text-gold-300 shrink-0">
                  <IconComponent className="w-4 h-4" strokeWidth={2} />
                </div>
                <span className="text-sm font-medium text-cream-100 tracking-wide">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
