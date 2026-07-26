import { useTranslation } from "react-i18next";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import type { IUser } from "@/types/user/IUser.ts";
import type { UserSortBy } from "@/types/user/UserSortBy.ts";
import type { SortDirection } from "@/types/SortDirection.ts";
import type { Theme } from "@/context/ThemeContext.tsx";
import UsersTableSkeleton from "./UsersTableSkeleton";
import UserTableRow from "./UserTableRow";

interface UsersTableProps {
    items: IUser[] | undefined;
    isLoadingState: boolean;
    skeletonRowCount: number;
    sortBy: UserSortBy;
    sortDirection: SortDirection;
    onSortChange: (value: string) => void;
    currentUserId: string | undefined;
    canBlockUser: (user: IUser) => boolean;
    isUnblocking: boolean;
    onShowReason: (user: IUser) => void;
    onBlockClick: (user: IUser) => void;
    onUnblock: (id: string) => void;
    theme: Theme;
}

const UsersTable = ({
                        items,
                        isLoadingState,
                        skeletonRowCount,
                        sortBy,
                        sortDirection,
                        onSortChange,
                        currentUserId,
                        canBlockUser,
                        isUnblocking,
                        onShowReason,
                        onBlockClick,
                        onUnblock,
                        theme,
                    }: UsersTableProps) => {
    const { t } = useTranslation('admin');
    const isDark = theme === 'dark';

    return (
        <SkeletonTheme 
            baseColor={isDark ? "#202020" : "#e5e7eb"} 
            highlightColor={isDark ? "#333333" : "#f3f4f6"}
        >
            <div className="bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/8 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b border-gray-200 dark:border-white/8 text-gray-400 dark:text-white/40 text-xs uppercase">
                            <th
                                className="text-left font-medium px-4 sm:px-5 py-3 cursor-pointer select-none hover:text-gray-600 dark:hover:text-white/60"
                                onClick={() => onSortChange(sortBy === "UserName" ? (sortDirection === "Asc" ? "UserName:Desc" : "UserName:Asc") : "UserName:Asc")}
                            >
                                {t('users.table.user')}{sortBy === "UserName" ? (sortDirection === "Asc" ? " ↑" : " ↓") : ""}
                            </th>
                            <th className="text-left font-medium px-4 sm:px-5 py-3 hidden sm:table-cell">{t('users.table.email')}</th>
                            <th className="text-left font-medium px-4 sm:px-5 py-3 hidden lg:table-cell">{t('users.table.roles')}</th>
                            <th className="text-left font-medium px-4 sm:px-5 py-3">{t('users.table.status')}</th>
                            <th
                                className="text-left font-medium px-4 sm:px-5 py-3 hidden md:table-cell cursor-pointer select-none hover:text-gray-600 dark:hover:text-white/60"
                                onClick={() => onSortChange(sortBy === "CreatedAt" ? (sortDirection === "Asc" ? "CreatedAt:Desc" : "CreatedAt:Asc") : "CreatedAt:Desc")}
                            >
                                {t('users.table.registered')}{sortBy === "CreatedAt" ? (sortDirection === "Asc" ? " ↑" : " ↓") : ""}
                            </th>
                            <th className="text-right font-medium px-4 sm:px-5 py-3">{t('users.table.actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {isLoadingState ? (
                            <UsersTableSkeleton rowCount={skeletonRowCount} />
                        ) : (
                            items?.map((user) => (
                                <UserTableRow
                                    key={user.id}
                                    user={user}
                                    isSelf={user.id === currentUserId}
                                    isAdminUser={!!user.roles?.includes("Admin")}
                                    blockAllowed={canBlockUser(user)}
                                    isUnblocking={isUnblocking}
                                    onShowReason={onShowReason}
                                    onBlockClick={onBlockClick}
                                    onUnblock={onUnblock}
                                />
                            ))
                        )}
                        {!isLoadingState && items?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 sm:px-5 py-8 text-center text-gray-400 dark:text-white/30 text-sm">
                                    {t('users.table.notFound')}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default UsersTable;
