import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import LandingLayout from '../components/landing/LandingLayout';
import { LANDING_FAQS } from '../lib/landingFaqs';
import {
  Search,
  ChevronDown,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndexes, setOpenIndexes] = useState([0]); // First item open by default

  const toggleIndex = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return LANDING_FAQS;
    const q = searchQuery.toLowerCase();
    return LANDING_FAQS.filter(
      (item) =>
        item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <LandingLayout path="/faq">
      {/* FAQ Page Hero */}
      <section className="relative pt-12 pb-14 md:pt-16 md:pb-20 bg-gradient-to-b from-[#faf8f4] via-cream-50 to-[#faf8f4] border-b border-gold-300/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a2f4a] tracking-tight mb-5 max-w-4xl mx-auto">
            Frequently Asked{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-[#9a7209]">
              Questions
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-brown-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Find immediate answers regarding BIS HUID hallmarking, GST billing, savings scheme management, data migration, and AI intelligence.
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. HUID, GST, migration, AI)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gold-300/60 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Accordion FAQ List */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg font-semibold text-foreground mb-2">
                No matching questions found
              </p>
              <p className="text-sm text-brown-600 mb-6">
                Try searching with different terms or reach out directly to our team.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-lg bg-gold-100 text-primary text-xs font-semibold"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openIndexes.includes(idx);
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-gold-300/40 bg-[#faf8f4] overflow-hidden transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => toggleIndex(idx)}
                      className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-gold-50/50 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="font-display text-base sm:text-lg font-bold text-[#1a2f4a] pr-4">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-gold-600 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-[15px] text-brown-700 leading-relaxed border-t border-gold-200/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Still have questions card */}
          <div className="mt-16 p-8 rounded-2xl bg-cream-50 border border-gold-300/60 shadow-sm text-center">
            <h3 className="font-display text-xl font-bold text-[#1a2f4a] mb-2">
              Still Have Questions?
            </h3>
            <p className="text-sm text-brown-600 max-w-xl mx-auto mb-6">
              Our showroom technology advisors are ready to answer any questions about your specific counter workflows, hardware compatibility, or pricing.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="tel:+917396029339"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a2f4a] text-[#f6edd9] font-semibold text-xs sm:text-sm shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>+91 7396 029 339</span>
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-primary border border-gold-300 font-semibold text-xs sm:text-sm hover:bg-gold-50"
              >
                <span>Write to Us &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}

