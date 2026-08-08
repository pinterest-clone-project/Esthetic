import React, { useState, useEffect } from "react";
import { useGetMoodboardByIdQuery, useDeleteMoodboardMutation, useUpdateMoodboardMutation, useArchiveMoodboardMutation, useUnarchiveMoodboardMutation } from "@/services/moodboardService.ts";
import { useGetMeQuery } from "@/services/accountService.ts";
import { useParams, useNavigate } from "react-router";
import { APP_ENV } from "@/constants/env";
import PinCard from "@/components/ui/PinCard.tsx";
import ReportModal from "@/components/ui/ReportModal.tsx";
import { useToast } from "@/components/ui/Toast/UseToast.ts";
import { useTranslation } from "react-i18next";
import { ShareIcon, EditIcon, TrashIcon, ReportIcon } from "@/components/ui/Icons.tsx";
import { useGetBoardSectionsQuery, useCreateBoardSectionMutation } from "@/services/boardSectionService";
import BoardSectionCard from "@/components/ui/BoardSectionCard.tsx";
import { motion } from "framer-motion";

const MoodboardPreviewPage: React.FC = () => {
    const { t, i18n } = useTranslation('boards');
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: board, isLoading, isError } = useGetMoodboardByIdQuery(id!);
    const { data: me } = useGetMeQuery();
    const isOwner = !!me && !!board && me.id === board.ownerId;

    const [deleteBoard] = useDeleteMoodboardMutation();
    const [updateBoard, { isLoading: isSaving }] = useUpdateMoodboardMutation();
    const [archiveBoard] = useArchiveMoodboardMutation();
    const [unarchiveBoard] = useUnarchiveMoodboardMutation();
    const { showToast } = useToast();

    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [createSectionOpen, setCreateSectionOpen] = useState(false);
    const [newSectionTitle, setNewSectionTitle] = useState("");
    const [createSection, { isLoading: isCreatingSection }] = useCreateBoardSectionMutation();
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

    const handleArchive = async () => {
        if (!board) return;
        try {
            await archiveBoard(board.id).unwrap();
            showToast(t('moodboard.toastArchived'), "success");
        } catch {
            showToast(t('preview.saveFailed'), "error");
        }
    };

    const handleUnarchive = async () => {
        if (!board) return;
        try {
            await unarchiveBoard(board.id).unwrap();
            showToast(t('moodboard.toastUnarchived'), "success");
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

    const handleCreateSection = async () => {
        if (!board || !newSectionTitle.trim()) return;
        try {
            await createSection({ boardId: board.id, title: newSectionTitle.trim() }).unwrap();
            setNewSectionTitle("");
            setCreateSectionOpen(false);
            showToast(t('preview.sectionCreated'), "success");
        } catch {
            showToast(t('preview.saveFailed'), "error");
        }
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
                                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                                    <h1 className="text-black dark:text-white text-2xl sm:text-3xl font-semibold">{board.title}</h1>
                                    {board.isArchived && (
                                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-2.5 py-1 rounded-full">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/>
                                            </svg>
                                            {t('moodboard.archived')}
                                        </span>
                                    )}
                                </div>
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
                            <div className="sm:flex items-center justify-center sm:justify-start gap-2 mt-4 hidden">
                                {/* Desktop buttons */}
                                <div className="hidden sm:flex items-center gap-2 flex-wrap">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(`${window.location.origin}/moodboard/preview/${board.id}`);
                                            showToast(t('preview.linkCopied'), "success");
                                        }}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white text-xs font-medium transition-all duration-150"
                                    >
                                        <ShareIcon />
                                        {t('preview.share')}
                                    </button>

                                    {isOwner ? (
                                        <>
                                            <button
                                                onClick={() => setEditing(true)}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white text-xs font-medium transition-all duration-150"
                                            >
                                                <EditIcon />
                                                {t('preview.edit')}
                                            </button>
                                            <button
                                                onClick={() => setCreateSectionOpen(true)}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white text-xs font-medium transition-all duration-150"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                                                </svg>
                                                {t('preview.addSection')}
                                            </button>
                                            <button
                                                onClick={board.isArchived ? handleUnarchive : handleArchive}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white text-xs font-medium transition-all duration-150"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
                                                </svg>
                                                {board.isArchived ? t('moodboard.unarchive') : t('moodboard.archive')}
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
                                        >
                                            <ReportIcon />
                                            {t('preview.report')}
                                        </button>
                                    )}
                                </div>

                                {/* Mobile: hidden here, rendered below overflow-hidden */}
                                <div className="hidden items-center gap-2">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(`${window.location.origin}/moodboard/preview/${board.id}`);
                                            showToast(t('preview.linkCopied'), "success");
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-medium"
                                    >
                                        <ShareIcon />
                                        {t('preview.share')}
                                    </button>

                                    <div className="relative">
                                        <button
                                            onClick={() => setMobileMenuOpen(o => !o)}
                                            className="flex items-center justify-center w-9 h-9 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
                                            </svg>
                                        </button>

                                        {mobileMenuOpen && (
                                            <div className="absolute right-0 top-11 z-30 bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl py-1.5 w-52">
                                                {isOwner ? (
                                                    <>
                                                        <button onClick={() => { setEditing(true); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                                            <EditIcon />
                                                            {t('preview.edit')}
                                                        </button>
                                                        <button onClick={() => { setCreateSectionOpen(true); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                                            {t('preview.addSection')}
                                                        </button>
                                                        <button onClick={() => { board.isArchived ? handleUnarchive() : handleArchive(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
                                                            {board.isArchived ? t('moodboard.unarchive') : t('moodboard.archive')}
                                                        </button>
                                                        <div className="mx-3 my-1 h-px bg-black/5 dark:bg-white/5" />
                                                        <button onClick={() => { setConfirmDeleteOpen(true); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/5 transition-colors">
                                                            <TrashIcon />
                                                            {t('preview.delete')}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => { setReportModalOpen(true); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/5 transition-colors">
                                                        <ReportIcon />
                                                        {t('preview.report')}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile action buttons — outside overflow-hidden */}
            {!editing && (
                <div className="flex sm:hidden items-center justify-center gap-2 px-6 py-4 border-b border-black/5 dark:border-white/5">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/moodboard/preview/${board.id}`);
                            showToast(t('preview.linkCopied'), "success");
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-medium"
                    >
                        <ShareIcon />
                        {t('preview.share')}
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setMobileMenuOpen(o => !o)}
                            className="flex items-center justify-center w-9 h-9 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
                            </svg>
                        </button>

                        {mobileMenuOpen && (
                            <div className="absolute right-0 top-11 z-30 bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl py-1.5 w-52">
                                {isOwner ? (
                                    <>
                                        <button onClick={() => { setEditing(true); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                            <EditIcon />
                                            {t('preview.edit')}
                                        </button>
                                        <button onClick={() => { setCreateSectionOpen(true); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                            {t('preview.addSection')}
                                        </button>
                                        <button onClick={() => { board.isArchived ? handleUnarchive() : handleArchive(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
                                            {board.isArchived ? t('moodboard.unarchive') : t('moodboard.archive')}
                                        </button>
                                        <div className="mx-3 my-1 h-px bg-black/5 dark:bg-white/5" />
                                        <button onClick={() => { setConfirmDeleteOpen(true); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/5 transition-colors">
                                            <TrashIcon />
                                            {t('preview.delete')}
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => { setReportModalOpen(true); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/5 transition-colors">
                                        <ReportIcon />
                                        {t('preview.report')}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="px-6 py-8">

                {sections && sections.length > 0 && (
                    <>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-black/5 dark:bg-white/5" />
                        <span className="text-gray-600 text-xs tracking-widest uppercase">
                            {t('preview.sections')}
                        </span>
                        <div className="flex-1 h-px bg-black/5 dark:bg-white/5" />
                    </div>

                        <div className="flex flex-wrap gap-4 mb-10">
                            {sections.map((section) => (
                                <motion.div
                                    key={section.id}
                                    whileHover={{
                                        y: -6,
                                        scale: 1.03,
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                    className="cursor-pointer"
                                >
                                    <BoardSectionCard section={section} />
                                </motion.div>
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
                                    <PinCard pin={pin}  />
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

            {createSectionOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                    onClick={() => setCreateSectionOpen(false)}
                >
                    <div
                        className="bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-2xl p-6 w-80 shadow-2xl flex flex-col gap-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="text-black dark:text-white text-sm font-semibold">
                            {t('preview.addSection')}
                        </h3>
                        <input
                            autoFocus
                            value={newSectionTitle}
                            onChange={e => setNewSectionTitle(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleCreateSection()}
                            placeholder={t('saveModal.sectionName')}
                            className="w-full rounded-xl px-3 py-2.5 text-sm bg-black/5 dark:bg-white/5 text-black dark:text-white placeholder-gray-400 outline-none border border-transparent focus:border-[#1DB954]/40 transition-colors"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setCreateSectionOpen(false); setNewSectionTitle(""); }}
                                className="flex-1 py-2 rounded-xl text-sm border border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                            >
                                {t('preview.cancel')}
                            </button>
                            <button
                                onClick={handleCreateSection}
                                disabled={!newSectionTitle.trim() || isCreatingSection}
                                className="flex-1 py-2 rounded-xl text-sm font-semibold bg-[#1DB954] hover:bg-[#17a349] text-black disabled:opacity-40 transition-colors"
                            >
                                {t('saveModal.create')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
