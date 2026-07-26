import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useGetNewsByIdQuery } from "@/services/newsService.ts";
import { APP_ENV } from "@/constants/env";
import { Link } from "react-router";

const TAG_COLORS: Record<string, string> = {
    "Product Update": "bg-[#1DB954]/10 text-[#1DB954]",
    "Community": "bg-blue-500/10 text-blue-400",
    "For Business": "bg-purple-500/10 text-purple-400",
    "Design": "bg-pink-500/10 text-pink-400",
    "Engineering": "bg-orange-500/10 text-orange-400",
    "Partnership": "bg-yellow-500/10 text-yellow-500",
};

const NewsDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation('static');
    const { data: news, isLoading } = useGetNewsByIdQuery(id ?? '', {
        skip: !id,
    });

    const isUk = i18n.language === 'uk';
    const getTitle = (a: { titleUk: string; titleEn: string }) => isUk ? a.titleUk : a.titleEn;
    const getExcerpt = (a: { excerptUk: string; excerptEn: string }) => isUk ? a.excerptUk : a.excerptEn;
    const getImage = (image: string | null) =>
        image ? `${APP_ENV.IMAGES_1200_URL}${image}` : undefined;

    if (isLoading) {
        return (
            <div className="text-black dark:text-white min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-[#1DB954]/30 border-t-[#1DB954] animate-spin" />
            </div>
        );
    }

    if (!news) {
        return (
            <div className="text-black dark:text-white min-h-screen flex items-center justify-center">
                <p className="text-[#A1A1A1]">{t('news.notFound', 'News article not found.')}</p>
            </div>
        );
    }

    return (
        <div className="text-black dark:text-white min-h-screen">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <Link 
                    to="/news" 
                    className="inline-flex items-center gap-2 text-sm text-[#1DB954] hover:opacity-80 transition-opacity mb-8"
                >
                    ← {t('news.backToList', 'Back to News')}
                </Link>

                {getImage(news.image) && (
                    <div className="mb-8 rounded-2xl overflow-hidden">
                        <img 
                            src={getImage(news.image)} 
                            alt={getTitle(news)} 
                            className="w-full h-auto object-cover"
                        />
                    </div>
                )}

                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${TAG_COLORS[news.tag] ?? "bg-[#333] text-white"}`}>
                            {news.tag}
                        </span>
                        <span className="text-xs text-[#A1A1A1]">
                            {new Date(news.publishedAt).toLocaleDateString(i18n.language, { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">{getTitle(news)}</h1>
                    <p className="text-[#A1A1A1] text-base leading-relaxed">{getExcerpt(news)}</p>
                </div>

                {news.content && (
                    <div 
                        className="prose prose-invert max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: news.content ?? '' }}
                    />
                )}
            </div>
        </div>
    );
};

export default NewsDetailPage;
