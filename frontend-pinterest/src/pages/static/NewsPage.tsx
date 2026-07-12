import im2 from "@/assets/defaults/def-2.jpg";
import im3 from "@/assets/defaults/def-3.jpg";
import im4 from "@/assets/defaults/def-4.jpg";
import im7 from "@/assets/defaults/def-7.jpg";

const FEATURED = {
    image: im2,
    tag: "Product Update",
    date: "July 10, 2026",
    title: "Introducing Aura 2.0 — Your Creative Identity, Reimagined",
    excerpt: "We've completely rebuilt the Aura experience from the ground up. New layouts, smarter recommendations, and a powerful new editor that puts your aesthetic front and center.",
};

const NEWS = [
    {
        image: im4,
        tag: "For Business",
        date: "June 28, 2026",
        title: "Promoted Pins Now Available in 40 New Markets",
        excerpt: "Esthetic for Business is expanding. Brands in Europe, Asia-Pacific, and Latin America can now run promoted pin campaigns directly from the dashboard.",
    },
    {
        image: im7,
        tag: "Design",
        date: "June 20, 2026",
        title: "Dark Mode Gets a Refresh — Deeper, Crisper, Better",
        excerpt: "We listened to your feedback. The new dark mode is more consistent, easier on the eyes, and beautifully paired with our updated color system.",
    },
];

const TAG_COLORS: Record<string, string> = {
    "Product Update": "bg-[#1DB954]/10 text-[#1DB954]",
    "Community": "bg-blue-500/10 text-blue-400",
    "For Business": "bg-purple-500/10 text-purple-400",
    "Design": "bg-pink-500/10 text-pink-400",
    "Engineering": "bg-orange-500/10 text-orange-400",
    "Partnership": "bg-yellow-500/10 text-yellow-500",
};

const NewsPage = () => {
    return (
        <div className="text-black dark:text-white min-h-screen">

            <section className="relative h-[320px] overflow-hidden rounded-2xl mx-2 mt-2">
                <img src={im3} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/65" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <span className="text-xs uppercase tracking-widest text-[#1DB954] font-semibold mb-4">Esthetic News</span>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                        What's new at Esthetic
                    </h1>
                    <p className="text-[#A1A1A1] mt-4 text-base max-w-xl leading-relaxed">
                        Product updates, community stories, and behind-the-scenes from the team building your favourite visual platform.
                    </p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-6 py-14">

                <div className="mb-12">
                    <p className="text-xs uppercase tracking-widest text-[#1DB954] font-semibold mb-6">Featured</p>
                    <div className="grid md:grid-cols-2 gap-8 border border-[#A1A1A1] dark:border-[#333] rounded-2xl overflow-hidden">
                        <div className="h-[280px] md:h-auto">
                            <img src={FEATURED.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="p-6 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-3">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${TAG_COLORS[FEATURED.tag] ?? "bg-[#333] text-white"}`}>
                                    {FEATURED.tag}
                                </span>
                                <span className="text-xs text-[#A1A1A1]">{FEATURED.date}</span>
                            </div>
                            <h2 className="text-2xl font-bold leading-tight mb-3">{FEATURED.title}</h2>
                            <p className="text-[#A1A1A1] text-sm leading-relaxed">{FEATURED.excerpt}</p>
                            <button className="mt-6 self-start px-5 py-2 rounded-xl border border-[#1DB954] text-[#1DB954] text-sm font-medium hover:bg-[#1DB954] hover:text-black transition">
                                Read more
                            </button>
                        </div>
                    </div>
                </div>


                <p className="text-xs uppercase tracking-widest text-[#1DB954] font-semibold mb-6">Latest</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {NEWS.map((n) => (
                        <div key={n.title} className="flex flex-col border border-[#A1A1A1] dark:border-[#333] rounded-2xl overflow-hidden hover:border-[#1DB954] transition group cursor-pointer">
                            <div className="h-[160px] overflow-hidden">
                                <img src={n.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="" />
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${TAG_COLORS[n.tag] ?? "bg-[#333] text-white"}`}>
                                        {n.tag}
                                    </span>
                                    <span className="text-xs text-[#A1A1A1]">{n.date}</span>
                                </div>
                                <h3 className="font-bold text-sm leading-snug mb-2">{n.title}</h3>
                                <p className="text-xs text-[#A1A1A1] leading-relaxed line-clamp-3">{n.excerpt}</p>
                                <span className="mt-4 text-xs text-[#1DB954] font-medium">Read more →</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsPage;
