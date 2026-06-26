import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useGetPinByIdQuery, useGetAllPinsQuery, useDeletePinMutation } from "../../services/pinService.ts";
import { useGetMeQuery } from "../../services/accountService.ts";
import { useLikeMutation, useUnlikeMutation } from "../../services/likeService.ts";
import PinCard from "@/components/ui/PinCard.tsx";
import BackButton from "@/components/ui/BackButton.tsx";
import { APP_ENV } from "@/constants/env";
import SaveModal from "@/components/ui/SaveModal.tsx";

const AuraPreviewPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: pin, isLoading, isError } = useGetPinByIdQuery(id!);
    // Sync liked state once pin data loads
    useEffect(() => {
        if (pin) {
            setLiked(pin.isLikedByMe ?? false);
            setLikesCount(pin.likesCount);
        }
    }, [pin?.id]);
    const { data: allPins } = useGetAllPinsQuery();
    const { data: me } = useGetMeQuery();

    const [deletePin] = useDeletePinMutation();
    const [like] = useLikeMutation();
    const [unlike] = useUnlikeMutation();

    // Ideally seed `liked` from pin.isLikedByMe if your API provides it
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState<number | null>(null);
    const [saveModalOpen, setSaveModalOpen] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [id]);

    const isOwner = me?.id === pin?.creatorId;
    const suggestions = allPins?.filter(p => p.id !== id) ?? [];

    // Use local state for likes count once pin loads; fall back to pin.likesCount
    const displayLikesCount = likesCount ?? pin?.likesCount ?? 0;

    const handleLike = async () => {
        if (!pin) return;
        if (liked) {
            await unlike(pin.id);
            setLiked(false);
            setLikesCount(displayLikesCount - 1);
        } else {
            await like(pin.id);
            setLiked(true);
            setLikesCount(displayLikesCount + 1);
        }
    };

    const handleDelete = async () => {
        if (!pin) return;
        await deletePin(pin.id);
        navigate(-1);
    };

    if (isLoading) return (
        <div className="w-full min-h-full bg-white dark:bg-[#000000] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#4ade80] animate-spin" />
        </div>
    );

    if (isError || !pin) return (
        <div className="w-full min-h-full bg-white dark:bg-[#000000] flex items-center justify-center">
            <p className="text-red-400 text-sm">Aura not found.</p>
        </div>
    );

    return (
        <div className="w-full min-h-full bg-white dark:bg-[#000000] px-3 py-4 md:px-6 md:py-8">

            <BackButton />

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
                                <span className={`transition-colors ${liked ? 'text-[#4ade80]' : 'text-gray-500 group-hover:text-[#4ade80]'}`}>♥</span>
                                <span className={`transition-colors ${liked ? 'text-white' : 'text-gray-500'}`}>{displayLikesCount}</span>
                            </button>
                            <span className="flex items-center gap-1.5 text-gray-500 text-xs">
                                <span className="text-[#4ade80]">💬</span>
                                {pin.commentsCount}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        `${window.location.origin}/aura/preview/${pin.id}`
                                    );
                                }}
                                className="text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                Share
                            </button>
                            <button
                                onClick={() => setSaveModalOpen(true)}
                                className="text-xs text-[#4ade80] border border-[#4ade80]/30 hover:border-[#4ade80] px-3 py-1.5 rounded-lg transition-colors"
                            >
                                Save
                            </button>
                            {isOwner && (
                                <>
                                    <button
                                        onClick={() => navigate(`/aura/edit/${pin.id}`)}
                                        className="text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-400/40 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    {pin.title && (
                        <h1 className="text-black dark:text-white text-2xl font-semibold leading-tight">{pin.title}</h1>
                    )}

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
                </div>
            </div>

            {/* Divider */}
            {suggestions.length > 0 && (
                <>
                    <div className="flex items-center gap-4 mb-6 max-w-4xl mx-auto">
                        <div className="flex-1 h-px bg-white/5" />
                        <span className="text-gray-600 text-xs tracking-widest uppercase">More Auras</span>
                        <div className="flex-1 h-px bg-white/5" />
                    </div>

                    {/* Suggestions masonry */}
                    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3">
                        {suggestions.map(p => (
                            <PinCard key={p.id} pin={p} />
                        ))}
                    </div>
                </>
            )}
            {saveModalOpen && (
                <SaveModal pinId={pin.id} onClose={() => setSaveModalOpen(false)} />
            )}
        </div>
    );
};

export default AuraPreviewPage;
