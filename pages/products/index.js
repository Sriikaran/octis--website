import React from 'react';
import LandingLayout from '../../components/landing/LandingLayout';

const products = [
  {
    id: 'jewellery-erp',
    label: 'Showroom',
    name: 'Octis Jewellery ERP',
    accessLabel: 'Access Jewellery ERP',
    summary:
      'Billing, tagged inventory, karigar slips, and savings schemes for an Indian jewellery showroom.',
    points: [
      'Touch billing with old gold, UPI, and split payments',
      'Barcode tags with gross, stone, and net weight',
      'BIS HUID and GST invoices',
      'Karigar metal issue and wastage',
      'Schemes and showroom reports',
    ],
    audience: 'Single showrooms and multi-branch chains',
    image: '/landing/pos-billing-editorial.jpg',
    imageAlt:
      'Jewellery showroom counter with a payment terminal and a bridal necklace on a velvet tray',
    tone: 'light',
    imageSide: 'left',
  },
  {
    id: 'pawnify',
    label: 'Gold loans',
    name: 'Pawnify',
    accessLabel: 'Access Pawnify',
    summary:
      'Pledge appraisal, interest, KYC, and vault custody for pawn brokers and gold-loan counters.',
    points: [
      'Gold and silver appraisal, item by item',
      'RBI loan-to-value limits',
      'Aadhaar and PAN, including the ₹50,000 check',
      'Simple interest on actual/365',
      'Repayment applied to charges, then interest, then principal',
    ],
    audience: 'Pawn brokers and gold-loan counters',
    image: '/landing/inventory-traceability-editorial.jpg',
    imageAlt:
      'Tagged gold pieces on a navy cloth beside a precision scale, loupe, and vault drawers',
    tone: 'dark',
    imageSide: 'right',
  },
  {
    id: 'bulion',
    label: 'Bullion',
    name: 'Bulion',
    accessLabel: 'Access Bulion',
    summary:
      'Vault stock, live rates, and buy-sell settlement for bullion merchants and wholesale desks.',
    points: [
      'Stock on hand, kept separate from what can still be sold',
      'Live rates with premium and discount',
      'Customer rate locks that expire',
      'Buy and sell with delivery receipts',
      'No negative stock, and a running metal ledger',
    ],
    audience: 'Bullion merchants, refiners, and wholesale desks',
    tone: 'light',
    imageSide: 'right',
    metals: [
      { name: 'Fine gold', note: 'On hand and available to sell', swatch: 'bg-gradient-to-br from-[#f6e7c1] via-[#d4b06a] to-[#8d6a32]' },
      { name: 'Standard gold', note: 'Premium and discount on the live rate', swatch: 'bg-gradient-to-br from-[#f0d59a] via-[#c4963e] to-[#7a5a22]' },
      { name: 'Silver', note: 'Locks that close when the timer ends', swatch: 'bg-gradient-to-br from-[#f7f5f1] via-[#c8c4bc] to-[#8e8a84]' },
    ],
  },
];

function AccessButton({ productId, label, dark }) {
  return (
    <button
      type="button"
      data-product-access={productId}
      className={
        dark
          ? 'mt-8 inline-flex h-11 cursor-pointer items-center justify-center rounded-md bg-[#e8d7b0] px-5 text-sm font-semibold text-[#1a2f4a] transition-colors hover:bg-[#f3e6c8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d7b0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a2f4a]'
          : 'mt-8 inline-flex h-11 cursor-pointer items-center justify-center rounded-md bg-[#1a2f4a] px-5 text-sm font-semibold text-[#f7f1e6] transition-colors hover:bg-[#243a58] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2f4a] focus-visible:ring-offset-2'
      }
    >
      {label}
    </button>
  );
}

function ProductVisual({ product, dark }) {
  if (product.metals) {
    return (
      <div className="rounded-2xl bg-[#1a2f4a] px-7 py-8 sm:px-9 sm:py-10 text-[#f7f1e6]">
        <p className="text-sm text-[#e8d7b0]">Physical metal on the desk</p>
        <ul className="mt-8 space-y-5">
          {product.metals.map((metal) => (
            <li key={metal.name}>
              <span className={`block h-12 rounded-lg ${metal.swatch}`} aria-hidden="true" />
              <span className="mt-2.5 block">
                <span className="block font-display text-xl leading-none">{metal.name}</span>
                <span className="mt-1 block text-sm text-white/65">{metal.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <figure className={`overflow-hidden rounded-2xl ${dark ? 'ring-1 ring-white/10' : ''}`}>
      <img
        src={product.image}
        alt={product.imageAlt}
        width={1280}
        height={720}
        loading="lazy"
        decoding="async"
        className="aspect-[4/3] w-full object-cover"
      />
    </figure>
  );
}

export default function ProductsPage() {
  return (
    <LandingLayout path="/products">
      <section className="pt-8 pb-2 md:pt-14">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-sm font-medium text-[#9a7209]">Products</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl sm:text-5xl font-semibold tracking-tight text-[#1a2f4a] leading-[1.12]">
            The showroom, the loan desk, and the bullion floor.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#4a2518]">
            Three products. Each one stands on its own.
          </p>
        </div>
      </section>

      <div className="pb-8 md:pb-16">
        {products.map((product) => {
          const dark = product.tone === 'dark';
          const imageFirst = product.imageSide === 'left';

          return (
            <article
              key={product.id}
              id={product.id}
              className={`scroll-mt-28 ${dark ? 'bg-[#1a2f4a] text-[#f7f1e6]' : ''}`}
            >
              <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">
                <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
                  <div className={`min-w-0 ${imageFirst ? 'md:order-2' : ''}`}>
                    <p className={`text-sm ${dark ? 'text-[#e8d7b0]' : 'text-[#9a7209]'}`}>
                      {product.label}
                    </p>
                    <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
                      {product.name}
            </h2>
                    <p className={`mt-4 text-base leading-relaxed ${dark ? 'text-white/80' : 'text-[#4a2518]'}`}>
                      {product.summary}
                    </p>
                    <ul className="mt-6 space-y-2.5">
                      {product.points.map((point) => (
                        <li
                          key={point}
                          className={`flex gap-3 text-sm leading-snug ${dark ? 'text-white/90' : 'text-[#1a2f4a]'}`}
                        >
                          <span
                            className={`mt-[0.55rem] h-px w-3.5 shrink-0 ${dark ? 'bg-[#e8d7b0]' : 'bg-[#c9a96e]'}`}
                            aria-hidden="true"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <p className={`mt-6 text-sm ${dark ? 'text-white/65' : 'text-[#6b3a2a]'}`}>
                      {product.audience}
                    </p>
                    <AccessButton productId={product.id} label={product.accessLabel} dark={dark} />
          </div>
                  <div className={`min-w-0 ${imageFirst ? 'md:order-1' : ''}`}>
                    <ProductVisual product={product} dark={dark} />
              </div>
            </div>
              </div>
            </article>
          );
        })}
        </div>
    </LandingLayout>
  );
}
