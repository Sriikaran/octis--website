import Link from "next/link";
import { ArrowRight, Phone, Store, Compass, Layers } from "lucide-react";

export default function CTA() {
  const tiers = [
    {
      name: "Starter",
      headline: "Run Your Showroom",
      description: "Manage everyday jewellery operations.",
      details:
        "Point of sale, inventory tagging, GST invoicing, and essential operational reporting without AI complexity.",
      badge: "Everyday POS",
      icon: Store,
    },
    {
      name: "Professional",
      headline: "Run Your Business Smarter",
      description:
        "Turn your jewellery data into actionable insights with AI-powered business intelligence.",
      details:
        "AI business insights, dead stock analysis, profit & margin tracking, vendor intelligence, and customer-facing digital catalogue.",
      badge: "AI Starts Here",
      icon: Compass,
      featured: true,
    },
    {
      name: "Enterprise",
      headline: "Predict. Optimise. Scale.",
      description:
        "Use advanced AI, predictive intelligence, customisation and centralised control to scale your jewellery business.",
      details:
        "Predictive sales insights, AI purchase recommendations, AI catalogue image generation, multi-branch control, and custom workflows.",
      badge: "Scale & Control",
      icon: Layers,
    },
  ];

  return (
    <section id="cta" className="py-20 md:py-28 landing-surface relative scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="landing-cta-panel p-8 sm:p-12 md:p-16 text-center">
          <div className="relative z-10 max-w-4xl mx-auto">
            {/* Headline */}
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-[1.15]">
              Start with Better Software.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-300">
                Grow with Better Intelligence.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-cream-200/85 mb-10 max-w-2xl mx-auto leading-relaxed">
              Whether you are running a single showroom or managing a multi-branch enterprise,
              Octis scales with your business journey.
            </p>

            {/* Three-Tier Value Progression Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 text-left mb-10 items-stretch">
              {tiers.map((tier, idx) => {
                const IconComp = tier.icon;
                return (
                  <div
                    key={idx}
                    className={`p-5 sm:p-6 rounded-xl border flex flex-col justify-between transition-all duration-200 h-full ${
                      tier.featured
                        ? "bg-white/10 border-gold-400/60 shadow-lg shadow-black/20 ring-1 ring-gold-400/30"
                        : "bg-white/5 border-white/10 hover:border-gold-400/30"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gold-300/90 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                          {tier.name}
                        </span>
                        <span className="text-[10px] font-semibold text-cream-200/70 uppercase">
                          {tier.badge}
                        </span>
                      </div>

                      <h3 className="font-display text-lg font-bold text-white mb-1.5 leading-snug">
                        {tier.headline}
                      </h3>

                      <p className="text-xs font-semibold text-gold-200/90 mb-2 leading-relaxed">
                        {tier.description}
                      </p>

                      <p className="text-xs text-cream-200/75 leading-relaxed">
                        {tier.details}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/10">
                      <a
                        href="#pricing"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-300 hover:text-gold-200 transition-colors uppercase tracking-wider group"
                      >
                        <span>Compare in Pricing</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dual Working CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/request-demo"
                className="btn-primary rounded-md h-12 sm:h-13 px-8 text-base shadow-lg shadow-black/20 group inline-flex items-center justify-center"
              >
                <span>Request a Demo</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:+917396029339"
                className="btn-secondary rounded-md h-12 sm:h-13 px-8 text-base inline-flex items-center justify-center"
              >
                <Phone className="w-4 h-4 mr-2" />
                <span>Call Sales: +91 7396 029 339</span>
              </a>
            </div>

            <p className="mt-8 text-xs sm:text-sm text-gold-300/80">
              No credit card required. Free data migration &amp; staff onboarding included.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
