import { useNavigate } from "react-router";
import { useGetBlockedUsersQuery, useDefaultUnblockUserMutation } from "@/services/blockService.ts";
import { APP_ENV } from "@/constants/env";
import profileIcon from "@/assets/icons/profile_icon.svg";

const BlockedUsersPage = () => {
    const navigate = useNavigate();
    const { data: blockedUsers, isLoading } = useGetBlockedUsersQuery();
    const [unblockUser] = useDefaultUnblockUserMutation();

    return (
        <div className="flex flex-col px-4 py-6 gap-2 text-black dark:text-white">
            <div className="flex items-center gap-3 mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#f5f5f5] dark:bg-[#1a1a1a]"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>
                <h1 className="text-xl font-bold">Blocked Users</h1>
            </div>

            {isLoading && (
                <div className="flex justify-center py-10">
                    <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-[#4ade80] animate-spin"/>
                </div>
            )}

            {!isLoading && blockedUsers?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A1A1A1" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                    </svg>
                    <p className="text-[#A1A1A1] text-sm">No blocked users</p>
                </div>
            )}

            <div className="flex flex-col gap-2">
                {blockedUsers?.map(user => (
                    <div
                        key={user.userId}
                        className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl bg-[#f5f5f5] dark:bg-[#1a1a1a]"
                    >
                        <div
                            className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[var(--color-btn-primary)] flex items-center justify-center cursor-pointer"
                            onClick={() => navigate(`/user/${user.userId}`)}
                        >
                            {user.image
                                ? <img src={`${APP_ENV.IMAGES_100_URL}${user.image}`} className="w-full h-full object-cover" alt="" />
                                : <img src={profileIcon} className="w-5 h-5 brightness-0 invert" alt="" />
                            }
                        </div>
                        <p
                            className="text-sm font-medium flex-1 cursor-pointer"
                            onClick={() => navigate(`/user/${user.userId}`)}
                        >
                            {user.name}
                        </p>
                        <button
                            onClick={() => unblockUser(user.userId)}
                            className="text-xs text-orange-400 hover:text-orange-300 border border-orange-500/20 hover:border-orange-400/40 hover:bg-orange-500/10 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            Unblock
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlockedUsersPage;
