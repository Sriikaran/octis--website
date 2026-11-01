import { useEffect, useRef, useState } from 'react';

function useInView(threshold = 0.2) {
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

export default function Problem() {
  const [ref, visible] = useInView();

  return (
    <section className="py-20 bg-cream-100" ref={ref}>
      <div className={`max-w-4xl mx-auto px-6 text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#c9a96e' }}>
          The Challenge
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-brown-700 mb-6">
          Running a jewellery shop means juggling everything
        </h2>
        <p className="text-lg text-brown-300 leading-relaxed mb-10 max-w-2xl mx-auto">
          Sales, inventory, gold rate fluctuations, BIS compliance, GST filings, customer relationships,
          and vendor settlements — all at once, every single day.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['Manual Billing Errors', 'Compliance Penalties', 'Inventory Mismatch', 'Lost Customer Data'].map((pain, i) => (
            <div
              key={pain}
              className="rounded-xl p-4 border transition-all duration-500"
              style={{
                background: 'rgba(107,58,42,0.04)',
                borderColor: '#e8c990',
                transitionDelay: `${i * 100}ms`,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
              }}
            >
              <div className="text-2xl mb-2">
                {['📝', '⚠️', '📦', '👤'][i]}
              </div>
              <p className="text-sm font-semibold text-brown-500">{pain}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 inline-flex items-center gap-3 px-6 py-3 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(107,58,42,0.08), rgba(201,169,110,0.12))' }}>
          <span className="text-2xl">✨</span>
          <span className="text-brown-500 font-semibold text-sm">Octis brings it all together in one elegant system</span>
        </div>
      </div>
    </section>
  );
}
