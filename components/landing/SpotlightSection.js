import SpotlightPos from './SpotlightPos';
import SpotlightInventory from './SpotlightInventory';
import SpotlightDigitalCommerce from './SpotlightDigitalCommerce';

export default function SpotlightSection() {
  return (
    <section className="py-20 md:py-28 bg-[#0b1320] relative overflow-hidden border-t border-b border-gold-500/20">
      {/* Ambient Radial Glow Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(197,168,128,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_90%_90%,rgba(21,42,69,0.35),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_10%_50%,rgba(201,169,110,0.06),transparent_55%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24 md:space-y-32">
        <SpotlightPos />
        <SpotlightInventory />
        <SpotlightDigitalCommerce />
      </div>
    </section>
  );
}
