import { useTranslation } from "react-i18next";
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
    const { t, i18n } = useTranslation('admin');

    return (
        <tr className="border-b border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
            <td className="px-4 sm:px-5 py-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                        {user.image ? (
                            <img src={`${APP_ENV.IMAGES_100_URL}${user.image}`} alt={user.userName ?? ""} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs text-gray-500 dark:text-white/50">
                                {(user.userName ?? "?").charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-gray-800 dark:text-white/90 tracking-[-0.2px] truncate">
                            {user.userName}
                            {isSelf && <span className="ml-1.5 text-[10px] text-gray-400 dark:text-white/30">{t('users.you')}</span>}
                        </p>
                        {(user.firstName || user.lastName) && (
                            <p className="text-gray-400 dark:text-white/30 text-xs truncate">
                                {[user.firstName, user.lastName].filter(Boolean).join(" ")}
                            </p>
                        )}
                    </div>
                </div>
            </td>
            <td className="px-4 sm:px-5 py-3 hidden sm:table-cell text-gray-500 dark:text-white/50 truncate max-w-[200px]">
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
                                        ? "bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400"
                                        : "bg-gray-200 dark:bg-white/8 text-gray-600 dark:text-white/50"
                                }`}
                            >
                                {role}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-300 dark:text-white/20 text-xs">—</span>
                    )}
                </div>
            </td>
            <td className="px-4 sm:px-5 py-3">
                {user.isBlocked ? (
                    user.blockReason ? (
                        <button
                            onClick={() => onShowReason(user)}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 transition-colors"
                        >
                            {t('users.status.blocked')}
                        </button>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400">
                            {t('users.status.blocked')}
                        </span>
                    )
                ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-btn-primary/10 text-btn-primary">
                        {t('users.status.active')}
                    </span>
                )}
            </td>
            <td className="px-4 sm:px-5 py-3 hidden md:table-cell text-gray-400 dark:text-white/40">
                {new Date(user.createdAt).toLocaleDateString(i18n.language)}
            </td>
            <td className="px-4 sm:px-5 py-3 text-right">
                {user.isBlocked ? (
                    <button
                        onClick={() => onUnblock(user.id)}
                        disabled={isUnblocking}
                        className="text-xs px-3 py-1.5 rounded-xl bg-gray-200 dark:bg-white/8 text-gray-700 dark:text-white/80 hover:bg-gray-300 dark:hover:bg-white/15 transition-colors disabled:opacity-50"
                    >
                        {t('users.unblock')}
                    </button>
                ) : blockAllowed ? (
                    <button
                        onClick={() => onBlockClick(user)}
                        className="text-xs px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 transition-colors"
                    >
                        {t('users.block')}
                    </button>
                ) : (
                    <span
                        className="text-xs px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/4 text-gray-400 dark:text-white/20 cursor-not-allowed select-none"
                        title={isSelf ? t('users.cannotBlockSelf') : isAdminUser ? t('users.cannotBlockAdmin') : undefined}
                    >
                        {t('users.block')}
                    </span>
                )}
            </td>
        </tr>
    );
};

export default UserTableRow;
