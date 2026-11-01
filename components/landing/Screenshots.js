import { useState, useEffect, useRef } from 'react';

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

const screens = [
  { src: '/landing/dashboard-mockup.png', title: 'Dashboard', desc: 'Sales summary, gold rates, and quick actions at a glance' },
  { src: '/landing/pos-mockup.png', title: 'POS & Billing', desc: 'Fast invoicing with old gold exchange and scheme redemption' },
  { src: '/landing/inventory-mockup.png', title: 'Inventory', desc: 'Tag-based tracking with HUID, purity, and weight details' },
];

export default function Screenshots() {
  const [active, setActive] = useState(0);
  const [ref, visible] = useInView();

  return (
    <section id="screenshots" className="py-24" style={{ background: 'linear-gradient(180deg, #f5ead8 0%, #fdf8f0 100%)' }} ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#c9a96e' }}>
            See It In Action
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-brown-700 mb-4">
            Clean, Intuitive Interface
          </h2>
          <p className="text-brown-300 max-w-xl mx-auto">
            Designed for busy shop environments — fast, clutter-free, and easy to learn.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex justify-center gap-2 mb-10">
          {screens.map((s, i) => (
            <button
              key={s.title}
              onClick={() => setActive(i)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                active === i
                  ? 'text-white shadow-lg'
                  : 'text-brown-400 bg-white border border-gold-100 hover:border-gold-300'
              }`}
              style={active === i ? { background: 'linear-gradient(135deg, #6b3a2a, #4a2518)' } : {}}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Screenshot display */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl border border-gold-200 transition-all duration-500"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
          }}
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3" style={{ background: '#6b3a2a' }}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: '#e8c0a0' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#d4a96a' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#c9a96e' }} />
            </div>
            <div className="flex-1 mx-4">
              <div className="h-6 rounded-md px-3 flex items-center text-xs" style={{ background: 'rgba(255,255,255,0.1)', color: '#d4a96a' }}>
                app.octis.in/{screens[active].title.toLowerCase()}
              </div>
            </div>
          </div>

          <div className="relative bg-cream-100" style={{ minHeight: '420px' }}>
            {screens.map((s, i) => (
              <img
                key={s.src}
                src={s.src}
                alt={s.title}
                className={`w-full h-auto transition-all duration-500 ${
                  active === i ? 'opacity-100 relative' : 'opacity-0 absolute inset-0'
                }`}
                loading="lazy"
              />
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-brown-300 mt-6">
          {screens[active].desc}
        </p>
      </div>
    </section>
  );
}
