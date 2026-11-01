import { useEffect, useRef, useState } from 'react';
import { Sun, ShoppingBag, BarChart2 } from 'lucide-react';

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

const steps = [
  {
    icon: Sun,
    time: 'Morning',
    title: 'Set the Day\'s Rate',
    desc: 'Confirm today\'s gold rate — the system auto-prices your entire inventory across 22K, 24K, and 18K.',
    detail: 'One click. All prices updated.',
  },
  {
    icon: ShoppingBag,
    time: 'During Sales',
    title: 'Bill in Seconds',
    desc: 'Scan tag → Add old gold → Apply scheme → Select payment mode → Print GST invoice.',
    detail: 'Average billing time: 90 seconds.',
  },
  {
    icon: BarChart2,
    time: 'Evening',
    title: 'Review & Plan',
    desc: 'View daily reports, track payment breakdowns, reconcile cash, and plan restocking for tomorrow.',
    detail: 'Complete visibility, zero guesswork.',
  },
];

export default function Workflow() {
  const [ref, visible] = useInView();

  return (
    <section id="workflow" className="py-24 bg-cream-100" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#c9a96e' }}>
            How It Works
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-brown-700 mb-4">
            A Day with Octis
          </h2>
          <p className="text-brown-300 max-w-xl mx-auto">
            Three simple touchpoints that transform your daily operations.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2"
            style={{ background: 'linear-gradient(90deg, transparent, #c9a96e, #c9a96e, transparent)' }} />

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div
                key={s.time}
                className="relative bg-white rounded-2xl p-8 border border-gold-100 text-center transition-all duration-600 hover:shadow-xl hover:-translate-y-1"
                style={{
                  transitionDelay: `${i * 150}ms`,
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(24px)',
                }}
              >
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, #c9a96e, #9a7209)' }}>
                  {i + 1}
                </div>

                <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                  style={{ background: 'rgba(107,58,42,0.06)' }}>
                  <s.icon size={24} style={{ color: '#6b3a2a' }} />
                </div>

                <span className="text-xs font-bold tracking-wider uppercase" style={{ color: '#c9a96e' }}>
                  {s.time}
                </span>
                <h3 className="font-semibold text-brown-600 text-lg mt-2 mb-3">{s.title}</h3>
                <p className="text-sm text-brown-300 leading-relaxed mb-4">{s.desc}</p>
                <p className="text-xs font-semibold" style={{ color: '#9a7209' }}>{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
