export const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Create Profile",
      desc: "Sign up and showcase your tech stack and experience to top employers."
    },
    {
      number: "02",
      title: "Apply & Track",
      desc: "Apply to vetted roles and track your application status in real-time."
    },
    {
      number: "03",
      title: "Get Hired",
      desc: "Ace your interviews and land your dream role in Nigeria's tech ecosystem."
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-aventon-dark uppercase tracking-tighter mb-4">
          How it Works
        </h2>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
          Your 3-step path to a new career
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {steps.map((step) => (
          <div key={step.number} className="relative group">
            <div className="text-8xl font-black text-slate-50 absolute -top-10 -left-4 z-0 group-hover:text-green-50 transition-colors">
              {step.number}
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-black text-aventon-dark uppercase tracking-tight mb-4">
                {step.title}
              </h3>
              <p className="text-slate-500 font-bold text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};