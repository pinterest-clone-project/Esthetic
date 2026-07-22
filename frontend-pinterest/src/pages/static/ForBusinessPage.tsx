import im3 from "@/assets/defaults/def-3.jpg";
import im6 from "@/assets/defaults/def-6.jpg";
import { useTranslation } from "react-i18next";

const FEATURE_KEYS = ["analytics", "promotedPins", "creatorPartnerships", "brandCollections", "globalReach", "brandSafety"] as const;
const PLAN_KEYS = ["starter", "growth", "enterprise"] as const;

const FEATURE_ICONS: Record<typeof FEATURE_KEYS[number], React.ReactNode> = {
    analytics: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
    ),
    promotedPins: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <path d="M8 21h8M12 17v4"/>
        </svg>
    ),
    creatorPartnerships: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
    ),
    brandCollections: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
    ),
    globalReach: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
    ),
    brandSafety: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
    ),
};

const PLAN_HIGHLIGHT: Record<typeof PLAN_KEYS[number], boolean> = {
    starter: false,
    growth: true,
    enterprise: false,
};

const ForBusinessPage = () => {
    const { t } = useTranslation('static');

    return (
        <div className="text-black dark:text-white min-h-screen">

            <section className="relative h-[420px] overflow-hidden rounded-2xl mx-2 mt-2">
                <img src={im3} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/65" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <span className="text-xs uppercase tracking-widest text-[#1DB954] font-semibold mb-4">{t('business.badge')}</span>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight max-w-2xl">
                        {t('business.hero')}
                    </h1>
                    <p className="text-[#A1A1A1] mt-4 text-base max-w-xl leading-relaxed">
                        {t('business.heroSub')}
                    </p>
                    <button className="mt-8 px-8 py-3 rounded-xl bg-[#1DB954] text-black font-semibold text-sm hover:bg-[#1aa34a] transition">
                        {t('business.getStartedFree')}
                    </button>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-6 py-14">
                <p className="text-xs uppercase tracking-widest text-[#1DB954] font-semibold mb-2 text-center">{t('business.featuresLabel')}</p>
                <h2 className="text-3xl font-bold text-center mb-10">{t('business.featuresTitle')}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURE_KEYS.map((key) => (
                        <div key={key} className="flex flex-col gap-3 border border-[#A1A1A1] dark:border-[#333] rounded-2xl p-6">
                            <div className="text-[#1DB954]">{FEATURE_ICONS[key]}</div>
                            <h3 className="font-semibold text-base">{t(`business.features.${key}.title`)}</h3>
                            <p className="text-sm text-[#A1A1A1] leading-relaxed">{t(`business.features.${key}.text`)}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-6 pb-14 grid md:grid-cols-2 gap-10 items-center">
                <div className="rounded-2xl overflow-hidden h-[280px]">
                    <img src={im6} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                    <p className="text-xs uppercase tracking-widest text-[#1DB954] font-semibold mb-3">{t('business.whyLabel')}</p>
                    <h2 className="text-3xl font-bold leading-tight mb-4">{t('business.whyTitle')}</h2>
                    <p className="text-[#A1A1A1] leading-relaxed">{t('business.whyText1')}</p>
                    <p className="text-[#A1A1A1] leading-relaxed mt-4">{t('business.whyText2')}</p>
                </div>
            </section>

            <section className="bg-[#f5f5f5] dark:bg-[#111] py-14">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-xs uppercase tracking-widest text-[#1DB954] font-semibold mb-2 text-center">{t('business.pricingLabel')}</p>
                    <h2 className="text-3xl font-bold text-center mb-10">{t('business.pricingTitle')}</h2>
                    <div className="grid sm:grid-cols-3 gap-6">
                        {PLAN_KEYS.map((key) => {
                            const highlight = PLAN_HIGHLIGHT[key];
                            const features = t(`business.plans.${key}.features`, { returnObjects: true }) as string[];
                            return (
                                <div key={key} className={`flex flex-col rounded-2xl p-6 border ${
                                    highlight
                                        ? "border-[#1DB954] bg-white dark:bg-[#0d0d0d]"
                                        : "border-[#A1A1A1] dark:border-[#333]"
                                }`}>
                                    {highlight && (
                                        <span className="text-[10px] uppercase tracking-widest text-[#1DB954] font-bold mb-3">{t('business.mostPopular')}</span>
                                    )}
                                    <h3 className="font-bold text-lg">{t(`business.plans.${key}.name`)}</h3>
                                    <div className="flex items-end gap-1 mt-2 mb-3">
                                        <span className="text-3xl font-bold text-[#1DB954]">{t(`business.plans.${key}.price`)}</span>
                                        {key !== "enterprise" && <span className="text-sm text-[#A1A1A1] mb-1">{t('business.perMonth')}</span>}
                                    </div>
                                    <p className="text-sm text-[#A1A1A1] mb-5 leading-relaxed">{t(`business.plans.${key}.desc`)}</p>
                                    <ul className="flex flex-col gap-2 mb-6">
                                        {features.map((feat) => (
                                            <li key={feat} className="flex items-center gap-2 text-sm">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1DB954" strokeWidth="2.5">
                                                    <path d="M20 6L9 17l-5-5"/>
                                                </svg>
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className={`mt-auto w-full py-2.5 rounded-xl text-sm font-semibold transition ${
                                        highlight
                                            ? "bg-[#1DB954] text-black hover:bg-[#1aa34a]"
                                            : "border border-[#A1A1A1] dark:border-[#333] hover:border-[#1DB954] hover:text-[#1DB954]"
                                    }`}>
                                        {key === "enterprise" ? t('business.contactUs') : t('business.getStarted')}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="relative h-[280px] overflow-hidden mx-2 mb-4 mt-0 rounded-2xl">
                <div className="absolute inset-0 bg-black/65" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <h2 className="text-3xl font-bold text-white mb-3">{t('business.ctaTitle')}</h2>
                    <p className="text-[#A1A1A1] text-sm mb-6 max-w-md">{t('business.ctaDesc')}</p>
                    <button className="px-8 py-3 rounded-xl bg-[#1DB954] text-black font-semibold text-sm hover:bg-[#1aa34a] transition">
                        {t('business.startForFree')}
                    </button>
                </div>
            </section>

        </div>
    );
};

export default ForBusinessPage;
