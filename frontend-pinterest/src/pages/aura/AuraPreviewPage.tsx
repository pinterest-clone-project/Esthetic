import {useEffect, useRef, useState} from "react";
import {useParams, useNavigate} from "react-router";
import {useGetPinByIdQuery, useGetAllPinsQuery, useDeletePinMutation} from "@/services/pinService.ts";
import {useGetMeQuery} from "@/services/accountService.ts";
import {useLikeMutation, useUnlikeMutation} from "@/services/likeService.ts";
import PinCard from "@/components/ui/PinCard.tsx";
import {APP_ENV} from "@/constants/env";
import SaveModal from "@/components/ui/SaveModal.tsx";
import CommentsSection from "@/components/ui/CommentsSection.tsx";
import ReportModal from "@/components/ui/ReportModal.tsx";
import {useTrackViewPinMutation} from "@/services/recommendedPinsService.ts";
import {useToast} from "@/components/ui/Toast/UseToast.ts";
import { useTranslation } from "react-i18next";

const AuraPreviewPage = () => {
    const { t, i18n } = useTranslation('pins');
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
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [menuOpen]);

    useEffect(() => {
        if (pin) {
            trackView(pin.id);
        }
    }, [pin?.id]);

    useEffect(() => {
        document.querySelector("main")?.scrollTo({ top: 0, behavior: "instant" });
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

    const handleDownload = async () => {
        if (!pin?.image) return;
        const url = `${APP_ENV.IMAGES_1200_URL}${pin.image}`;
        const fileName = (pin.title ?? "aura").replace(/\s+/g, "-").toLowerCase();
        const blob = await fetch(url).then(r => r.blob());
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(blobUrl);
    };

    const handleDelete = () => {
        setConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!pin) return;
        await deletePin(pin.id);
        setConfirmDeleteOpen(false);
        navigate(-1);
    };

    if (isLoading) return (
        <div className="w-full min-h-full bg-white dark:bg-[#000000] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#4ade80] animate-spin"/>
        </div>
    );

    if (isError || !pin) return (
        <div className="w-full min-h-full bg-white dark:bg-[#000000] flex items-center justify-center">
            <p className="text-red-400 text-sm">{t('preview.notFound')}</p>
        </div>
    );

    return (
        <div className="w-full min-h-full bg-white dark:bg-[#000000] px-3 py-4 md:px-6 md:py-8">

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
                    <div className="flex items-center justify-between gap-3">
                        {/* Stats */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleLike}
                                className="flex items-center gap-1.5 text-xs transition-colors group"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-colors ${liked ? 'text-[#4ade80]' : 'text-gray-500 group-hover:text-[#4ade80]'}`}>
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                </svg>
                                <span className={`transition-colors ${liked ? 'text-white' : 'text-gray-500'}`}>{displayLikesCount}</span>
                            </button>
                            <span className="flex items-center gap-1.5 text-gray-500 text-xs">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4ade80]">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                </svg>
                                {pin.commentsCount}
                            </span>
                        </div>

                        {/* Primary + kebab */}
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
                                {t('preview.save')}
                            </button>

                            {/* Kebab menu */}
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setMenuOpen(o => !o)}
                                    className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 dark:text-gray-300 text-gray-600 hover:text-black dark:hover:text-white transition-all duration-150"
                                    aria-label="More options"
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                        <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                                    </svg>
                                </button>

                                {menuOpen && (
                                    <div className="absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-xl shadow-xl z-20 overflow-hidden py-1">
                                        {/* Download */}
                                        <button
                                            onClick={() => { handleDownload(); setMenuOpen(false); }}
                                            className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors"
                                        >
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="7 10 12 15 17 10"/>
                                                <line x1="12" y1="15" x2="12" y2="3"/>
                                            </svg>
                                            {t('preview.download')}
                                        </button>

                                        {/* Share */}
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.origin}/aura/preview/${pin.id}`);
                                                showToast(t('preview.linkCopied'), "success");
                                                setMenuOpen(false);
                                            }}
                                            className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors"
                                        >
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                                            </svg>
                                            {t('preview.share')}
                                        </button>

                                        {isOwner ? (
                                            <>
                                                <div className="h-px bg-black/5 dark:bg-white/5 my-1"/>
                                                {/* Edit */}
                                                <button
                                                    onClick={() => { navigate(`/aura/edit/${pin.id}`); setMenuOpen(false); }}
                                                    className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors"
                                                >
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                    </svg>
                                                    {t('preview.edit')}
                                                </button>
                                                {/* Delete */}
                                                <button
                                                    onClick={() => { handleDelete(); setMenuOpen(false); }}
                                                    className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                                >
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6"/>
                                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                                        <path d="M10 11v6"/><path d="M14 11v6"/>
                                                        <path d="M9 6V4h6v2"/>
                                                    </svg>
                                                    {t('preview.delete')}
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="h-px bg-black/5 dark:bg-white/5 my-1"/>
                                                {/* Report */}
                                                <button
                                                    onClick={() => { setReportModalOpen(true); setMenuOpen(false); }}
                                                    className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                                >
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                                                        <line x1="4" y1="22" x2="4" y2="15"/>
                                                    </svg>
                                                    {t('preview.report')}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
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
                            {pin.creatorName ?? t('preview.viewProfile')}
                        </span>
                    </button>

                    {/* Description */}
                    {pin.description && (
                        <p className="text-gray-400 text-sm leading-relaxed">{pin.description}</p>
                    )}

                    {/* Category */}
                    {pin.categoryName && (
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600 text-xs">{t('preview.category')}</span>
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
                        {new Date(pin.createdAt).toLocaleDateString(i18n.language, {
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
                        <span className="text-gray-600 text-xs tracking-widest uppercase">{t('preview.moreAuras')}</span>
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
            {confirmDeleteOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                    onClick={() => setConfirmDeleteOpen(false)}
                >
                    <div
                        className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-72 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-white text-sm font-medium mb-1">{t('preview.deleteConfirmTitle')}</p>
                        <p className="text-gray-400 text-xs mb-3">{t('preview.deleteConfirmDesc')}</p>
                        <button
                            onClick={() => { setConfirmDeleteOpen(false); navigate("/deleted-auras"); }}
                            className="flex items-center gap-1.5 text-[11px] text-[#4ade80] hover:underline mb-4"
                        >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                            {t('preview.viewRecentlyDeleted')}
                        </button>
                        <div className="flex gap-2">
                            <button
                                className="flex-1 py-2 rounded-xl text-xs text-gray-300 bg-white/10 hover:bg-white/15 transition-colors"
                                onClick={() => setConfirmDeleteOpen(false)}
                            >
                                {t('preview.cancel')}
                            </button>
                            <button
                                className="flex-1 py-2 rounded-xl text-xs text-white bg-red-500 hover:bg-red-600 transition-colors"
                                onClick={confirmDelete}
                            >
                                {t('preview.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuraPreviewPage;
