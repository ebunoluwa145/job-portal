export const StatsBar = () => {
    // These are static for now, as discussed
    const stats = [
        { label: "Active Jobs", value: "12,400+" },
        { label: "Verified Companies", value: "3,200+" },
        { label: "Registered Talents", value: "480k+" },
        { label: "Response Rate", value: "94%" },
    ];

    return (
        <div className="bg-white border-b border-slate-100 py-6 mb-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-wrap items-center justify-center md:justify-center gap-x-12 gap-y-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex items-baseline gap-2 group">
                            {/* Value: Bold and Dark */}
                            <span className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {stat.value}
                            </span>
                            {/* Label: Small, Uppercase, Muted */}
                            <span className="text-[10px] uppercase tracking-[0.12em] font-bold text-slate-400">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};