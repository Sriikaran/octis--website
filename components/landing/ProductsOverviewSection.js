import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShoppingBag, Scale, Coins } from 'lucide-react';

const CENTER = { x: 500, y: 270 };

const products = [
  {
    id: 'jewellery-erp',
    href: '/products#jewellery-erp',
    name: 'Octis Jewellery ERP',
    short: 'Jewellery ERP',
    tagline: 'Retail Showroom Operations & Intelligence',
    description:
      'Complete cloud-based enterprise suite engineered specifically for Indian retail jewellery showrooms. Unify billing, metal balances, karigar tracking, and AI insights.',
    capabilities: [
      'Touch POS, barcode scanning & split payment billing',
      'BIS & HUID compliance with audit-ready records',
      'Karigar job tracking & workshop metal loss calculations',
      'Customer gold & silver monthly savings schemes',
      '100+ BI reports & AI dead-stock velocity alerts',
    ],
    icon: ShoppingBag,
    accent: '#9a7209',
    x: 50,
    y: 20,
    labelPlace: 'above',
    d: 'M 500 270 Q 330 96 500 104',
  },
  {
    id: 'pawnify',
    href: '/products#pawnify',
    name: 'Pawnify',
    short: 'Pawnify',
    tagline: 'Gold & Silver Loan Broker Platform',
    description:
      'Purpose-built loan broker management system (Girvi) enforcing RBI regulatory compliance, multi-item appraisals, simple interest engines, and vault custody.',
    capabilities: [
      'Multi-item gold & silver purity appraisal & net weight',
      'Automated RBI LTV tier enforcement (up to 85%, 80%, 75%)',
      'Aadhaar / PAN KYC validation with ₹50k regulatory checks',
      'Zero-drift Actual/365 simple interest accrual engine',
      'Atomic repayment waterfall (charges → interest → principal)',
    ],
    icon: Scale,
    accent: '#2f4d73',
    x: 24,
    y: 82,
    labelPlace: 'below',
    d: 'M 500 270 Q 220 430 240 426',
  },
  {
    id: 'bulion',
    href: '/products#bulion',
    name: 'Bulion',
    short: 'Bulion',
    tagline: 'Physical Bullion Inventory & Rate Locks',
    description:
      'Real-time physical bullion trading and metal inventory ERP. Manage live market quotes, standalone customer rate reservation blocks, and two-way deal settlement.',
    capabilities: [
      'Physical on-hand vs. Available-to-Sell stock segregation',
      'Live market reference rate feeds & dynamic margin rules',
      'Customer rate reservation blocks with automatic expiration timers',
      'Two-way buy / sell deals with delivery & receipt reconciliation',
      'Zero negative stock enforcement & running metal ledgers',
    ],
    icon: Coins,
    accent: '#6d655c',
    x: 76,
    y: 82,
    labelPlace: 'below',
    d: 'M 500 270 Q 780 430 760 426',
  },
];

