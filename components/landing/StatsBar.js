const stats = [
  { label: 'Active Jewelers', value: '500+' },
  { label: 'Daily Transactions', value: '10,000+' },
  { label: 'System Uptime', value: '99.99%' },
  { label: 'Support SLA', value: '< 15 mins' },
];

export default function StatsBar() {
  return (
    <section className="py-8 md:py-10 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {stats.map((s) => (
            <div key={s.label} className="landing-stat-card px-4 py-5 md:py-6 text-center">
              <p className="text-2xl md:text-3xl font-bold text-[#1a2f4a] tabular-nums mb-1">{s.value}</p>
              <p className="text-xs md:text-sm font-medium text-brown-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
