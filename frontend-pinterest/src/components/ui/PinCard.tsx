import { useState } from "react";
import { useNavigate } from "react-router";
import type { IPinSummaryResponse } from "../../types/pin/responses/IPinSummaryResponse.ts";
import { useGetMeQuery } from "../../services/accountService.ts";
import { useDeletePinMutation } from "../../services/pinService.ts";
import { useLikeMutation, useUnlikeMutation } from "../../services/likeService.ts";
import { APP_ENV } from "@/constants/env";

const PinCard = ({ pin }: { pin: IPinSummaryResponse }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [liked, setLiked] = useState(pin.isLikedByMe ?? false);
    const [likesCount, setLikesCount] = useState(pin.likesCount);
    const navigate = useNavigate();

    const { data: me } = useGetMeQuery();
    const [deletePin] = useDeletePinMutation();
    const [like] = useLikeMutation();
    const [unlike] = useUnlikeMutation();

    const isOwner = !!me && me.id === pin.creatorId;

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await deletePin(pin.id);
        setMenuOpen(false);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/aura/edit/${pin.id}`);
    };

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (liked) {
            await unlike(pin.id);
            setLiked(false);
            setLikesCount(c => c - 1);
        } else {
            await like(pin.id);
            setLiked(true);
            setLikesCount(c => c + 1);
        }
    };

    const menuItems = [
        { label: "Save", onClick: (e: React.MouseEvent) => e.stopPropagation() },
        { label: "Share", onClick: (e: React.MouseEvent) => e.stopPropagation() },
        ...(isOwner ? [
            { label: "Edit", onClick: handleEdit },
            { label: "Delete", onClick: handleDelete },
        ] : []),
    ];

    return (
        <div
            className="relative break-inside-avoid mb-3 rounded-xl overflow-hidden group cursor-pointer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); setMenuOpen(false); }}
            onClick={() => navigate(`/aura/preview/${pin.id}`)}
        >
            <img
                src={pin.image ? `${APP_ENV.IMAGES_800_URL}${pin.image}` : ""}
                alt={pin.title ?? "Pin"}
                className="w-full block rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
            />

            <div className={`absolute inset-0 rounded-xl bg-black/30 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`} />

            {pin.title && (
                <div className={`absolute bottom-0 left-0 right-0 px-3 py-2.5 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-white text-xs font-medium truncate drop-shadow-lg">{pin.title}</p>
                </div>
            )}

            {/* Like button — top left */}
            <div className={`absolute top-2 left-2 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
                <button
                    onClick={handleLike}
                    className="flex items-center gap-1 bg-black/50 hover:bg-black/70 rounded-full px-2 py-1 transition-colors"
                >
                    <span className={`text-xs transition-colors ${liked ? 'text-[#4ade80]' : 'text-white/70'}`}>♥</span>
                    <span className="text-white text-[10px]">{likesCount}</span>
                </button>
            </div>

            {/* Dots menu — bottom right */}
            <div className={`absolute bottom-2 right-2 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
                <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(p => !p); }}
                    className="flex items-center gap-[3px] bg-black/50 hover:bg-black/70 rounded-full px-2 py-1.5 transition-colors"
                >
                    {[0, 1, 2].map(i => (
                        <span key={i} className="w-1 h-1 rounded-full bg-[#4ade80] block" />
                    ))}
                </button>

                {menuOpen && (
                    <div className="absolute bottom-8 right-0 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden w-36 z-10">
                        {menuItems.map(({ label, onClick }) => (
                            <button
                                key={label}
                                className={`w-full text-left px-4 py-2.5 text-xs transition-colors
                                    ${label === "Delete"
                                        ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                                    }`}
                                onClick={onClick}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PinCard;