function ProductDetail({ product, href }) {
  const Name = href ? Link : 'p';
  return (
    <div className="eco-fade mx-auto max-w-xl text-left">
      <Name
        {...(href ? { href } : {})}
        className={`font-display text-2xl text-[#1a2f4a] ${href ? 'underline decoration-[#c9a96e] underline-offset-4' : ''}`}
      >
        {product.name}
      </Name>
      <p className="mt-1 text-sm text-[#9a7209]">{product.tagline}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#4a2518]/90">{product.description}</p>
      <ul className="mt-4 space-y-1.5">
        {product.capabilities.map((item) => (
          <li key={item} className="flex gap-2.5 text-[13px] leading-snug text-[#1a2f4a]/80">
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: product.accent }} aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NodeFace({ product, active, size, stacked = false }) {
  const Icon = product.icon;
  const on = active === product.id;
  const face = (
    <span
      className={`flex items-center justify-center rounded-full bg-[#faf8f4] transition duration-300 group-focus-visible:ring-2 group-focus-visible:ring-[#1a2f4a] group-focus-visible:ring-offset-4 ${size} ${on ? 'scale-[1.04]' : ''}`}
      style={{
        boxShadow: on
          ? `0 0 0 1.5px ${product.accent}, 0 10px 28px rgba(26,47,74,0.08)`
          : '0 0 0 1px rgba(26,47,74,0.12), 0 8px 22px rgba(26,47,74,0.05)',
      }}
    >
      <Icon className="h-6 w-6" style={{ color: product.accent }} aria-hidden="true" />
    </span>
  );

  if (stacked) {
    return (
      <>
        {face}
        <span className="mt-2 text-[13px] font-semibold tracking-tight text-[#1a2f4a]">{product.short}</span>
      </>
    );
  }

  return (
    <>
      {face}
      <span
        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[13px] font-semibold tracking-tight text-[#1a2f4a] ${
          product.labelPlace === 'above' ? 'bottom-full mb-3' : 'top-full mt-3'
        }`}
      >
        {product.short}
      </span>
    </>
  );
}

export default function ProductsOverviewSection() {
  const router = useRouter();
  const [active, setActive] = useState(null);
  const selected = products.find((product) => product.id === active) || null;

  function onMobileTap(product) {
    if (active === product.id) {
      router.push(product.href);
      return;
    }
    setActive(product.id);
  }

  return (
    <section id="products" className="octis-ecosystem bg-[#faf8f4] py-16 lg:py-20" onMouseLeave={() => setActive(null)}>
      <style>{`
        @keyframes ecoFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes ecoDrift {
          from { offset-distance: 0%; }
          to { offset-distance: 100%; }
        }
        .eco-fade { animation: ecoFade 280ms ease; }
        @media (prefers-reduced-motion: reduce) {
          .eco-fade { animation: none; }
          .flow-dot { display: none; }
        }
      `}</style>

      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-6 max-w-2xl text-center md:mb-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9a7209]">
            Octis Product Ecosystem
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#1a2f4a]">
            Three Specialized Products. One Unified Technology Standard.
          </h2>
        </div>

        <div className="relative mx-auto hidden aspect-[1000/520] w-full max-w-4xl md:block">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 520" aria-hidden="true">
            <circle cx={CENTER.x} cy={CENTER.y} r="74" fill="none" stroke="rgba(201,169,110,0.4)" strokeWidth="1" />
            {products.map((product) => {
              const on = active === product.id;
              return (
                <g key={product.id}>
                  <path
                    d={product.d}
                    fill="none"
                    stroke={on ? product.accent : 'rgba(26,47,74,0.16)'}
                    strokeWidth={on ? 1.7 : 1}
                    strokeLinecap="round"
                  />
                  {[0, 4.2].map((begin) => (
                    <circle key={begin} r={on ? 2.6 : 2} className="flow-dot" fill={on ? product.accent : '#c9a96e'} opacity={on ? 0.9 : 0.55}>
                      <animateMotion dur="9s" begin={`${begin}s`} repeatCount="indefinite" path={product.d} />
                    </circle>
                  ))}
                </g>
              );
            })}
          </svg>

          <div
            className="absolute z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#1a2f4a] text-[#f6edd9]"
            style={{ left: '50%', top: '51.9%', boxShadow: '0 0 0 7px rgba(201,169,110,0.16), 0 16px 40px rgba(26,47,74,0.12)' }}
            onMouseEnter={() => setActive(null)}
          >
            <span className="font-display text-xl tracking-[0.18em]">OCTIS</span>
          </div>

          {products.map((product) => {
            const dimmed = active && active !== product.id;
            return (
              <Link
                key={product.id}
                href={product.href}
                aria-label={`${product.name}. ${product.tagline}`}
                onMouseEnter={() => setActive(product.id)}
                onFocus={() => setActive(product.id)}
                className={`absolute z-10 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2f4a] focus-visible:ring-offset-4 ${dimmed ? 'opacity-40' : 'opacity-100'}`}
                style={{ left: `${product.x}%`, top: `${product.y}%` }}
              >
                <NodeFace product={product} active={active} size="h-20 w-20" />
              </Link>
            );
          })}
        </div>

        <div className="mx-auto mt-2 hidden min-h-[4.5rem] max-w-xl md:block">
          {selected ? (
            <ProductDetail product={selected} />
          ) : (
            <p className="eco-fade mx-auto max-w-2xl pt-6 text-center text-pretty text-sm leading-relaxed text-[#4a2518]/85">
              All three products share Octis enterprise security, audit logging, role-based access control, and GST compliance logic.
            </p>
          )}
        </div>

        <div className="mx-auto mt-10 flex max-w-sm flex-col items-center md:hidden">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1a2f4a] text-[#f6edd9] shadow-[0_0_0_7px_rgba(201,169,110,0.16)]">
            <span className="font-display text-xl tracking-[0.16em]">OCTIS</span>
          </div>

          {products.map((product) => {
            const on = active === product.id;
            return (
              <div key={product.id} className="flex w-full flex-col items-center">
                <div className="relative h-12 w-px" style={{ backgroundColor: on ? product.accent : 'rgba(26,47,74,0.16)' }} aria-hidden="true">
                  <span className="flow-dot absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full" style={{ backgroundColor: product.accent, animation: 'ecoDrift 4.5s linear infinite', offsetPath: 'path("M 0 0 V 48")' }} />
                </div>
                <button
                  type="button"
                  aria-expanded={on}
                  aria-label={on ? `Open ${product.name}` : `${product.name}. ${product.tagline}`}
                  onClick={() => onMobileTap(product)}
                  className="group flex flex-col items-center focus-visible:outline-none"
                >
                  <NodeFace product={product} active={active} size="h-16 w-16" stacked />
                </button>
                {on && (
                  <div className="w-full px-2 pb-2 pt-5">
                    <ProductDetail product={product} href={product.href} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center md:mt-2">
          <Link href="/contact" className="text-sm font-semibold text-[#1a2f4a] underline decoration-[#c9a96e]/80 underline-offset-4 hover:decoration-[#9a7209]">
            Consult With Our Team
          </Link>
        </div>
      </div>
    </section>
  );
}
