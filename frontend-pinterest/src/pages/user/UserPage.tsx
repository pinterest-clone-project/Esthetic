import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useGetByIdQuery, useGetFollowStatsQuery, useGetFollowersQuery, useGetFollowingQuery } from "@/services/userService.ts";
import { useGetPinsByUserQuery } from "@/services/pinService.ts";
import { useGetMeQuery } from "@/services/accountService.ts";
import { useFollowMutation, useUnfollowMutation, useSendFollowRequestMutation, useCancelFollowRequestMutation } from "@/services/followService.ts";
import { useGetPublicBoardsByUserQuery, useGetMyMoodboardsQuery } from "@/services/moodboardService.ts";
import PinCard from "@/components/ui/PinCard.tsx";
import { APP_ENV } from "@/constants/env";
import type { IUser } from "@/types/user/IUser.ts";
import { useTranslation } from "react-i18next";

const UserPage = () => {
    const { t } = useTranslation('common');
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: user, isLoading: userLoading } = useGetByIdQuery(id!);
    const { data: stats } = useGetFollowStatsQuery(id!);
    const { data: pins, isLoading: pinsLoading } = useGetPinsByUserQuery(id!);
    const { data: me } = useGetMeQuery();
    const isMe = me?.id === id;

    const { data: publicBoards } = useGetPublicBoardsByUserQuery(id!, { skip: isMe });
    const { data: myBoards } = useGetMyMoodboardsQuery(undefined, { skip: !isMe });
    const boards = isMe ? myBoards : publicBoards;

    const [follow] = useFollowMutation();
    const [unfollow] = useUnfollowMutation();
    const [sendFollowRequest] = useSendFollowRequestMutation();
    const [cancelFollowRequest] = useCancelFollowRequestMutation();
    const [activeTab, setActiveTab] = useState<"auras" | "moodboards">("auras");
    const [followModal, setFollowModal] = useState<"followers" | "following" | null>(null);

    const { data: followers } = useGetFollowersQuery(id!, { skip: followModal !== "followers" });
    const { data: following } = useGetFollowingQuery(id!, { skip: followModal !== "following" });

    const handleFollowToggle = async () => {
        if (!id) return;
        if (stats?.isFollowedByMe) {
            await unfollow(id);
        } else if (user?.isPrivate) {
            if (stats?.isRequestedByMe) {
                await cancelFollowRequest(id);
            } else {
                await sendFollowRequest(id);
            }
        } else {
            await follow(id);
        }
    };

    if (userLoading) return (
        <div className="w-full min-h-full flex items-center justify-center bg-white dark:bg-black">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#4ade80] animate-spin" />
        </div>
    );

    if (!user) return (
        <div className="w-full min-h-full flex items-center justify-center bg-white dark:bg-black">
            <p className="text-red-400 text-sm">{t('user.notFound')}</p>
        </div>
    );

    return (
        <>
        <div className="w-full min-h-full bg-white dark:bg-black px-6 py-8">

            <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto mb-12 text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white/10 shrink-0">
                    {user.image ? (
                        <img
                            src={`${APP_ENV.IMAGES_400_URL}${user.image}`}
                            alt={user.userName ?? ""}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400 font-semibold bg-white/5">
                            {user.userName?.[0]?.toUpperCase() ?? "?"}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <h1 className="text-black dark:text-white text-xl font-semibold">
                        {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.userName}
                    </h1>
                    {user.userName && (
                        <p className="text-gray-500 text-sm">@{user.userName}</p>
                    )}
                </div>

                {user.bio && (
                    <p className="text-gray-400 text-sm leading-relaxed max-w-md">{user.bio}</p>
                )}

                <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center gap-0.5">
                        <span className="text-black dark:text-white text-sm font-semibold">
                            {pins?.length ?? 0}
                        </span>
                        <span className="text-gray-500 text-xs">{t('user.auras')}</span>
                    </div>
                    {(isMe || !user.isPrivate || stats?.isFollowedByMe) ? (
                        <>
                            <button onClick={() => setFollowModal("followers")} className="flex flex-col items-center gap-0.5 hover:opacity-70 transition-opacity">
                                <span className="text-black dark:text-white text-sm font-semibold">
                                    {stats?.followersCount ?? 0}
                                </span>
                                <span className="text-gray-500 text-xs">{t('user.followers')}</span>
                            </button>
                            <button onClick={() => setFollowModal("following")} className="flex flex-col items-center gap-0.5 hover:opacity-70 transition-opacity">
                                <span className="text-black dark:text-white text-sm font-semibold">
                                    {stats?.followingCount ?? 0}
                                </span>
                                <span className="text-gray-500 text-xs">{t('user.following')}</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-col items-center gap-0.5">
                                <span className="text-black dark:text-white text-sm font-semibold">{stats?.followersCount ?? 0}</span>
                                <span className="text-gray-500 text-xs">{t('user.followers')}</span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                                <span className="text-black dark:text-white text-sm font-semibold">{stats?.followingCount ?? 0}</span>
                                <span className="text-gray-500 text-xs">{t('user.following')}</span>
                            </div>
                        </>
                    )}
                </div>

                {!isMe && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleFollowToggle}
                            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors
                                ${stats?.isFollowedByMe
                                    ? "bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-black dark:text-white border border-black/10 dark:border-white/10"
                                    : stats?.isRequestedByMe
                                        ? "bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50 border border-black/10 dark:border-white/10 hover:border-red-400 hover:text-red-400"
                                        : "bg-[#4ade80] hover:bg-[#22c55e] text-black"
                                }`}
                        >
                            {stats?.isFollowedByMe ? t('user.following_btn') : stats?.isRequestedByMe ? t('user.requested') : t('user.follow')}
                        </button>
                    </div>
                )}

                {isMe && (
                    <button
                        onClick={() => navigate("/profile")}
                        className="px-5 py-2 rounded-xl text-sm border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors"
                    >
                        {t('user.editProfile')}
                    </button>
                )}
            </div>

            {user.isPrivate && !isMe && !stats?.isFollowedByMe && (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <div className="w-14 h-14 rounded-full bg-white/5 dark:bg-white/5 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                    </div>
                    <p className="text-black dark:text-white text-sm font-medium">{t('user.privateAccount')}</p>
                    <p className="text-gray-500 text-xs max-w-xs">{t('user.privateAccountDesc')}</p>
                </div>
            )}

            {(!user.isPrivate || isMe || stats?.isFollowedByMe) && (
            <>
            <div className="flex items-center justify-center gap-6 mb-8">
                {(["auras", "moodboards"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-sm capitalize transition-colors duration-150 ${
                            activeTab === tab
                                ? "text-[#4ade80] border-b border-[#4ade80] pb-0.5"
                                : "text-gray-500 hover:text-gray-300"
                        }`}
                    >
                        {t(`user.tabs.${tab}`)}
                    </button>
                ))}
            </div>

            {activeTab === "auras" && (
                <>
                    {pinsLoading && (
                        <div className="flex justify-center py-12">
                            <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-[#4ade80] animate-spin" />
                        </div>
                    )}
                    {!pinsLoading && !pins?.length && (
                        <div className="flex justify-center py-12">
                            <p className="text-gray-500 text-sm">{t('user.noAuras')}</p>
                        </div>
                    )}
                    {!pinsLoading && !!pins?.length && (
                        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3">
                            {pins.map(p => (
                                <PinCard key={p.id} pin={p} />
                            ))}
                        </div>
                    )}
                </>
            )}

            {activeTab === "moodboards" && (
                <>
                    {!boards?.items?.length ? (
                        <div className="flex justify-center py-12">
                            <p className="text-gray-500 text-sm">{t('user.noMoodboards')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {boards.items.map((mb) => (
                                <button
                                    key={mb.id}
                                    onClick={() => navigate(`/moodboard/preview/${mb.id}`)}
                                    className="text-left group"
                                >
                                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#D1D1D1] dark:bg-[#2a2a2a] transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                                        {mb.coverImageUrl ? (
                                            <img
                                                src={`${APP_ENV.IMAGES_1200_URL}${mb.coverImageUrl}`}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                                                    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-black dark:text-white text-sm mt-2 truncate group-hover:text-[#4ade80] transition-colors duration-200">
                                        {mb.title}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
            </>
            )}
        </div>

        {followModal && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                onClick={() => setFollowModal(null)}
            >
                <div
                    className="bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-2xl w-80 max-h-[70vh] flex flex-col shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-black/5 dark:border-white/5">
                        <h3 className="text-black dark:text-white text-sm font-semibold capitalize">
                            {followModal === "followers" ? t('user.followers') : t('user.following')}
                        </h3>
                        <button onClick={() => setFollowModal(null)} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                    <div className="overflow-y-auto flex-1 px-3 py-2">
                        {(() => {
                            const list = followModal === "followers" ? followers : following;
                            if (!list) return (
                                <div className="flex justify-center py-8">
                                    <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-[#4ade80] animate-spin" />
                                </div>
                            );
                            if (!list.length) return (
                                <p className="text-gray-500 text-xs text-center py-8">{t('user.noUsers')}</p>
                            );
                            return list.map((u: IUser) => (
                                <button
                                    key={u.id}
                                    onClick={() => { navigate(`/user/${u.id}`); setFollowModal(null); }}
                                    className="flex items-center gap-3 w-full px-2 py-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-full overflow-hidden bg-white/10 shrink-0">
                                        {u.image ? (
                                            <img src={`${APP_ENV.IMAGES_100_URL}${u.image}`} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-sm text-gray-400 bg-black/10 dark:bg-white/5">
                                                {u.userName?.[0]?.toUpperCase() ?? "?"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-left min-w-0">
                                        <p className="text-black dark:text-white text-xs font-medium truncate">
                                            {u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.userName}
                                        </p>
                                        {u.userName && (
                                            <p className="text-gray-500 text-[11px] truncate">@{u.userName}</p>
                                        )}
                                    </div>
                                </button>
                            ));
                        })()}
                    </div>
                </div>
            </div>
        )}
</>
    );
};

export default UserPage;
