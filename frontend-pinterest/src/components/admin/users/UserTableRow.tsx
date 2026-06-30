import { APP_ENV } from "@/constants/env";
import type { IUser } from "@/types/user/IUser.ts";

interface UserTableRowProps {
    user: IUser;
    isSelf: boolean;
    isAdminUser: boolean;
    blockAllowed: boolean;
    isUnblocking: boolean;
    onShowReason: (user: IUser) => void;
    onBlockClick: (user: IUser) => void;
    onUnblock: (id: string) => void;
}

const UserTableRow = ({
                          user,
                          isSelf,
                          isAdminUser,
                          blockAllowed,
                          isUnblocking,
                          onShowReason,
                          onBlockClick,
                          onUnblock,
                      }: UserTableRowProps) => {
    return (
        <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
            <td className="px-4 sm:px-5 py-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                        {user.image ? (
                            <img src={`${APP_ENV.IMAGES_100_URL}${user.image}`} alt={user.userName ?? ""} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs text-white/50">
                                {(user.userName ?? "?").charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-white/90 tracking-[-0.2px] truncate">
                            {user.userName}
                            {isSelf && <span className="ml-1.5 text-[10px] text-white/30">(ви)</span>}
                        </p>
                        {(user.firstName || user.lastName) && (
                            <p className="text-white/30 text-xs truncate">
                                {[user.firstName, user.lastName].filter(Boolean).join(" ")}
                            </p>
                        )}
                    </div>
                </div>
            </td>
            <td className="px-4 sm:px-5 py-3 hidden sm:table-cell text-white/50 truncate max-w-[200px]">
                {user.email}
            </td>
            <td className="px-4 sm:px-5 py-3 hidden lg:table-cell">
                <div className="flex flex-wrap gap-1">
                    {user.roles && user.roles.length > 0 ? (
                        user.roles.map((role) => (
                            <span
                                key={role}
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] ${
                                    role === "Admin"
                                        ? "bg-purple-500/10 text-purple-400"
                                        : "bg-white/8 text-white/50"
                                }`}
                            >
                                {role}
                            </span>
                        ))
                    ) : (
                        <span className="text-white/20 text-xs">—</span>
                    )}
                </div>
            </td>
            <td className="px-4 sm:px-5 py-3">
                {user.isBlocked ? (
                    user.blockReason ? (
                        <button
                            onClick={() => onShowReason(user)}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                            Заблокований
                        </button>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-red-500/10 text-red-400">
                            Заблокований
                        </span>
                    )
                ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-btn-primary/10 text-btn-primary">
                        Активний
                    </span>
                )}
            </td>
            <td className="px-4 sm:px-5 py-3 hidden md:table-cell text-white/40">
                {new Date(user.createdAt).toLocaleDateString("uk-UA")}
            </td>
            <td className="px-4 sm:px-5 py-3 text-right">
                {user.isBlocked ? (
                    <button
                        onClick={() => onUnblock(user.id)}
                        disabled={isUnblocking}
                        className="text-xs px-3 py-1.5 rounded-xl bg-white/8 text-white/80 hover:bg-white/15 transition-colors disabled:opacity-50"
                    >
                        Розблокувати
                    </button>
                ) : blockAllowed ? (
                    <button
                        onClick={() => onBlockClick(user)}
                        className="text-xs px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                        Блокувати
                    </button>
                ) : (
                    <span
                        className="text-xs px-3 py-1.5 rounded-xl bg-white/4 text-white/20 cursor-not-allowed select-none"
                        title={isSelf ? "Не можна заблокувати себе" : isAdminUser ? "Не можна заблокувати адміністратора" : undefined}
                    >
                        Блокувати
                    </span>
                )}
            </td>
        </tr>
    );
};

export default UserTableRow;