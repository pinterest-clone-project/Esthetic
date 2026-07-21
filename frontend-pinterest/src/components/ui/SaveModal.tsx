import { useState } from "react";
import { useGetMyMoodboardsQuery } from "../../services/moodboardService.ts";
import { useSavePinMutation, useUnsavePinMutation, useGetSavedBoardsQuery } from "../../services/pinService.ts";
import Modal from "./Modal.tsx";
import { APP_ENV } from "@/constants/env";
import { useToast } from "@/components/ui/Toast/UseToast.ts";
import { useTranslation } from "react-i18next";

interface SaveModalProps {
    pinId: string;
    onClose: () => void;
}


const SaveModal = ({ pinId, onClose }: SaveModalProps) => {
    const { t } = useTranslation('boards');
    const { t: tc } = useTranslation('common');
    const { data: moodboards, isLoading: boardsLoading } = useGetMyMoodboardsQuery();
    const { data: savedBoardIds = [], isLoading: savedLoading } = useGetSavedBoardsQuery(pinId);
    const [savePin] = useSavePinMutation();
    const [unsavePin] = useUnsavePinMutation();
    const { showToast } = useToast();
    const [pendingBoardId, setPendingBoardId] = useState<string | null>(null);


    const [localSaved, setLocalSaved] = useState<Record<string, boolean>>({});

    const isSaved = (boardId: string) =>
        localSaved[boardId] !== undefined
            ? localSaved[boardId]
            : savedBoardIds.includes(boardId);

    const handleToggle = async (boardId: string) => {
        if (pendingBoardId === boardId) return;
        setPendingBoardId(boardId);

        const currentlySaved = isSaved(boardId);
        setLocalSaved(prev => ({ ...prev, [boardId]: !currentlySaved }));

        if (currentlySaved) {
            showToast(tc('toast.removedFromBoard'), "success");
        } else {
            showToast(tc('toast.savedToBoard'), "success");
        }

        try {
            if (currentlySaved) {
                await unsavePin({ pinId, boardId }).unwrap();
            } else {
                await savePin({ pinId, boardId }).unwrap();
            }
        } catch {
            setLocalSaved(prev => ({ ...prev, [boardId]: currentlySaved }));
            showToast(tc('toast.somethingWentWrong'), "error");
        } finally {
            setPendingBoardId(null);
        }
    };

    const handleDone = () => {
        onClose();
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
            <div className="bg-black dark:bg-white rounded-2xl px-7 py-6 w-full">
                <div className="flex flex-col gap-5">

                    <div className="relative">
                        <h3 className="text-center text-white dark:text-black text-lg font-semibold">
                            {t('saveModal.title')}
                        </h3>
                        <button
                            onClick={onClose}
                            className="absolute top-0 right-0 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white dark:text-black">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>


                    {isLoading && (
                        <div className="flex justify-center py-8">
                            <div className="w-6 h-6 rounded-full border-2 border-white/20 dark:border-black/20 border-t-[#1DB954] animate-spin" />
                        </div>
                    )}

                    {/* Empty */}
                    {!isLoading && !moodboards?.items?.length && (
                        <p className="text-gray-400 text-sm text-center py-8">{t('saveModal.noMoodboards')}</p>
                    )}

                    {/* Grid */}
                    {!isLoading && !!moodboards?.items?.length && (
                        <div className="grid grid-cols-3 gap-3 mb-2 max-h-[340px] overflow-y-auto">
                            {moodboards.items.map(board => {
                                const saved = isSaved(board.id);
                                const thumb = board.coverImageUrl
                                    ? `${APP_ENV.IMAGES_400_URL}${board.coverImageUrl}`
                                    : null;

                                return (
                                    <div
                                        key={board.id}
                                        onClick={() => handleToggle(board.id)}
                                        className="cursor-pointer"
                                    >
                                        <div className="relative rounded-lg overflow-hidden aspect-square bg-white/10 dark:bg-black/10">
                                            {thumb ? (
                                                <img
                                                    src={thumb}
                                                    alt={board.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                    </svg>
                                                </div>
                                            )}

                                            {saved && (
                                                <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-[#1DB954] flex items-center justify-center">
                                                    <svg width="12" height="10" viewBox="0 0 10 8" fill="none">
                                                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-[11px] text-gray-400 truncate mt-1.5">
                                            {board.title}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <button
                        onClick={handleDone}
                        className="w-full h-10 bg-[#1DB954] hover:bg-[#1aa34a]
                        text-white dark:text-black text-sm font-medium rounded-lg transition-colors mt-1"
                    >
                        {t('saveModal.done')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SaveModal;
