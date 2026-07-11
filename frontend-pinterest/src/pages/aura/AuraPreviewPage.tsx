import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router";
import {useGetPinByIdQuery, useGetAllPinsQuery, useDeletePinMutation} from "@/services/pinService.ts";
import {useGetMeQuery} from "@/services/accountService.ts";
import {useLikeMutation, useUnlikeMutation} from "@/services/likeService.ts";
import PinCard from "@/components/ui/PinCard.tsx";
import BackButton from "@/components/ui/BackButton.tsx";
import {APP_ENV} from "@/constants/env";
import SaveModal from "@/components/ui/SaveModal.tsx";
import CommentsSection from "@/components/ui/CommentsSection.tsx";
import ReportModal from "@/components/ui/ReportModal.tsx";
import {useTrackViewPinMutation} from "@/services/recommendedPinsService.ts";
import {useToast} from "@/components/ui/Toast/UseToast.ts";

const AuraPreviewPage = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {data: pin, isLoading, isError} = useGetPinByIdQuery(id!);
    const {data: allPins} = useGetAllPinsQuery();
    const {data: me} = useGetMeQuery();

    const [trackView] = useTrackViewPinMutation();
    const { showToast } = useToast();
    const [deletePin] = useDeletePinMutation();
    const [like] = useLikeMutation();
    const [unlike] = useUnlikeMutation();

    const [saveModalOpen, setSaveModalOpen] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);

    useEffect(() => {
        if (pin) {
            trackView(pin.id);
        }
    }, [pin?.id]);

    useEffect(() => {
        window.scrollTo({top: 0, behavior: "instant"});
    }, [id]);

    const isOwner = me?.id === pin?.creatorId;
    const suggestions = allPins?.filter(p => p.id !== id) ?? [];

    const liked = pin?.isLikedByMe ?? false;
    const displayLikesCount = pin?.likesCount ?? 0;

    const handleLike = async () => {
        if (!pin) return;
        if (liked) {
            await unlike(pin.id);
        } else {
            await like(pin.id);
        }
    };

    const handleDelete = async () => {
        if (!pin) return;
        await deletePin(pin.id);
        navigate(-1);
    };

    if (isLoading) return (
        <div className="w-full min-h-full bg-white dark:bg-[#000000] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#4ade80] animate-spin"/>
        </div>
    );

    if (isError || !pin) return (
        <div className="w-full min-h-full bg-white dark:bg-[#000000] flex items-center justify-center">
            <p className="text-red-400 text-sm">Aura not found.</p>
        </div>
    );

    return (
        <div className="w-full min-h-full bg-white dark:bg-[#000000] px-3 py-4 md:px-6 md:py-8">

            <BackButton/>

            {/* Pin detail */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start max-w-4xl mx-auto mb-16">

                {/* Image */}
                <div className="w-full md:w-[360px] md:shrink-0 rounded-2xl overflow-hidden shadow-2xl">
                    <img
                        src={pin.image ? `${APP_ENV.IMAGES_1200_URL}${pin.image}` : ""}
                        alt={pin.title ?? "Aura"}
                        className="w-full block"
                    />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col gap-5 pt-2">

                    {/* Actions row */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleLike}
                                className="flex items-center gap-1.5 text-xs transition-colors group"
                            >
                                <span
                                    className={`transition-colors ${liked ? 'text-[#4ade80]' : 'text-gray-500 group-hover:text-[#4ade80]'}`}>♥</span>
                                <span
                                    className={`transition-colors ${liked ? 'text-white' : 'text-gray-500'}`}>{displayLikesCount}</span>
                            </button>
                            <span className="flex items-center gap-1.5 text-gray-500 text-xs">
                                <span className="text-[#4ade80]">💬</span>
                                {pin.commentsCount}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Save — primary */}
                            <button
                                onClick={() => setSaveModalOpen(true)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4ade80] hover:bg-[#22c55e] text-black text-xs font-semibold transition-all duration-150 shadow-[0_0_12px_rgba(74,222,128,0.25)] hover:shadow-[0_0_18px_rgba(74,222,128,0.4)]"
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                    <polyline points="17 21 17 13 7 13 7 21"/>
                                    <polyline points="7 3 7 8 15 8"/>
                                </svg>
                                Save
                            </button>

                            {/* Share — secondary */}
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        `${window.location.origin}/aura/preview/${pin.id}`
                                    );
                                    showToast("Link copied to clipboard", "success");
                                }}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 dark:hover:bg-white/10 hover:bg-black/5 border dark:border-white/10 dark:hover:border-white/20 border-black/10 hover:border-black/20 dark:text-gray-300 text-gray-700 dark:hover:text-white text-black text-xs font-medium transition-all duration-150"
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                                </svg>
                                Share
                            </button>

                            {isOwner ? (
                                <>
                                    <button
                                        onClick={() => navigate(`/aura/edit/${pin.id}`)}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white text-xs font-medium transition-all duration-150"
                                    >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-400/40 text-red-400 hover:text-red-300 text-xs font-medium transition-all duration-150"
                                    >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"/>
                                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                            <path d="M10 11v6"/><path d="M14 11v6"/>
                                            <path d="M9 6V4h6v2"/>
                                        </svg>
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setReportModalOpen(true)}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-600 hover:text-red-400 hover:bg-red-500/10 text-xs font-medium transition-all duration-150"
                                    title="Report"
                                >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                                        <line x1="4" y1="22" x2="4" y2="15"/>
                                    </svg>
                                    Report
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    {pin.title && (
                        <h1 className="text-black dark:text-white text-2xl font-semibold leading-tight">{pin.title}</h1>
                    )}

                    {/* Creator */}
                    <button
                        onClick={() => navigate(`/user/${pin.creatorId}`)}
                        className="flex items-center gap-2 group w-fit"
                    >
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-white/10 shrink-0">
                            {pin.creatorImage ? (
                                <img src={`${APP_ENV.IMAGES_100_URL}${pin.creatorImage}`} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 bg-white/5">
                                    {pin.creatorName?.[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>
                        <span className="text-gray-400 dark:group-hover:text-white group-hover:text-black text-xs transition-colors">
                            {pin.creatorName ?? "View profile"}
                        </span>
                    </button>

                    {/* Description */}
                    {pin.description && (
                        <p className="text-gray-400 text-sm leading-relaxed">{pin.description}</p>
                    )}

                    {/* Category */}
                    {pin.categoryName && (
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600 text-xs">Category</span>
                            <span className="text-xs text-[#4ade80] bg-[#4ade80]/10 px-2.5 py-1 rounded-full">
                                {pin.categoryName}
                            </span>
                        </div>
                    )}

                    {/* Tags */}
                    {pin.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {pin.tags.map(tag => (
                                <span
                                    key={tag.id}
                                    className="text-xs text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Source URL */}
                    {pin.sourceUrl && (
                        <a
                            href={pin.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-600 hover:text-gray-400 underline underline-offset-2 transition-colors break-all"
                        >
                            {pin.sourceUrl}
                        </a>
                    )}

                    {/* Date */}
                    <p className="text-gray-700 text-xs mt-auto">
                        {new Date(pin.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric", month: "long", year: "numeric"
                        })}
                    </p>

                    {/* Comments */}
                    <div className="mt-2 border-t border-white/5 pt-5">
                        <CommentsSection pinId={pin.id}/>
                    </div>
                </div>
            </div>

            {/* Divider */}
            {suggestions.length > 0 && (
                <>
                    <div className="flex items-center gap-4 mb-6 max-w-4xl mx-auto">
                        <div className="flex-1 h-px bg-white/5"/>
                        <span className="text-gray-600 text-xs tracking-widest uppercase">More Auras</span>
                        <div className="flex-1 h-px bg-white/5"/>
                    </div>

                    {/* Suggestions masonry */}
                    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3">
                        {suggestions.map(p => (
                            <PinCard key={p.id} pin={p}/>
                        ))}
                    </div>
                </>
            )}
            {saveModalOpen && (
                <SaveModal pinId={pin.id} onClose={() => setSaveModalOpen(false)}/>
            )}
            {reportModalOpen && (
                <ReportModal
                    pinId={pin.id}
                    userId={pin.creatorId}
                    onClose={() => setReportModalOpen(false)}
                />
            )}
        </div>
    );
};

export default AuraPreviewPage;
