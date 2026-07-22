import im2 from "@/assets/defaults/def-2.jpg";
import im3 from "@/assets/defaults/def-3.jpg";
import im5 from "@/assets/defaults/def-5.jpg";
import logo from "@/assets/logo.png";
import { useTranslation } from "react-i18next";

const AboutPage = () => {
    const { t } = useTranslation('static');

    const VALUES = [
        {
            key: "creativeFreedom",
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 21C12 21 3 14 3 8a9 9 0 0 1 18 0c0 6-9 13-9 13z"/>
                    <circle cx="12" cy="8" r="3"/>
                </svg>
            ),
        },
        {
            key: "globalCommunity",
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
            ),
        },
        {
            key: "curatedQuality",
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            ),
        },
        {
            key: "privacyFirst",
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
            ),
        },
    ];

    const STATS = [
        { value: "2", labelKey: "stats.activeCreators" },
        { value: "5", labelKey: "stats.pinsSaved" },
        { value: "5+", labelKey: "stats.countries" },
        { value: "0★", labelKey: "stats.appRating" },
    ];

    return (
        <div className="text-black dark:text-white min-h-screen">

            <section className="relative h-[420px] overflow-hidden rounded-2xl mx-2 mt-2">
                <img src={im3} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <div className="flex items-center gap-3 mb-4">
                        <img src={logo} className="w-10 h-10" alt="" />
                        <span className="text-white text-2xl font-bold tracking-tight">Esthetic</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight max-w-2xl">
                        {t('about.hero')}
                    </h1>
                    <p className="text-[#A1A1A1] mt-4 text-base max-w-xl leading-relaxed">
                        {t('about.heroSub')}
                    </p>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-6 py-14">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {STATS.map((s) => (
                        <div key={s.labelKey} className="flex flex-col items-center text-center border border-[#A1A1A1] dark:border-[#333] rounded-2xl py-6 px-4">
                            <span className="text-3xl font-bold text-[#1DB954]">{s.value}</span>
                            <span className="text-sm text-[#A1A1A1] mt-1">{t(`about.${s.labelKey}`)}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-6 pb-14 grid md:grid-cols-2 gap-10 items-center">
                <div>
                    <p className="text-xs uppercase tracking-widest text-[#1DB954] font-semibold mb-3">{t('about.missionLabel')}</p>
                    <h2 className="text-3xl font-bold leading-tight mb-4">{t('about.missionTitle')}</h2>
                    <p className="text-[#A1A1A1] leading-relaxed">{t('about.missionText1')}</p>
                    <p className="text-[#A1A1A1] leading-relaxed mt-4">{t('about.missionText2')}</p>
                </div>
                <div className="rounded-2xl overflow-hidden h-[280px]">
                    <img src={im2} className="w-full h-full object-cover" alt="" />
                </div>
            </section>

            <section className="bg-[#f5f5f5] dark:bg-[#111] py-14">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-xs uppercase tracking-widest text-[#1DB954] font-semibold mb-2 text-center">{t('about.valuesLabel')}</p>
                    <h2 className="text-3xl font-bold text-center mb-10">{t('about.valuesTitle')}</h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {VALUES.map((v) => (
                            <div key={v.key} className="flex gap-4 border border-[#A1A1A1] dark:border-[#333] rounded-2xl p-6">
                                <div className="text-[#1DB954] shrink-0 mt-0.5">{v.icon}</div>
                                <div>
                                    <h3 className="font-semibold text-base mb-1">{t(`about.values.${v.key}.title`)}</h3>
                                    <p className="text-sm text-[#A1A1A1] leading-relaxed">{t(`about.values.${v.key}.text`)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
                <div className="rounded-2xl overflow-hidden h-[280px]">
                    <img src={im5} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                    <p className="text-xs uppercase tracking-widest text-[#1DB954] font-semibold mb-3">{t('about.storyLabel')}</p>
                    <h2 className="text-3xl font-bold leading-tight mb-4">{t('about.storyTitle')}</h2>
                    <p className="text-[#A1A1A1] leading-relaxed">{t('about.storyText1')}</p>
                    <p className="text-[#A1A1A1] leading-relaxed mt-4">{t('about.storyText2')}</p>
                </div>
            </section>

        </div>
    );
};

export default AboutPage;
