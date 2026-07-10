import { useParams, useNavigate } from "react-router";
import { useGetByIdQuery } from "@/services/userService.ts";
import { useGetFollowStatsQuery } from "@/services/userService.ts";
import { useGetPinsByUserQuery } from "@/services/pinService.ts";
import { useGetMeQuery } from "@/services/accountService.ts";
import { useFollowMutation, useUnfollowMutation } from "@/services/followService.ts";
import PinCard from "@/components/ui/PinCard.tsx";
import BackButton from "@/components/ui/BackButton.tsx";
import { APP_ENV } from "@/constants/env";

const UserPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: user, isLoading: userLoading } = useGetByIdQuery(id!);
    const { data: stats } = useGetFollowStatsQuery(id!);
    const { data: pins, isLoading: pinsLoading } = useGetPinsByUserQuery(id!);
    const { data: me } = useGetMeQuery();

    const [follow] = useFollowMutation();
    const [unfollow] = useUnfollowMutation();

    const isMe = me?.id === id;

    const handleFollowToggle = async () => {
        if (!id) return;
        if (stats?.isFollowedByMe) {
            await unfollow(id);
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
            <p className="text-red-400 text-sm">User not found.</p>
        </div>
    );

    return (
        <div className="w-full min-h-full bg-white dark:bg-black px-6 py-8">
            <BackButton />

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
                        <span className="text-gray-500 text-xs">Auras</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                        <span className="text-black dark:text-white text-sm font-semibold">
                            {stats?.followersCount ?? 0}
                        </span>
                        <span className="text-gray-500 text-xs">Followers</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                        <span className="text-black dark:text-white text-sm font-semibold">
                            {stats?.followingCount ?? 0}
                        </span>
                        <span className="text-gray-500 text-xs">Following</span>
                    </div>
                </div>

                {!isMe && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleFollowToggle}
                            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors
                                ${stats?.isFollowedByMe
                                    ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                                    : "bg-[#4ade80] hover:bg-[#22c55e] text-black"
                                }`}
                        >
                            {stats?.isFollowedByMe ? "Following" : "Follow"}
                        </button>
                    </div>
                )}

                {isMe && (
                    <button
                        onClick={() => navigate("/profile")}
                        className="px-5 py-2 rounded-xl text-sm border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors"
                    >
                        Edit profile
                    </button>
                )}
            </div>

            <div className="flex items-center gap-4 mb-6 max-w-4xl mx-auto">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-gray-600 text-xs tracking-widest uppercase">Auras</span>
                <div className="flex-1 h-px bg-white/5" />
            </div>

            {pinsLoading && (
                <div className="flex justify-center py-12">
                    <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-[#4ade80] animate-spin" />
                </div>
            )}

            {!pinsLoading && !pins?.length && (
                <div className="flex justify-center py-12">
                    <p className="text-gray-500 text-sm">No auras yet.</p>
                </div>
            )}

            {!pinsLoading && !!pins?.length && (
                <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3">
                    {pins.map(p => (
                        <PinCard key={p.id} pin={p} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserPage;
