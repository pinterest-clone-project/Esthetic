import { useState } from "react";
import { useGetMyMoodboardsQuery } from "../../services/moodboardService.ts";
import { useSavePinMutation } from "../../services/pinService.ts";

interface SaveModalProps {
    pinId: string;
    onClose: () => void;
}

const SaveModal = ({ pinId, onClose }: SaveModalProps) => {
    const { data: moodboards, isLoading } = useGetMyMoodboardsQuery();
    const [savePin] = useSavePinMutation();
    const [savedBoardId, setSavedBoardId] = useState<string | null>(null);

    const handleSave = async (boardId: string) => {
        await savePin({ pinId, boardId });
        setSavedBoardId(boardId);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl w-[300px] p-4"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-sm font-medium">Save to Moodboard</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white text-xs transition-colors">✕</button>
                </div>

                {isLoading && (
                    <div className="flex justify-center py-4">
                        <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-[#4ade80] animate-spin" />
                    </div>
                )}

                {!isLoading && (!moodboards?.items?.length) && (
                    <p className="text-gray-500 text-xs text-center py-4">No moodboards yet.</p>
                )}

                <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
                    {moodboards?.items?.map(board => {
                        const saved = savedBoardId === board.id;
                        return (
                            <button
                                key={board.id}
                                onClick={() => !saved && handleSave(board.id)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors
                                    ${saved
                                        ? "bg-[#4ade80]/10 text-[#4ade80] cursor-default"
                                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                {board.coverImageUrl ? (
                                    <img src={board.coverImageUrl} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                                ) : (
                                    <div className="w-8 h-8 rounded-lg bg-white/10 shrink-0" />
                                )}
                                <span className="text-xs truncate flex-1">{board.title}</span>
                                {saved && <span className="text-[#4ade80] text-xs shrink-0">✓ Saved</span>}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SaveModal;
