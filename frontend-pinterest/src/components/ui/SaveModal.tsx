import { useState } from "react";
import { useGetMyMoodboardsQuery } from "../../services/moodboardService.ts";
import { useSavePinMutation, useUnsavePinMutation, useGetSavedBoardsQuery } from "../../services/pinService.ts";
import Modal from "./Modal.tsx";
import { APP_ENV } from "@/constants/env";

interface SaveModalProps {
    pinId: string;
    onClose: () => void;
}

const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const SaveModal = ({ pinId, onClose }: SaveModalProps) => {
    const { data: moodboards, isLoading: boardsLoading } = useGetMyMoodboardsQuery();
    const { data: savedBoardIds = [], isLoading: savedLoading } = useGetSavedBoardsQuery(pinId);
    const [savePin] = useSavePinMutation();
    const [unsavePin] = useUnsavePinMutation();

    // Local optimistic state on top of server state
    const [localSaved, setLocalSaved] = useState<Record<string, boolean>>({});

    const isSaved = (boardId: string) =>
        localSaved[boardId] !== undefined
            ? localSaved[boardId]
            : savedBoardIds.includes(boardId);

    const handleToggle = async (boardId: string) => {
        const currentlySaved = isSaved(boardId);
        setLocalSaved(prev => ({ ...prev, [boardId]: !currentlySaved }));
        try {
            if (currentlySaved) {
                await unsavePin({ pinId, boardId }).unwrap();
            } else {
                await savePin({ pinId, boardId }).unwrap();
            }
        } catch {
            // Revert on error
            setLocalSaved(prev => ({ ...prev, [boardId]: currentlySaved }));
        }
    };

    const isLoading = boardsLoading || savedLoading;

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            width={460}
            height="auto"
            borderRadius={16}
        >
            <div className="flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-black dark:text-white text-base font-semibold">Choose Moodboard</h3>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex justify-center py-8">
                        <div className="w-6 h-6 rounded-full border-2 border-gray-200 dark:border-white/20 border-t-[#4ade80] animate-spin" />
                    </div>
                )}

                {/* Empty */}
                {!isLoading && !moodboards?.items?.length && (
                    <p className="text-gray-400 text-sm text-center py-8">No moodboards yet.</p>
                )}

                {/* Grid */}
                {!isLoading && !!moodboards?.items?.length && (
                    <div className="grid grid-cols-4 gap-3">
                        {moodboards.items.map(board => {
                            const saved = isSaved(board.id);
                            const thumb = board.coverImageUrl
                                ? `${APP_ENV.IMAGES_400_URL}${board.coverImageUrl}`
                                : null;

                            return (
                                <button
                                    key={board.id}
                                    onClick={() => handleToggle(board.id)}
                                    className="flex flex-col gap-1.5 items-center group"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-white/10">
                                        {thumb ? (
                                            <img
                                                src={thumb}
                                                alt={board.title}
                                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Saved checkmark overlay */}
                                        {saved && (
                                            <div className="absolute inset-0 bg-black/40 flex items-end justify-end p-1.5">
                                                <div className="w-5 h-5 rounded-full bg-[#4ade80] flex items-center justify-center text-black">
                                                    <CheckIcon />
                                                </div>
                                            </div>
                                        )}

                                        {/* Hover ring */}
                                        <div className={`absolute inset-0 rounded-xl ring-2 transition-all duration-200
                                            ${saved ? 'ring-[#4ade80]' : 'ring-transparent group-hover:ring-white/40'}`}
                                        />
                                    </div>

                                    {/* Title */}
                                    <span className={`text-[10px] text-center truncate w-full leading-tight transition-colors
                                        ${saved ? 'text-[#4ade80]' : 'text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white'}`}>
                                        {board.title}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Save button */}
                <button
                    onClick={onClose}
                    className="w-full h-10 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20
                        text-black dark:text-white text-sm font-medium rounded-xl transition-colors mt-1"
                >
                    Done
                </button>
            </div>
        </Modal>
    );
};

export default SaveModal;
