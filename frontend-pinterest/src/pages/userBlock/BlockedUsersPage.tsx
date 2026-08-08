import { useState } from "react";
import { useNavigate } from "react-router";
import { useGetBlockedUsersQuery, useDefaultUnblockUserMutation } from "@/services/blockService.ts";
import { APP_ENV } from "@/constants/env";
import profileIcon from "@/assets/icons/profile_icon.svg";
import { useTranslation } from "react-i18next";

const BlockedUsersPage = () => {
    const { t } = useTranslation('common');
    const navigate = useNavigate();
    const { data: blockedUsers, isLoading } = useGetBlockedUsersQuery();
    const [unblockUser] = useDefaultUnblockUserMutation();
    const [confirmId, setConfirmId] = useState<string | null>(null);

    const confirmUser = blockedUsers?.find(u => u.userId === confirmId);

    return (
        <div className="w-full min-h-full bg-white dark:bg-black px-6 py-8 max-w-5xl mx-auto">


            <div className="mb-8">
                <h1 className="text-black dark:text-white text-2xl font-bold">{t('settings.blockedUsers')}</h1>
                <p className="text-gray-500 text-sm mt-1">{t('settings.blockedUsersDesc')}</p>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex justify-center py-16">
                    <div className="w-6 h-6 rounded-full border-2 border-black/10 dark:border-white/10 border-t-[#4ade80] animate-spin"/>
                </div>
            )}

            {/* Empty state */}
            {!isLoading && blockedUsers?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className="text-black dark:text-white text-sm font-medium mb-1">{t('empty.noBlockedUsers')}</p>
                        <p className="text-gray-500 text-xs max-w-[220px]">{t('empty.noBlockedUsersDesc')}</p>
                    </div>
                </div>
            )}

            {/* List */}
            {!isLoading && !!blockedUsers?.length && (
                <div className="flex flex-col gap-2">
                    {blockedUsers.map(user => (
                        <div
                            key={user.userId}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/[0.07] dark:hover:bg-white/[0.07] transition-colors"
                        >
                            <div
                                className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-[#4ade80]/20 flex items-center justify-center cursor-pointer"
                                onClick={() => navigate(`/user/${user.userId}`)}
                            >
                                {user.image
                                    ? <img src={`${APP_ENV.IMAGES_100_URL}${user.image}`} className="w-full h-full object-cover" alt="" />
                                    : <img src={profileIcon} className="w-5 h-5 brightness-0 invert" alt="" />
                                }
                            </div>

                            <p
                                className="text-sm font-medium flex-1 cursor-pointer text-black dark:text-white hover:text-[#4ade80] dark:hover:text-[#4ade80] transition-colors truncate"
                                onClick={() => navigate(`/user/${user.userId}`)}
                            >
                                {user.name}
                            </p>

                            <button
                                onClick={() => setConfirmId(user.userId)}
                                className="text-xs text-[#4ade80] hover:text-[#22c55e] border border-[#4ade80]/20 hover:border-[#4ade80]/40 hover:bg-[#4ade80]/10 px-3 py-1.5 rounded-lg transition-colors shrink-0"
                            >
                                {t('actions.unblock')}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Info block */}
            {!isLoading && !!blockedUsers?.length && (
                <div className="mt-2 px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 flex gap-2 items-start">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 shrink-0 mt-0.5">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p className="text-gray-500 text-xs leading-relaxed">
                        {t('empty.blockedUsersInfo')}
                    </p>
                </div>
            )}

            {/* Unblock confirm modal */}
            {confirmId && confirmUser && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                    onClick={() => setConfirmId(null)}
                >
                    <div
                        className="bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-2xl w-80 p-6 shadow-2xl flex flex-col gap-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex flex-col gap-1">
                            <h3 className="text-black dark:text-white text-sm font-semibold">
                                {t('actions.unblockUser')} {confirmUser.name}?
                            </h3>
                            <p className="text-gray-500 text-xs leading-relaxed">
                                {t('actions.unblockUserDesc')}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setConfirmId(null)}
                                className="flex-1 py-2 rounded-xl text-sm border border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                            >
                                {t('actions.cancel')}
                            </button>
                            <button
                                onClick={async () => { await unblockUser(confirmUser.userId); setConfirmId(null); }}
                                className="flex-1 py-2 rounded-xl text-sm font-semibold bg-[#4ade80] hover:bg-[#22c55e] text-black transition-colors"
                            >
                                {t('actions.unblock')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlockedUsersPage;
