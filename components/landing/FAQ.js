import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { LANDING_FAQS } from "../../lib/landingFaqs";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0); // First item expanded by default

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 md:py-28 landing-surface relative scroll-mt-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <p className="landing-section-label mb-3">FAQ</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4 sm:mb-5 text-foreground">
            Questions from Indian jewellers
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
            Everything you need to know about switching to Octis.
          </p>
        </div>

        <div className="space-y-3">
          {LANDING_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="landing-feature-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left font-semibold text-foreground hover:bg-gold-50/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-t-xl"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-question-${idx}`}
                >
                  <span className="text-base leading-snug">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold-600 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-question-${idx}`}
                    className="px-6 pb-4 text-brown-500 text-sm leading-relaxed border-t border-gold-200/40 pt-3"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
