import PinCard from "@/components/ui/PinCard.tsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGetRecommendedPinsQuery } from "@/services/recommendedPinsService.ts";
import type { IPinSummaryResponse } from "@/types/pin/responses/IPinSummaryResponse.ts";
import { useAppSelector } from "@/store";
import { selectIsAdmin } from "@/store/selectors/authSelectors.ts";
import { useGetMeQuery } from "@/services/accountService.ts";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { fadeIn, scaleIn } from "@/lib/motion";
import {APP_ENV} from "@/constants/env";

const PinCardSkeleton = ({ height }: { height: number }) => (
    <div className="rounded-xl overflow-hidden bg-white/5 animate-pulse"
         style={{ height: `${height}px` }} />
);

function useColumnCount() {
    const [count, setCount] = useState(2);

    useEffect(() => {
        const calc = () => {
            const w = window.innerWidth;
            if (w >= 1024) setCount(5);
            else if (w >= 768) setCount(4);
            else if (w >= 640) setCount(3);
            else setCount(2);
        };
        calc();
        window.addEventListener("resize", calc);
        return () => window.removeEventListener("resize", calc);
    }, []);

    return count;
}

const DEFAULT_ASPECT_RATIO = 1; // заглушка (1:1) поки картинка не завантажена
const CARD_CHROME_RATIO = 0.15; // додаткова "вага" на текст/padding під зображенням, у частках від висоти картинки

// Кеш aspect ratio по URL картинки — щоб не перезавантажувати вже виміряні
const aspectRatioCache = new Map<string, number>();

function useAspectRatios(pins: IPinSummaryResponse[]) {
    const [tick, forceRerender] = useState(0);

    useEffect(() => {
        pins.forEach(pin => {
            if (!pin.image || aspectRatioCache.has(pin.image)) return;

            const img = new Image();
            const fullUrl = `${APP_ENV.IMAGES_800_URL}${pin.image}`;

            img.onload = () => {
                aspectRatioCache.set(pin.image, img.naturalWidth / img.naturalHeight);
                forceRerender(x => x + 1);
            };
            img.onerror = () => {
                aspectRatioCache.set(pin.image, DEFAULT_ASPECT_RATIO);
                forceRerender(x => x + 1);
            };
            img.src = fullUrl;
        });
    }, [pins]);

    const getAspectRatio = useCallback((pin: IPinSummaryResponse) => {
        return (pin.image && aspectRatioCache.get(pin.image)) ?? DEFAULT_ASPECT_RATIO;
    }, []);

    return { getAspectRatio, tick };
}

