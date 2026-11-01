import { Award, FileCheck, AlertTriangle } from "lucide-react";

export default function Compliance() {
  const cards = [
    {
      icon: Award,
      title: "BIS Hallmarking & HUID",
      description:
        "Built-in support for mandatory HUID tracking. Print compliant tags and maintain digital records for audits effortlessly.",
    },
    {
      icon: FileCheck,
      title: "IT Act & KYC Rules",
      description:
        "The system automatically prompts cashiers to collect PAN/Aadhaar details for any transaction exceeding ₹2 lakh.",
    },
    {
      icon: AlertTriangle,
      title: "PMLA / FIU Reporting",
      description:
        "Stay compliant with anti-money laundering laws. Automatically flag and log cash transactions exceeding ₹10 lakh.",
    },
  ];

  return (
    <section id="compliance" className="py-20 md:py-28 landing-surface relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <p className="landing-section-label mb-3">Strictly Compliant</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4 sm:mb-5 text-foreground">
            Built for Indian Jewellery Regulations
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
            Government regulations change fast. Octis stays ahead, ensuring your business operates
            legally and without fear of penalties.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {cards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <div key={idx} className="landing-feature-card p-8 group">
                <div className="w-14 h-14 rounded-xl icon-gradient-gold flex items-center justify-center mb-6 group-hover:scale-105 transition-transform text-white">
                  <IconComponent className="w-7 h-7" strokeWidth={2} />
                </div>
                <h4 className="font-semibold text-xl text-foreground mb-3">{card.title}</h4>
                <p className="text-brown-500 leading-relaxed text-sm">{card.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
