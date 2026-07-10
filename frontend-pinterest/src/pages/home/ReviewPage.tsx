import PinCard from "@/components/ui/PinCard.tsx";
import { useMemo, useState } from "react";
import { useGetRecommendedPinsQuery } from "@/services/recommendedPinsService.ts";
import { useAppSelector } from "@/store";
import { selectIsAdmin } from "@/store/selectors/authSelectors.ts";
import { useGetMeQuery } from "@/services/accountService.ts";
import { useNavigate } from "react-router";

const PinCardSkeleton = ({ height }: { height: number }) => (
    <div className="break-inside-avoid mb-3 rounded-xl overflow-hidden bg-white/5 animate-pulse"
         style={{ height: `${height}px` }} />
);

const ReviewPage = () => {
    const { data: pins, isLoading, isError } = useGetRecommendedPinsQuery();
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

    const skeletonHeights = useMemo(
        () => Array.from({ length: 12 }, () => Math.floor(Math.random() * 120) + 160),
        []
    );

    return (
        <div className="w-full min-h-full bg-white dark:bg-black px-2 py-4 sm:px-6 sm:py-6">

            {isAdmin && !bannerDismissed && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl w-full max-w-sm mx-4 overflow-hidden shadow-2xl">
                        <div className="h-[3px] bg-[#1DB954]" />
                        <div className="px-7 py-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center shrink-0">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1DB954" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                    </svg>
                                </div>
                                <p className="text-white text-sm font-semibold tracking-tight">Administrator access</p>
                            </div>

                            <p className="text-[#A1A1A1] text-sm leading-relaxed mb-6">
                                Welcome back, <span className="text-white font-medium">{me?.firstName ?? me?.username ?? "Admin"}</span>. You are signed in with administrator privileges.
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => { navigate("/admin"); dismissBanner(); }}
                                    className="flex-1 py-2.5 rounded-xl bg-[#1DB954] hover:bg-[#1aa34a] text-black text-sm font-semibold transition-colors"
                                >
                                    Go to Admin Panel
                                </button>
                                <button
                                    onClick={dismissBanner}
                                    className="px-4 py-2.5 rounded-xl border border-white/10 text-[#A1A1A1] hover:text-white hover:border-white/20 text-sm transition-colors"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isError && (
                <div className="flex items-center justify-center h-40">
                    <p className="text-red-400 text-sm">Failed to load pins.</p>
                </div>
            )}

            {/* Masonry grid */}
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3">
                {isLoading
                    ? skeletonHeights.map((h, i) => <PinCardSkeleton key={i} height={h} />)
                    : pins?.map(pin => <PinCard key={pin.id} pin={pin} />)
                }
            </div>

            {!isLoading && !isError && pins?.length === 0 && (
                <div className="flex items-center justify-center h-40">
                    <p className="text-gray-500 text-sm">No pins yet.</p>
                </div>
            )}
        </div>
    );
};

export default ReviewPage;

