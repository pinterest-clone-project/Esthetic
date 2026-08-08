import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useToast } from "@/components/ui/Toast/UseToast.ts";
import { useTranslation } from "react-i18next";
import type { IPinSummaryResponse } from "@/types/pin/responses/IPinSummaryResponse.ts";
import { useGetMeQuery } from "@/services/accountService.ts";
import { useDeletePinMutation } from "@/services/pinService.ts";
import { useLikeMutation, useUnlikeMutation } from "@/services/likeService.ts";
import { pinCardVariants, scaleIn, fadeIn } from "@/lib/motion";
import { usePinSave } from "@/hooks/usePinSave";

import { APP_ENV } from "@/constants/env";
import SaveModal from "./SaveModal.tsx";
import { HeartIcon, DownloadIcon, TrashIcon, ExternalLinkIcon } from "@/components/ui/Icons.tsx";

const PinCard = ({ pin }: { pin: IPinSummaryResponse}) => {
    const { t } = useTranslation('common');
    const [hovered, setHovered] = useState(false);
    const [saveModalOpen, setSaveModalOpen] = useState(false);
    const [showEditMenu, setShowEditMenu] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    const navigate = useNavigate();
    const { data: me } = useGetMeQuery();
    const [deletePin] = useDeletePinMutation();
    const [like] = useLikeMutation();
    const [unlike] = useUnlikeMutation();
    const { showToast } = useToast();

    const isOwner = !!me && me.id === pin.creatorId;
    const [liked, setLiked] = useState(pin.isLikedByMe ?? false);
    const [likesCount, setLikesCount] = useState(pin.likesCount);
    const {
        isSaved,
        unsave
    } = usePinSave(pin.id);


    useEffect(() => {
        setLiked(pin.isLikedByMe ?? false);
        setLikesCount(pin.likesCount);
    }, [pin.isLikedByMe, pin.likesCount]);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowEditMenu(false);
        setConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
        await deletePin(pin.id);
        setConfirmDeleteOpen(false);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/aura/edit/${pin.id}`);
    };

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (liked) {
            setLiked(false);
            setLikesCount(c => c - 1);
            try {
                await unlike(pin.id).unwrap();
            } catch {
                setLiked(true);
                setLikesCount(c => c + 1);
            }
        } else {
            setLiked(true);
            setLikesCount(c => c + 1);
            try {
                await like(pin.id).unwrap();
            } catch {
                setLiked(false);
                setLikesCount(c => c - 1);
            }
        }
    };



    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!pin.image) return;
        const url = `${APP_ENV.IMAGES_800_URL}${pin.image}`;
        const fileName = (pin.title ?? "aura").replace(/\s+/g, "-").toLowerCase();
        const blob = await fetch(url).then(r => r.blob());
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(blobUrl);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(
            `${window.location.origin}/aura/preview/${pin.id}`
        );
        showToast(t('toast.auraCopied'), "success");
    };

    return (
        <motion.div
            className="relative break-inside-avoid mb-3 rounded-xl overflow-hidden group cursor-pointer"
            variants={pinCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -40px 0px" }}
            whileHover={{ y: -2 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); setShowEditMenu(false); }}
            onClick={() => navigate(`/aura/preview/${pin.id}`)}
        >
            <motion.img
                src={pin.image ? `${APP_ENV.IMAGES_800_URL}${pin.image}` : ""}
                alt={pin.title ?? "Pin"}
                className="w-full block rounded-xl"
                loading="lazy"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
            />

            {pin.title && (
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 pointer-events-none md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                    <p className="text-white text-xs font-medium truncate drop-shadow-lg">{pin.title}</p>
                </div>
            )}

            {/* Hover actions: desktop only — hidden on mobile so invisible buttons can't intercept taps */}
            <div className="hidden md:contents">
                <div
                    className={`absolute inset-0 rounded-xl bg-black/30 transition-opacity duration-200 pointer-events-none ${hovered ? 'opacity-100' : 'opacity-0'}`}
                />

                <div
                    className={`absolute top-2 left-2 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <button
                        onClick={handleLike}
                        className="flex items-center gap-1 bg-black/50 hover:bg-black/70 rounded-full px-2 py-1 transition-colors cursor-pointer"
                    >
                        <HeartIcon size={11} filled={liked} className={`transition-colors ${liked ? 'text-[#4ade80]' : 'text-white/70'}`} />
                        <span className="text-white text-[10px]">{likesCount}</span>
                    </button>
                </div>

                <div
                    className={`absolute top-2 right-2 flex items-center gap-1.5 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    {isOwner && (
                        <div className="relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowEditMenu(p => !p); }}
                                className="bg-black/50 hover:bg-black/70 text-white text-[10px] font-medium px-2.5 py-1.5 rounded-full transition-colors"
                            >
                                ···
                            </button>
                            <AnimatePresence>
                                {showEditMenu && (
                                    <motion.div
                                        className="absolute top-8 right-0 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden w-28 z-10"
                                        initial={{ opacity: 0, y: -6, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -4, scale: 0.96 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <button
                                            className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                            onClick={handleEdit}
                                        >
                                            {t('actions.edit')}
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                            onClick={handleDelete}
                                        >
                                            {t('actions.delete')}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                        <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSaveModalOpen(true);
                                    }}
                                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors ${
                                        isSaved
                                            ? "bg-black/50 hover:bg-black/70 text-white"
                                            : "bg-[#4ade80] hover:bg-[#22c55e] text-black"
                                    }`}
                                >
                                    {isSaved ? t('actions.saved') : t('actions.save')}
                                </button>
                </div>

                <div
                    className={`absolute bottom-2 right-2 flex items-center gap-1.5 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <button
                        onClick={handleDownload}
                        className="flex items-center justify-center w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                        title={t('actions.download')}
                    >
                        <DownloadIcon />
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex items-center justify-center w-7 h-7 bg-black/50 hover:bg-black/70 text-[#4ade80] rounded-full transition-colors"
                    >
                        <ExternalLinkIcon />
                    </button>
                </div>
            </div>

            {saveModalOpen && (
                <div onClick={(e) => e.stopPropagation()}>
                    <SaveModal pinId={pin.id} onClose={() => setSaveModalOpen(false)} />
                </div>
            )}

            <AnimatePresence>
                {confirmDeleteOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteOpen(false); }}
                    >
                        <motion.div
                            className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-72 shadow-2xl"
                            variants={scaleIn}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <p className="text-white text-sm font-medium mb-1">{t('confirm.deleteAura')}</p>
                            <p className="text-gray-400 text-xs mb-3">{t('confirm.deleteAuraDesc')}</p>
                            <button
                                onClick={(e) => { e.stopPropagation(); setConfirmDeleteOpen(false); navigate("/deleted-auras"); }}
                                className="flex items-center gap-1.5 text-[11px] text-[#4ade80] hover:underline mb-4"
                            >
                                <TrashIcon size={11} />
                                {t('confirm.viewRecentlyDeleted')}
                            </button>
                            <div className="flex gap-2">
                                <button
                                    className="flex-1 py-2 rounded-xl text-xs text-gray-300 bg-white/10 hover:bg-white/15 transition-colors"
                                    onClick={() => setConfirmDeleteOpen(false)}
                                >
                                    {t('actions.cancel')}
                                </button>
                                <button
                                    className="flex-1 py-2 rounded-xl text-xs text-white bg-red-500 hover:bg-red-600 transition-colors"
                                    onClick={confirmDelete}
                                >
                                    {t('actions.delete')}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default PinCard;