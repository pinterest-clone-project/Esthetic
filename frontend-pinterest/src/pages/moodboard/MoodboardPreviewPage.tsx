import React, { useState, useEffect } from "react";
import { useGetMoodboardByIdQuery, useDeleteMoodboardMutation, useUpdateMoodboardMutation } from "@/services/moodboardService.ts";
import { useGetMeQuery } from "@/services/accountService.ts";
import { useParams, useNavigate } from "react-router";
import { APP_ENV } from "@/constants/env";
import PinCard from "@/components/ui/PinCard.tsx";
import ReportModal from "@/components/ui/ReportModal.tsx";
import { useToast } from "@/components/ui/Toast/UseToast.ts";
import { useTranslation } from "react-i18next";
import { ShareIcon, EditIcon, TrashIcon, ReportIcon } from "@/components/ui/Icons.tsx";
import { useGetBoardSectionsQuery } from "@/services/boardSectionService";
import BoardSectionCard from "@/components/ui/BoardSectionCard.tsx";

const MoodboardPreviewPage: React.FC = () => {
    const { t, i18n } = useTranslation('boards');
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: board, isLoading, isError } = useGetMoodboardByIdQuery(id!);
    const { data: me } = useGetMeQuery();
    const isOwner = !!me && !!board && me.id === board.ownerId;

    const [deleteBoard] = useDeleteMoodboardMutation();
    const [updateBoard, { isLoading: isSaving }] = useUpdateMoodboardMutation();
    const { showToast } = useToast();

    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editIsPrivate, setEditIsPrivate] = useState(false);

    const { data: sections } = useGetBoardSectionsQuery(board?.id!, {
        skip: !board,
    });

    useEffect(() => {
        if (board) {
            setEditTitle(board.title ?? "");
            setEditDescription(board.description ?? "");
            setEditIsPrivate(board.isPrivate ?? false);
        }
    }, [board]);

    const confirmDelete = async () => {
        if (!board) return;
        await deleteBoard(board.id);
        setConfirmDeleteOpen(false);
        navigate(-1);
    };

    const handleSave = async () => {
        if (!board || !editTitle.trim()) return;
        try {
            await updateBoard({
                id: board.id,
                title: editTitle.trim(),
                description: editDescription.trim() || undefined,
                isPrivate: editIsPrivate,
            }).unwrap();
            setEditing(false);
            showToast(t('preview.boardUpdated'), "success");
        } catch {
            showToast(t('preview.saveFailed'), "error");
        }
    };

    const handleCancelEdit = () => {
        if (board) {
            setEditTitle(board.title ?? "");
            setEditDescription(board.description ?? "");
            setEditIsPrivate(board.isPrivate ?? false);
        }
        setEditing(false);
    };

    if (isLoading) return (
        <div className="w-full min-h-full bg-white dark:bg-[#000000] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#1DB954] animate-spin" />
        </div>
    );

    if (isError || !board) return (
        <div className="w-full min-h-full bg-white dark:bg-[#000000] flex items-center justify-center">
            <p className="text-red-400 text-sm">{t('preview.notFound')}</p>
        </div>
    );

    return (
        <div className="w-full min-h-full bg-white dark:bg-[#000000]">
            <div className="relative w-full overflow-hidden">
                {board.coverImageUrl && (
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-40"
                        style={{ backgroundImage: `url(${APP_ENV.IMAGES_400_URL}${board.coverImageUrl})` }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 dark:from-black/60 via-white/80 dark:via-black/70 to-white dark:to-black" />

                <div className="relative px-6 pt-10 pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-6">
                    <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-2xl shrink-0 mt-8 sm:mt-0">
                        {board.coverImageUrl ? (
                            <img
                                src={`${APP_ENV.IMAGES_400_URL}${board.coverImageUrl}`}
                                alt={board.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-[#1a1a1a]" />
                        )}
                    </div>

                    <div className="text-center sm:text-left w-full sm:w-auto">
                        {editing ? (
                            <div className="flex flex-col gap-3 w-full sm:w-[340px]">
                                <input
                                    autoFocus
                                    value={editTitle}
                                    onChange={e => setEditTitle(e.target.value)}
                                    placeholder={t('fields.title')}
                                    className="bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/15 rounded-lg px-3 h-9 text-black dark:text-white text-sm font-semibold outline-none focus:border-[#1DB954] transition-colors placeholder:text-gray-400 w-full"
                                />
                                <textarea
                                    value={editDescription}
                                    onChange={e => setEditDescription(e.target.value)}
                                    placeholder={t('fields.descriptionOptional')}
                                    rows={3}
                                    className="bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/15 rounded-lg px-3 py-2 text-black dark:text-white text-xs outline-none focus:border-[#1DB954] transition-colors resize-none placeholder:text-gray-400 w-full"
                                />
                                <div className="flex items-center justify-between">
                                    <span className="text-black dark:text-white text-xs">{t('preview.privateBoard')}</span>
                                    <button
                                        type="button"
                                        onClick={() => setEditIsPrivate(p => !p)}
                                        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${editIsPrivate ? "bg-[#1DB954]" : "bg-black/20 dark:bg-white/20"}`}
                                    >
                                        <span className={`absolute top-[2px] w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${editIsPrivate ? "left-[22px]" : "left-[2px]"}`} />
                                    </button>
                                </div>
                                <div className="flex gap-2 mt-1">
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving || !editTitle.trim()}
                                        className="px-4 py-1.5 rounded-lg bg-[#1DB954] hover:bg-[#17a349] disabled:opacity-40 disabled:cursor-not-allowed text-black text-xs font-semibold transition-colors"
                                    >
                                        {isSaving ? t('preview.saving') : t('preview.save')}
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-black dark:text-white text-xs transition-colors"
                                    >
                                        {t('preview.cancel')}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-black dark:text-white text-2xl sm:text-3xl font-semibold">{board.title}</h1>
                                {board.description && (
                                    <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">{board.description}</p>
                                )}
                                <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">{board.pinsCount} pins</span>
                                    {board.isPrivate && (
                                        <span className="text-xs text-[#A1A1A1] bg-black/10 dark:bg-black/40 px-3 py-1 rounded-full border border-black/10 dark:border-white/10">
                                            {t('preview.private')}
                                        </span>
                                    )}
                                    <span className="text-xs text-gray-500 dark:text-gray-600">
                                        {new Date(board.createdAt).toLocaleDateString(i18n.language, {
                                            day: "numeric", month: "long", year: "numeric"
                                        })}
                                    </span>
                                </div>
                            </>
                        )}

                        {!editing && (
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}/moodboard/preview/${board.id}`);
                                        showToast(t('preview.linkCopied'), "success");
                                    }}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 dark:hover:bg-white/10 hover:bg-black/5 border dark:border-white/10 dark:hover:border-white/20 border-black/10 hover:border-black/20 dark:text-gray-300 text-gray-700 dark:hover:text-white hover:text-black text-xs font-medium transition-all duration-150"
                                >
                                    <ShareIcon />
                                    {t('preview.share')}
                                </button>

                                {isOwner ? (
                                    <>
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 dark:text-gray-300 text-gray-700 dark:hover:text-white hover:text-black text-xs font-medium transition-all duration-150"
                                        >
                                            <EditIcon />
                                            {t('preview.edit')}
                                        </button>
                                        <button
                                            onClick={() => setConfirmDeleteOpen(true)}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-400/40 text-red-400 hover:text-red-300 text-xs font-medium transition-all duration-150"
                                        >
                                            <TrashIcon />
                                            {t('preview.delete')}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setReportModalOpen(true)}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-600 hover:text-red-400 hover:bg-red-500/10 text-xs font-medium transition-all duration-150"
                                        title={t('preview.report')}
                                    >
                                        <ReportIcon />
                                        {t('preview.report')}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-6 py-8">

                {sections && sections.length > 0 && (
                    <>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-black/5 dark:bg-white/5" />
                        <span className="text-gray-600 text-xs tracking-widest uppercase">
                    Sections
                </span>
                        <div className="flex-1 h-px bg-black/5 dark:bg-white/5" />
                    </div>

                    <div className="flex flex-wrap gap-4 mb-10" >
                        {sections.map((section) => (
                            <BoardSectionCard
                                key={section.id}
                                section={section}
                            />
                        ))}
                    </div>
                    </>
                )}

                {board.previewPins.length > 0 ? (
                    <>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1 h-px bg-black/5 dark:bg-white/5" />
                            <span className="text-gray-600 text-xs tracking-widest uppercase">{t('preview.pins')}</span>
                            <div className="flex-1 h-px bg-black/5 dark:bg-white/5" />
                        </div>
                        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3">
                            {board.previewPins.map((pin) => (
                                <div key={pin.id} className="break-inside-avoid mb-3">
                                    <PinCard pin={pin} boardId={isOwner ? board.id : undefined} />
                                </div>
                            ))}
                        </div>


                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-black dark:text-[#A1A1A1]">
                        <p className="text-lg mb-2">{t('preview.noPins')}</p>
                        <p className="text-sm">{t('preview.noPinsDesc')}</p>
                    </div>
                )}
            </div>

            {reportModalOpen && (
                <ReportModal
                    userId={board.ownerId}
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
                        <p className="text-white text-sm font-medium mb-1">{t('preview.deleteTitle')}</p>
                        <p className="text-gray-400 text-xs mb-5">{t('preview.deleteDesc')}</p>
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

export default MoodboardPreviewPage;
