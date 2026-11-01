import Image from 'next/image';

export default function TransactionsToIntelligence() {
  const stages = [
    {
      num: '01',
      title: 'RECORD',
      description: 'Every transaction is captured.',
      imageSrc: '/landing/transactions-record-editorial.jpg',
      alt: 'Octis Point-of-Sale ERP billing interface on a modern laptop capturing a gold chain transaction with weights and pricing',
      reverse: false,
    },
    {
      num: '02',
      title: 'CONNECT',
      description: 'Everything works together.',
      imageSrc: '/landing/transactions-connect-editorial.jpg',
      alt: 'Unified Octis ERP tablet platform connected via gold conduits to bullion, scale, accounting ledger, and inventory tray',
      reverse: true,
    },
    {
      num: '03',
      title: 'UNDERSTAND',
      description: 'Octis AI identifies patterns, exceptions and opportunities.',
      imageSrc: '/landing/transactions-understand-editorial.jpg',
      alt: 'Octis Business Intelligence monitor displaying sales velocity trend curve with AI pattern and margin exception alerts',
      reverse: false,
    },
    {
      num: '04',
      title: 'ACT',
      description:
        'AI-assisted recommendations help you decide what to do next, what needs attention, what to sell, whom to follow up with and what to buy.',
      imageSrc: '/landing/transactions-act-editorial.jpg',
      alt: 'Octis Executive Decision Center on a laptop showing AI restock recommendation and purchase order approval workflow',
      reverse: true,
    },
  ];

  return (
    <div className="mb-28 sm:mb-36">
      {/* ======================================================== */}
      {/* SECTION HEADER & INTRODUCTORY NARRATIVE                   */}
      {/* ======================================================== */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5 text-[#1a2f4a]">
          From Transactions to Intelligence
        </h2>
        <div className="text-base sm:text-lg text-brown-600/90 max-w-2xl mx-auto leading-relaxed space-y-1.5 font-light">
          <p>Every sale, purchase, payment and stock movement creates a signal.</p>
          <p className="text-[#1a2f4a] font-medium">Octis connects those signals to show you what they mean.</p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* EDITORIAL NARRATIVE JOURNEY: 4 DISTINCT VISUAL STAGES      */}
      {/* ======================================================== */}
      <div className="space-y-16 sm:space-y-24 max-w-6xl mx-auto">
        {stages.map((stage, idx) => (
          <div
            key={stage.num}
            className={`flex flex-col ${
              stage.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
            } items-center gap-8 sm:gap-12 lg:gap-16`}
          >
            {/* Visual Canvas (Generous Editorial Photography) */}
            <div className="w-full lg:w-7/12 flex-shrink-0">
              <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-brown-900/10 border border-gold-200/60 bg-[#FAF8F4] group">
                <Image
                  src={stage.imageSrc}
                  alt={stage.alt}
                  width={1280}
                  height={960}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="!h-auto !w-full aspect-[4/3] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>
            </div>

            {/* Narrative Text Column */}
            <div className="w-full lg:w-5/12 flex flex-col justify-center">
              <div className="max-w-md">
                <span className="font-display text-4xl sm:text-5xl font-light text-[#c9a96e] select-none block mb-3">
                  {stage.num}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1a2f4a] tracking-tight mb-4">
                  {stage.title}
                </h3>
                <p className="text-base sm:text-lg text-brown-600 leading-relaxed font-light">
                  {stage.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
