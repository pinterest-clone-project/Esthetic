import im3 from "@/assets/defaults/def-3.jpg";
import im6 from "@/assets/defaults/def-6.jpg";

const FEATURES = [
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
        ),
        title: "Analytics Dashboard",
        text: "Track reach, engagement, and saves across your pins and boards. Understand what resonates with your audience and optimize your content strategy.",
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <path d="M8 21h8M12 17v4"/>
            </svg>
        ),
        title: "Promoted Pins",
        text: "Put your brand in front of the right audience. Our smart targeting delivers your content to users whose aesthetic matches your brand identity.",
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
        title: "Creator Partnerships",
        text: "Connect with top creators on Esthetic whose style aligns with your brand. Build authentic collaborations that feel native to the platform.",
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        ),
        title: "Brand Collections",
        text: "Curate branded mood boards and aura collections that showcase your products in context — the way your customers actually imagine using them.",
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
        ),
        title: "Global Reach",
        text: "Esthetic users span 120+ countries. Reach design-conscious consumers worldwide with localized campaigns and multi-language pin support.",
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
        ),
        title: "Brand Safety",
        text: "Your brand appears in a curated, high-quality environment. Our content moderation ensures your ads are never placed next to inappropriate content.",
    },
];

const PLANS = [
    {
        name: "Starter",
        price: "$49",
        period: "/ month",
        desc: "Perfect for small brands and independent creators just starting out.",
        features: ["Up to 10 promoted pins", "Basic analytics", "Email support", "1 brand account"],
        highlight: false,
    },
    {
        name: "Growth",
        price: "$149",
        period: "/ month",
        desc: "For growing brands ready to scale their presence on Esthetic.",
        features: ["Up to 50 promoted pins", "Advanced analytics", "Priority support", "3 brand accounts", "Creator matching"],
        highlight: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        desc: "Full-scale solutions for agencies and large brands.",
        features: ["Unlimited promoted pins", "Full analytics suite", "Dedicated manager", "Unlimited accounts", "API access", "Custom integrations"],
        highlight: false,
    },
];

const ForBusinessPage = () => {
    return (
        <div className="text-black dark:text-white min-h-screen">

            <section className="relative h-[420px] overflow-hidden rounded-2xl mx-2 mt-2">
                <img src={im3} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/65" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <span className="text-xs uppercase tracking-widest text-[#1DB954] font-semibold mb-4">Esthetic for Business</span>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight max-w-2xl">
                        Grow your brand where taste lives
                    </h1>
                    <p className="text-[#A1A1A1] mt-4 text-base max-w-xl leading-relaxed">
                        Reach millions of design-conscious consumers through the most visually curated platform on the internet.
                    </p>
                    <button className="mt-8 px-8 py-3 rounded-xl bg-[#1DB954] text-black font-semibold text-sm hover:bg-[#1aa34a] transition">
                        Get started free
                    </button>
                </div>
            </section>


            <section className="max-w-4xl mx-auto px-6 py-14">
                <p className="text-xs uppercase tracking-widest text-[#1DB954] font-semibold mb-2 text-center">What you get</p>
                <h2 className="text-3xl font-bold text-center mb-10">Everything your brand needs</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map((f) => (
                        <div key={f.title} className="flex flex-col gap-3 border border-[#A1A1A1] dark:border-[#333] rounded-2xl p-6">
                            <div className="text-[#1DB954]">{f.icon}</div>
                            <h3 className="font-semibold text-base">{f.title}</h3>
                            <p className="text-sm text-[#A1A1A1] leading-relaxed">{f.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-6 pb-14 grid md:grid-cols-2 gap-10 items-center">
                <div className="rounded-2xl overflow-hidden h-[280px]">
                    <img src={im6} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                    <p className="text-xs uppercase tracking-widest text-[#1DB954] font-semibold mb-3">Why Esthetic</p>
                    <h2 className="text-3xl font-bold leading-tight mb-4">The audience you've been looking for</h2>
                    <p className="text-[#A1A1A1] leading-relaxed">
                        Esthetic users are actively seeking inspiration — they're in a discovery mindset, open to new brands and products that match their aesthetic. That makes them the most receptive audience for visual marketing.
                    </p>
                    <p className="text-[#A1A1A1] leading-relaxed mt-4">
                        Unlike other platforms, our users save and revisit content. Your promoted pin doesn't disappear in a feed — it becomes part of someone's mood board.
                    </p>
                </div>
            </section>

            <section className="bg-[#f5f5f5] dark:bg-[#111] py-14">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-xs uppercase tracking-widest text-[#1DB954] font-semibold mb-2 text-center">Pricing</p>
                    <h2 className="text-3xl font-bold text-center mb-10">Simple, transparent plans</h2>
                    <div className="grid sm:grid-cols-3 gap-6">
                        {PLANS.map((p) => (
                            <div key={p.name} className={`flex flex-col rounded-2xl p-6 border ${
                                p.highlight
                                    ? "border-[#1DB954] bg-white dark:bg-[#0d0d0d]"
                                    : "border-[#A1A1A1] dark:border-[#333]"
                            }`}>
                                {p.highlight && (
                                    <span className="text-[10px] uppercase tracking-widest text-[#1DB954] font-bold mb-3">Most popular</span>
                                )}
                                <h3 className="font-bold text-lg">{p.name}</h3>
                                <div className="flex items-end gap-1 mt-2 mb-3">
                                    <span className="text-3xl font-bold text-[#1DB954]">{p.price}</span>
                                    <span className="text-sm text-[#A1A1A1] mb-1">{p.period}</span>
                                </div>
                                <p className="text-sm text-[#A1A1A1] mb-5 leading-relaxed">{p.desc}</p>
                                <ul className="flex flex-col gap-2 mb-6">
                                    {p.features.map((feat) => (
                                        <li key={feat} className="flex items-center gap-2 text-sm">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1DB954" strokeWidth="2.5">
                                                <path d="M20 6L9 17l-5-5"/>
                                            </svg>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                                <button className={`mt-auto w-full py-2.5 rounded-xl text-sm font-semibold transition ${
                                    p.highlight
                                        ? "bg-[#1DB954] text-black hover:bg-[#1aa34a]"
                                        : "border border-[#A1A1A1] dark:border-[#333] hover:border-[#1DB954] hover:text-[#1DB954]"
                                }`}>
                                    {p.name === "Enterprise" ? "Contact us" : "Get started"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            <section className="relative h-[280px] overflow-hidden mx-2 mb-4 mt-0 rounded-2xl">
                <div className="absolute inset-0 bg-black/65" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <h2 className="text-3xl font-bold text-white mb-3">Ready to grow on Esthetic?</h2>
                    <p className="text-[#A1A1A1] text-sm mb-6 max-w-md">Join thousands of brands already reaching their audience through visual storytelling.</p>
                    <button className="px-8 py-3 rounded-xl bg-[#1DB954] text-black font-semibold text-sm hover:bg-[#1aa34a] transition">
                        Start for free
                    </button>
                </div>
            </section>

        </div>
    );
};

export default ForBusinessPage;
