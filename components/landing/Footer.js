import Image from 'next/image';
import Link from 'next/link';

const productLinks = [
  { href: '/products#jewellery-erp', label: 'Octis Jewellery ERP' },
  { href: '/products#pawnify', label: 'Pawnify' },
  { href: '/products#bulion', label: 'Bulion' },
];

const platformLinks = [
  { href: '/features', label: 'Features & Modules' },
  { href: '/pricing', label: 'Pricing & Plans' },
  { href: '/faq', label: 'Frequently Asked Questions' },
  { href: '/blogs', label: 'Blogs & Insights' },
  { href: '/request-demo', label: 'Schedule a Demo' },
  { href: '/contact', label: 'Contact Advisory' },
  { href: 'https://app.octis.in/login', label: 'Staff Portal Sign In', external: true },
];

const linkClass =
  'group inline-flex text-sm text-[#f5ead8]/80 transition-colors duration-200 hover:text-[#e2cfa2] focus-visible:text-[#e2cfa2] focus-visible:outline-none';

function FooterLink({ href, label, external }) {
  const inner = (
    <span className="relative">
      {label}
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[#e2cfa2] transition-transform duration-200 group-hover:scale-x-100 motion-reduce:transition-none"
      />
    </span>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClass}>
      {inner}
    </Link>
  );
}

function ColumnHeading({ children }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e2cfa2]">
      {children}
      <span aria-hidden="true" className="mt-3 block h-px w-8 bg-[#c9a96e]/80" />
    </h2>
  );
}

export default function Footer({ showDemoBand = true }) {
  return (
    <>
      {showDemoBand && (
      <section id="cta" className="scroll-mt-20 border-t-2 border-[#c9a96e] bg-[#f4ecdc]">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 py-14 md:flex-row md:items-center md:justify-between md:py-16 lg:px-8">
          <div className="max-w-xl">
            <span aria-hidden="true" className="mb-5 block h-px w-12 bg-[#9a7209]" />
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-[#1a2f4a] md:text-4xl">
              Schedule Free Demonstration
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-[#5c3a28] md:text-lg">
              Tell us about your showroom and we’ll arrange a free demonstration.
            </p>
          </div>
          <Link
            href="/request-demo"
            className="group inline-flex h-12 shrink-0 items-center justify-center gap-2.5 border border-[#c9a96e] bg-[#1a2f4a] px-7 text-sm font-semibold tracking-wide text-[#f6edd9] shadow-[0_10px_24px_-16px_rgba(26,47,74,0.9)] transition duration-200 hover:-translate-y-0.5 hover:border-[#e2cfa2] hover:bg-[#243a58] hover:shadow-[0_14px_28px_-14px_rgba(26,47,74,0.85)] motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2f4a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4ecdc]"
          >
            Schedule Free Demonstration
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
      )}

      <footer className="landing-footer pb-10 pt-14 md:pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-16">
            <div>
              <Link
                href="/"
                aria-label="Octis Home"
                className="inline-block border border-white bg-white px-3 py-2 transition-shadow duration-200 hover:shadow-[0_10px_24px_-14px_rgba(226,207,162,0.8)]"
              >
                <Image
                  src="/logo.png"
                  alt="Octis"
                  width={3660}
                  height={1428}
                  className="!h-10 !w-auto max-w-[168px] object-contain object-left"
                />
              </Link>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#f5ead8]/80">
                Unified jewellery enterprise software ecosystem for Indian showrooms, gold loan brokers, and bullion dealers. Connecting daily operations to real-time intelligence.
              </p>
              <p className="mt-4 text-sm text-[#e2cfa2]">BIS, HUID and GST ready.</p>
            </div>

            <div>
              <ColumnHeading>Products</ColumnHeading>
              <ul className="mt-5 space-y-3">
                {productLinks.map((item) => (
                  <li key={item.href}>
                    <FooterLink href={item.href} label={item.label} />
                  </li>
                ))}
                <li>
                  <FooterLink href="/products" label="All products" />
                </li>
              </ul>
            </div>

            <div>
              <ColumnHeading>Platform</ColumnHeading>
              <ul className="mt-5 space-y-3">
                {platformLinks.map((item) => (
                  <li key={item.label}>
                    <FooterLink href={item.href} label={item.label} external={item.external} />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <ColumnHeading>Showroom Advisory</ColumnHeading>
              <ul className="mt-5 space-y-4">
                <li>
                  <a href="tel:+917396029339" className="group block text-[#f5ead8]/80 transition-colors duration-200 hover:text-[#e2cfa2] focus-visible:text-[#e2cfa2] focus-visible:outline-none" aria-label="Call Octis at +91 7396 029 339">
                    <span className="block text-xs uppercase tracking-[0.14em] text-[#e2cfa2]/80">Phone</span>
                    <span className="relative mt-1 inline-block text-sm">
                      +91 7396 029 339
                      <span aria-hidden="true" className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[#e2cfa2] transition-transform duration-200 group-hover:scale-x-100 motion-reduce:transition-none" />
                    </span>
                  </a>
                </li>
                <li>
                  <a href="mailto:hello@octis.in" className="group block text-[#f5ead8]/80 transition-colors duration-200 hover:text-[#e2cfa2] focus-visible:text-[#e2cfa2] focus-visible:outline-none" aria-label="Email Octis at hello@octis.in">
                    <span className="block text-xs uppercase tracking-[0.14em] text-[#e2cfa2]/80">Email</span>
                    <span className="relative mt-1 inline-block text-sm">
                      hello@octis.in
                      <span aria-hidden="true" className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[#e2cfa2] transition-transform duration-200 group-hover:scale-x-100 motion-reduce:transition-none" />
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <p className="mt-14 border-t border-[#e2cfa2]/20 pt-6 text-sm text-[#f5ead8]/60">
            © 2026 Octis Technologies Private Limited. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
