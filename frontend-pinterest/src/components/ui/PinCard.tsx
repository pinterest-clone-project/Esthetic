import { useState } from "react";
import { useNavigate } from "react-router";
import { useToast } from "@/components/ui/Toast/UseToast.ts";
import type { IPinSummaryResponse } from "@/types/pin/responses/IPinSummaryResponse.ts";
import { useGetMeQuery } from "@/services/accountService.ts";
import { useDeletePinMutation } from "@/services/pinService.ts";
import { useLikeMutation, useUnlikeMutation } from "@/services/likeService.ts";

import { APP_ENV } from "@/constants/env";
import SaveModal from "./SaveModal.tsx";

const ShareIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
);

const PinCard = ({ pin }: { pin: IPinSummaryResponse }) => {
    const [hovered, setHovered] = useState(false);
    const [saveModalOpen, setSaveModalOpen] = useState(false);
    const [showEditMenu, setShowEditMenu] = useState(false);

    const navigate = useNavigate();
    const { data: me } = useGetMeQuery();
    const [deletePin] = useDeletePinMutation();
    const [like] = useLikeMutation();
    const [unlike] = useUnlikeMutation();
    const { showToast } = useToast();

    const isOwner = !!me && me.id === pin.creatorId;
    const liked = pin.isLikedByMe ?? false;
    const likesCount = pin.likesCount;

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await deletePin(pin.id);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/aura/edit/${pin.id}`);
    };

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (liked) {
            await unlike(pin.id);
        } else {
            await like(pin.id);
        }
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(
            `${window.location.origin}/aura/preview/${pin.id}`
        );
        showToast("Link to aura copied!", "success");
    };

    return (
        <div
            className="relative break-inside-avoid mb-3 rounded-xl overflow-hidden group cursor-pointer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); setShowEditMenu(false); }}
            onClick={() => navigate(`/aura/preview/${pin.id}`)}
        >
            <img
                src={pin.image ? `${APP_ENV.IMAGES_800_URL}${pin.image}` : ""}
                alt={pin.title ?? "Pin"}
                className="w-full block rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
            />

            {/* Overlay */}
            <div className={`absolute inset-0 rounded-xl bg-black/30 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`} />

            {/* Title */}
            {pin.title && (
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 transition-opacity duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                    <p className="text-white text-xs font-medium truncate drop-shadow-lg">{pin.title}</p>
                </div>
            )}

            {/* Top-left: Like */}
            <div className={`absolute top-2 left-2 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
                <button
                    onClick={handleLike}
                    className="flex items-center gap-1 bg-black/50 hover:bg-black/70 rounded-full px-2 py-1 transition-colors cursor-pointer"
                >
                    <span className={`text-xs transition-colors ${liked ? 'text-[#4ade80]' : 'text-white/70'}`}>♥</span>
                    <span className="text-white text-[10px]">{likesCount}</span>
                </button>
            </div>

            {/* Top-right: Save button */}
            <div className={`absolute top-2 right-2 flex items-center gap-1.5 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
                {isOwner && (
                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowEditMenu(p => !p); }}
                            className="bg-black/50 hover:bg-black/70 text-white text-[10px] font-medium px-2.5 py-1.5 rounded-full transition-colors"
                        >
                            ···
                        </button>
                        {showEditMenu && (
                            <div className="absolute top-8 right-0 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden w-28 z-10">
                                <button
                                    className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                    onClick={handleEdit}
                                >
                                    Edit
                                </button>
                                <button
                                    className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
                <button
                    onClick={(e) => { e.stopPropagation(); setSaveModalOpen(true); }}
                    className="bg-[#4ade80] hover:bg-[#22c55e] text-black text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                >
                    Save
                </button>
            </div>

            {/* Bottom-right: Share */}
            <div className={`absolute bottom-2 right-2 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
                <button
                    onClick={handleShare}
                    className="flex items-center justify-center w-7 h-7 bg-black/50 hover:bg-black/70 text-[#4ade80] rounded-full transition-colors"
                >
                    <ShareIcon />
                </button>
            </div>

            {saveModalOpen && (
                <SaveModal pinId={pin.id} onClose={() => setSaveModalOpen(false)} />
            )}
        </div>
    );
};

export default PinCard;