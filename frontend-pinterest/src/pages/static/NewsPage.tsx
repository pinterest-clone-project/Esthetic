import im2 from "@/assets/defaults/def-2.jpg";
import im3 from "@/assets/defaults/def-3.jpg";
import im4 from "@/assets/defaults/def-4.jpg";
import im7 from "@/assets/defaults/def-7.jpg";
import { useTranslation } from "react-i18next";

const TAG_COLORS: Record<string, string> = {
    "Product Update":     "bg-[#1DB954]/10 text-[#1DB954]",
    "Оновлення продукту": "bg-[#1DB954]/10 text-[#1DB954]",
    "Community":          "bg-blue-500/10 text-blue-400",
    "For Business":       "bg-purple-500/10 text-purple-400",
    "Для бізнесу":        "bg-purple-500/10 text-purple-400",
    "Design":             "bg-pink-500/10 text-pink-400",
    "Дизайн":             "bg-pink-500/10 text-pink-400",
    "Engineering":        "bg-orange-500/10 text-orange-400",
    "Partnership":        "bg-yellow-500/10 text-yellow-500",
};

const NEWS_IMAGES = [im4, im7];

const NewsPage = () => {
    const { t } = useTranslation('static');

    const featured = t('news.featured_article', { returnObjects: true }) as {
        tag: string; date: string; title: string; excerpt: string;
    };

    const articles = t('news.articles', { returnObjects: true }) as {
        tag: string; date: string; title: string; excerpt: string;
    }[];

    return (
        <div className="text-black dark:text-white min-h-screen">

            <section className="relative h-[320px] overflow-hidden rounded-2xl mx-2 mt-2">
                <img src={im3} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/65" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <span className="text-xs uppercase tracking-widest text-[#1DB954] font-semibold mb-4">{t('news.badge')}</span>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                        {t('news.hero')}
                    </h1>
                    <p className="text-[#A1A1A1] mt-4 text-base max-w-xl leading-relaxed">
                        {t('news.heroSub')}
                    </p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-6 py-14">

                <div className="mb-12">
                    <p className="text-xs uppercase tracking-widest text-[#1DB954] font-semibold mb-6">{t('news.featured')}</p>
                    <div className="grid md:grid-cols-2 gap-8 border border-[#A1A1A1] dark:border-[#333] rounded-2xl overflow-hidden">
                        <div className="h-[280px] md:h-auto">
                            <img src={im2} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="p-6 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-3">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${TAG_COLORS[featured.tag] ?? "bg-[#333] text-white"}`}>
                                    {featured.tag}
                                </span>
                                <span className="text-xs text-[#A1A1A1]">{featured.date}</span>
                            </div>
                            <h2 className="text-2xl font-bold leading-tight mb-3">{featured.title}</h2>
                            <p className="text-[#A1A1A1] text-sm leading-relaxed">{featured.excerpt}</p>
                            <button className="mt-6 self-start px-5 py-2 rounded-xl border border-[#1DB954] text-[#1DB954] text-sm font-medium hover:bg-[#1DB954] hover:text-black transition">
                                {t('news.readMore')}
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-xs uppercase tracking-widest text-[#1DB954] font-semibold mb-6">{t('news.latest')}</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((n, i) => (
                        <div key={i} className="flex flex-col border border-[#A1A1A1] dark:border-[#333] rounded-2xl overflow-hidden hover:border-[#1DB954] transition group cursor-pointer">
                            <div className="h-[160px] overflow-hidden">
                                <img src={NEWS_IMAGES[i]} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="" />
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
                                <span className="mt-4 text-xs text-[#1DB954] font-medium">{t('news.readMoreArrow')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsPage;
