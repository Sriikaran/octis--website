import React from 'react';
import Link from 'next/link';
import LandingLayout from '../components/landing/LandingLayout';
import Pricing from '../components/landing/Pricing';
import { HelpCircle, Shield, ArrowRight, CheckCircle2, Phone, Mail } from 'lucide-react';

export default function PricingPage() {
  const guarantees = [
    {
      title: 'Free Data Migration',
      desc: 'Our engineering team migrates your existing customer ledger, inventory tags, and historical stock data from legacy software with zero downtime.',
    },
    {
      title: '30-Day Onboarding Support',
      desc: 'Dedicated on-site or remote staff training so your billing counters and inventory managers are 100% confident from day one.',
    },
    {
      title: 'No Hidden Lock-Ins',
      desc: 'Transparent pricing with no unexpected per-bill transaction taxes or arbitrary charges. Your data belongs entirely to you.',
    },
  ];

  return (
    <LandingLayout path="/pricing">
      <Pricing />

      {/* Onboarding & Migration Guarantees */}
      <section className="py-16 bg-white border-t border-gold-300/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1a2f4a] mb-3">
              Included With Every Implementation
            </h2>
            <p className="text-sm text-brown-600">
              We ensure your showroom transitions smoothly without interrupting daily billing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guarantees.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#faf8f4] border border-gold-300/40 shadow-xs"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-700 mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-display text-base font-bold text-[#1a2f4a] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-brown-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Need Custom Proposal */}
          <div className="mt-14 p-8 rounded-2xl bg-cream-50 border border-gold-300/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-xl font-bold text-[#1a2f4a] mb-1">
                Need a Custom Multi-Branch or Enterprise Quote?
              </h3>
              <p className="text-xs sm:text-sm text-brown-600">
                Speak directly with an Octis solutions specialist for chain licensing, custom karigar workflows, or private cloud hosting.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/contact"
                className="px-6 py-2.5 rounded-xl bg-[#1a2f4a] text-[#f6edd9] hover:bg-[#243a58] text-xs sm:text-sm font-semibold shadow-sm transition-all"
              >
                Request Custom Proposal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}