const ReviewPage = () => {
    const { t } = useTranslation('common');
    const isAdmin = useAppSelector(selectIsAdmin);
    const { data: me } = useGetMeQuery();
    const navigate = useNavigate();
    const [bannerDismissed, setBannerDismissed] = useState(
        () => sessionStorage.getItem("adminBannerDismissed") === "true"
    );

    const dismissBanner = () => {
        sessionStorage.setItem("adminBannerDismissed", "true");
        setBannerDismissed(true);
    };

    const columnCount = useColumnCount();

    const skeletonHeights = useMemo(
        () => Array.from({ length: 12 }, () => Math.floor(Math.random() * 120) + 160),
        []
    );

    // --- infinite scroll state ---
    const [page, setPage] = useState(1);
    const [pins, setPins] = useState<IPinSummaryResponse[]>([]);
    const [seed] = useState(() => Math.floor(Math.random() * 1_000_000));
    const { data, isLoading, isFetching, isError } = useGetRecommendedPinsQuery({ page, seed });

    useEffect(() => {
        if (!data) return;
        setPins(prev => page === 1 ? data.items : [...prev, ...data.items]);
    }, [data]);

    const hasMore = data ? data.page < data.totalPages : true;

    const isFetchingRef = useRef(false);
    const hasMoreRef = useRef(true);

    useEffect(() => { isFetchingRef.current = isFetching; }, [isFetching]);
    useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);

    const observerRef = useRef<IntersectionObserver | null>(null);

    const sentinelRef = useCallback((node: HTMLDivElement | null) => {
        observerRef.current?.disconnect();
        if (!node) return;

        observerRef.current = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasMoreRef.current && !isFetchingRef.current) {
                isFetchingRef.current = true;
                setPage(prev => prev + 1);
            }
        }, { rootMargin: "300px" });

        observerRef.current.observe(node);
    }, []);

    useEffect(() => () => observerRef.current?.disconnect(), []);
    // --- end infinite scroll state ---

    // --- masonry по реальному aspect ratio зображень ---
    const { getAspectRatio, tick } = useAspectRatios(pins);

    const columns = useMemo(() => {
        const cols: IPinSummaryResponse[][] = Array.from({ length: columnCount }, () => []);
        const heights = new Array(columnCount).fill(0);

        pins.forEach(pin => {
            const ratio = getAspectRatio(pin);
            const relativeHeight = (1 / ratio) * (1 + CARD_CHROME_RATIO);

            const shortestCol = heights.indexOf(Math.min(...heights));
            cols[shortestCol].push(pin);
            heights[shortestCol] += relativeHeight;
        });

        return cols;
        // tick доданий навмисно: перераховуємо, коли підʼїжджають реальні aspect ratio,
        // а не тільки коли змінюється сам масив pins (наступна сторінка)
    }, [pins, columnCount, getAspectRatio, tick]);

    const skeletonColumns = useMemo(() => {
        const cols: number[][] = Array.from({ length: columnCount }, () => []);
        skeletonHeights.forEach((h, i) => cols[i % columnCount].push(h));
        return cols;
    }, [skeletonHeights, columnCount]);
    // --- end masonry ---

    return (
        <div className="w-full min-h-full bg-white dark:bg-black px-2 py-4 sm:px-6 sm:py-6">

            <AnimatePresence>
                {isAdmin && !bannerDismissed && (
                    <motion.div
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <motion.div
                            className="bg-[#0f0f0f] border border-white/10 rounded-2xl w-full max-w-sm mx-4 overflow-hidden shadow-2xl"
                            variants={scaleIn}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="h-[3px] bg-[#1DB954]" />
                            <div className="px-7 py-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center shrink-0">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1DB954" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                        </svg>
                                    </div>
                                    <p className="text-white text-sm font-semibold tracking-tight">{t('adminBanner.title')}</p>
                                </div>

                                <p className="text-[#A1A1A1] text-sm leading-relaxed mb-6">
                                    {t('adminBanner.welcomePrefix')} <span className="text-white font-medium">{me?.firstName ?? me?.userName ?? "Admin"}</span>{t('adminBanner.welcomeSuffix')}
                                </p>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => { navigate("/admin"); dismissBanner(); }}
                                        className="flex-1 py-2.5 rounded-xl bg-[#1DB954] hover:bg-[#1aa34a] text-black text-sm font-semibold transition-colors"
                                    >
                                        {t('adminBanner.goToPanel')}
                                    </button>
                                    <button
                                        onClick={dismissBanner}
                                        className="px-4 py-2.5 rounded-xl border border-white/10 text-[#A1A1A1] hover:text-white hover:border-white/20 text-sm transition-colors"
                                    >
                                        {t('adminBanner.dismiss')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {isError && (
                <div className="flex items-center justify-center h-40">
                    <p className="text-red-400 text-sm">{t('adminBanner.failedToLoad')}</p>
                </div>
            )}

            {/* Masonry grid — ручний розподіл по реальному aspect ratio зображень */}
            <div className="flex gap-3">
                {isLoading
                    ? skeletonColumns.map((col, colIdx) => (
                        <div key={colIdx} className="flex-1 flex flex-col gap-3">
                            {col.map((h, i) => <PinCardSkeleton key={i} height={h} />)}
                        </div>
                    ))
                    : columns.map((col, colIdx) => (
                        <div key={colIdx} className="flex-1 flex flex-col gap-3">
                            {col.map(pin => <PinCard key={pin.id} pin={pin} />)}
                        </div>
                    ))
                }
            </div>

            {/* Sentinel для довантаження наступної сторінки */}
            {!isLoading && hasMore && (
                <div ref={sentinelRef} className="h-10" />
            )}

            {/* Скелетони під час довантаження наступної сторінки */}
            {isFetching && !isLoading && (
                <div className="flex gap-3 mt-3">
                    {Array.from({ length: columnCount }).map((_, colIdx) => (
                        <div key={colIdx} className="flex-1">
                            <PinCardSkeleton height={skeletonHeights[colIdx % skeletonHeights.length]} />
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && !isError && pins.length === 0 && (
                <div className="flex items-center justify-center h-40">
                    <p className="text-gray-500 text-sm">{t('adminBanner.noPins')}</p>
                </div>
            )}
        </div>
    );
};

export default ReviewPage;