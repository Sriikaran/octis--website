import { ShoppingCart, Package, CheckCircle2 } from 'lucide-react';
import { useInView } from './useInView';

function Mockup({ src, alt }) {
  return (
    <div className="relative">
      <div className="landing-mockup-glow" />
      <div className="landing-mockup-frame relative">
        <img src={src} alt={alt} className="w-full rounded-xl relative z-10" />
      </div>
    </div>
  );
}

export default function Showcase() {
  const [ref1, v1] = useInView(0.2);
  const [ref2, v2] = useInView(0.2);

  return (
    <section id="inventory" className="py-20 md:py-28 landing-section-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-24 md:space-y-32">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center" ref={ref1}>
          <div className={`transition-all duration-1000 ${v1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <div className="landing-icon-ring landing-icon-ring--light mb-6">
              <ShoppingCart size={22} strokeWidth={2.25} />
            </div>
            <h3 className="font-display text-3xl sm:text-4xl font-bold text-white mb-5 tracking-tight">
              A Point of Sale that keeps the line moving
            </h3>
            <p className="text-lg text-cream-200/80 mb-8 leading-relaxed">
              Long queues during Dhanteras? No problem. Our POS is optimized for speed. Add items via barcode scanner, calculate wastage and making charges instantly, and accept any payment method.
            </p>
            <ul className="space-y-3.5">
              {['One-click old gold exchange calculation', 'Split payments (Cash + Card + UPI)', 'Instant WhatsApp invoice sharing'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-cream-100 font-medium text-sm">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-500/25 flex items-center justify-center ring-1 ring-gold-400/40">
                    <CheckCircle2 size={14} className="text-gold-300" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className={`transition-all duration-1000 delay-200 ${v1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <Mockup src="/landing/pos-mockup.png" alt="Octis POS System" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center" ref={ref2}>
          <div className={`order-2 lg:order-1 transition-all duration-1000 delay-200 ${v2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <Mockup src="/landing/inventory-mockup.png" alt="Octis Inventory System" />
          </div>
          <div className={`order-1 lg:order-2 transition-all duration-1000 ${v2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div className="landing-icon-ring landing-icon-ring--light mb-6">
              <Package size={22} strokeWidth={2.25} />
            </div>
            <h3 className="font-display text-3xl sm:text-4xl font-bold text-white mb-5 tracking-tight">
              Total visibility over your most valuable assets
            </h3>
            <p className="text-lg text-cream-200/80 mb-8 leading-relaxed">
              Every gram counts. Track your entire stock from procurement to sale with granular details. Know exactly what you have, where it is, and what you need to reorder.
            </p>
            <ul className="space-y-3.5">
              {['Seamless HUID barcode generation', 'Filter by Purity (22K/24K/18K)', 'Track stone weight vs net gold weight'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-cream-100 font-medium text-sm">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-500/25 flex items-center justify-center ring-1 ring-gold-400/40">
                    <CheckCircle2 size={14} className="text-gold-300" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
