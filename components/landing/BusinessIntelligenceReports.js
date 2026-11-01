import {
  FileText,
  TrendingUp,
  Scale,
  ArrowUpDown,
  DollarSign,
  Users,
  CheckCircle,
  BarChart2,
  PieChart,
  Search,
  Layers,
} from 'lucide-react';

export default function BusinessIntelligenceReports() {
  const reports = [
    {
      title: 'Traceability Matrix',
      category: 'Audit & Compliance',
      icon: Layers,
    },
    {
      title: 'Vendor Article Compare',
      category: 'Procurement',
      icon: Scale,
    },
    {
      title: 'Purchase Price Trends',
      category: 'Market Trends',
      icon: TrendingUp,
    },
    {
      title: 'Vendor Capital Tracking',
      category: 'Ledgers & Balances',
      icon: DollarSign,
    },
    {
      title: "See Which Vendor's Stock Is Still Sitting in Your Store",
      category: 'Stock Aging & Velocity',
      icon: Search,
    },
    {
      title: 'Previous Article Price Comparison',
      category: 'Historical Pricing',
      icon: ArrowUpDown,
    },
    {
      title: 'Compare Vendors Before Your Next Purchase',
      category: 'Decision Support',
      icon: Scale,
    },
    {
      title: 'Vendor-Wise Profit & Margin',
      category: 'Unit Profitability',
      icon: PieChart,
    },
    {
      title: 'Customer Purchase History',
      category: 'Client Relations',
      icon: Users,
    },
    {
      title: 'Vendor Purchase Price Trends',
      category: 'Cost Analysis',
      icon: BarChart2,
    },
    {
      title: 'Daily Reconciliation',
      category: 'Showroom Cash & Metal',
      icon: CheckCircle,
    },
    {
      title: 'Profitability',
      category: 'Executive Summary',
      icon: FileText,
    },
  ];

  return (
    <div className="pt-4 sm:pt-8">
      {/* ======================================================== */}
      {/* SECTION HEADING & INTEGRATED 100+ STATISTIC               */}
      {/* ======================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12 mb-12 sm:mb-16">
        {/* Main Heading Hierarchy */}
        <div className="max-w-2xl">
          <p className="landing-section-label mb-3">BUSINESS INTELLIGENCE</p>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1a2f4a] mb-4 leading-[1.15]">
            Stop recording transactions. Start understanding the business.
          </h2>

          <p className="text-base sm:text-lg text-[#334155] leading-relaxed max-w-2xl font-normal">
            Reports are built around jewellery operations, not generic retail.
          </p>
        </div>

        {/* Integrated 100+ Statistic Visual Accent */}
        <div className="pt-6 border-t border-gold-200/60 lg:border-t-0 lg:pt-0 lg:pl-10 lg:border-l lg:border-gold-200/70 flex flex-col justify-end flex-shrink-0">
          <div className="font-display text-5xl sm:text-6xl font-extrabold text-[#855e05] tracking-tight leading-none mb-1.5">
            100+
          </div>
          <div className="text-base sm:text-lg font-bold text-[#1a2f4a] tracking-tight">
            unique business reports
          </div>
          <p className="text-xs sm:text-sm text-[#64748b] mt-1 font-normal">
            Customizable to your business, on request.
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BALANCED 12-REPORT SHOWCASE (3 COLS x 4 ROWS ON DESKTOP) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {reports.map((report, idx) => {
          const IconComp = report.icon;
          return (
            <div
              key={idx}
              className="rounded-xl bg-white border border-gold-200/60 p-5 sm:p-6 flex flex-col justify-between hover:border-gold-300 transition-colors duration-150 shadow-2xs hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#9a7209]">
                    {report.category}
                  </span>
                  <div className="w-7 h-7 rounded-md bg-gold-50/80 border border-gold-200/50 flex items-center justify-center text-[#855e05] flex-shrink-0">
                    <IconComp className="w-3.5 h-3.5" strokeWidth={2} />
                  </div>
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold text-[#1a2f4a] tracking-tight leading-snug">
                  {report.title}
                </h3>
              </div>

              <div className="pt-3 mt-4 border-t border-gold-100/80 flex items-center justify-between text-xs text-[#64748b]">
                <span className="font-mono text-[10px] text-[#855e05]/80 font-medium">
                  OCTIS REPORT #{String(idx + 1).padStart(2, '0')}
                </span>
                <span className="text-[11px] text-[#855e05] font-medium flex items-center gap-1">
                  Ready to run
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

