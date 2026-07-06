import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchUsersQuery, useBlockUserMutation, useUnblockUserMutation } from "@/services/userService.ts";
import type { IUser } from "@/types/user/IUser.ts";
import { selectUser } from "@/store/selectors/authSelectors";
import {useAdminUsersFilters} from "@/hooks/useAdminUsersFilters.ts";
import UsersFilters from "@/components/admin/users/UsersFilters.tsx";
import UsersTable from "@/components/admin/users/UsersTable.tsx";
import UsersPagination from "@/components/admin/users/UsersPagination.tsx";
import BlockUserModal from "@/components/admin/users/BlockUserModal.tsx";
import BlockReasonModal from "@/components/admin/users/BlockReasonModal.tsx";

const AdminUsersPage = () => {
    const currentUser = useSelector(selectUser);

    const {
        search,
        setSearch,
        debouncedSearch,
        status,
        setStatus,
        page,
        setPage,
        pageSize,
        handlePageSizeChange,
        sortBy,
        sortDirection,
        sortValue,
        handleSortChange,
        isBlockedParam,
    } = useAdminUsersFilters();

    const [blockTarget, setBlockTarget] = useState<IUser | null>(null);
    const [blockReason, setBlockReason] = useState("");
    const [reasonTarget, setReasonTarget] = useState<IUser | null>(null);

    const { data, isLoading, isFetching } = useSearchUsersQuery({
        search: debouncedSearch || undefined,
        isBlocked: isBlockedParam,
        page,
        pageSize,
        sortBy,
        sortDirection,
    });

    const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
    const [unblockUser, { isLoading: isUnblocking }] = useUnblockUserMutation();

    const isLoadingState = isLoading || (isFetching && !data);
    const totalPages = data?.totalPages ?? 1;

    useEffect(() => {
        if (data && totalPages > 0 && page > totalPages) {
            setPage(totalPages);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, totalPages]);

    const canBlockUser = (user: IUser) => {
        if (user.id === currentUser?.id) return false;
        if (user.roles?.includes("Admin")) return false;
        return true;
    };

    const handleBlockSubmit = async () => {
        if (!blockTarget || !blockReason.trim()) return;
        if (!canBlockUser(blockTarget)) {
            setBlockTarget(null);
            setBlockReason("");
            return;
        }
        await blockUser({ id: blockTarget.id, reason: blockReason.trim() }).unwrap();
        setBlockTarget(null);
        setBlockReason("");
    };

    const handleUnblock = async (id: string) => {
        await unblockUser(id).unwrap();
    };

    return (
        <div className="relative z-10 w-full max-w-full overflow-hidden">
            <h1 className="text-xl sm:text-2xl font-bold tracking-[-0.5px] mb-1">Користувачі</h1>
            <p className="text-xs sm:text-sm text-white/30 mb-6 sm:mb-8 tracking-[-0.3px]">
                Управління користувачами та блокування
            </p>

            <UsersFilters
                search={search}
                onSearchChange={setSearch}
                status={status}
                onStatusChange={setStatus}
                sortValue={sortValue}
                onSortChange={handleSortChange}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
            />

            <UsersTable
                items={data?.items}
                isLoadingState={isLoadingState}
                skeletonRowCount={Math.min(pageSize, 10)}
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
                currentUserId={currentUser?.id}
                canBlockUser={canBlockUser}
                isUnblocking={isUnblocking}
                onShowReason={setReasonTarget}
                onBlockClick={setBlockTarget}
                onUnblock={handleUnblock}
            />

            {!isLoadingState && data && (
                <UsersPagination
                    page={data.page}
                    totalPages={totalPages}
                    totalCount={data.totalCount}
                    onPageChange={setPage}
                />
            )}

            {blockTarget && (
                <BlockUserModal
                    target={blockTarget}
                    reason={blockReason}
                    onReasonChange={setBlockReason}
                    onCancel={() => {
                        setBlockTarget(null);
                        setBlockReason("");
                    }}
                    onConfirm={handleBlockSubmit}
                    isBlocking={isBlocking}
                />
            )}

            {reasonTarget && (
                <BlockReasonModal target={reasonTarget} onClose={() => setReasonTarget(null)} />
            )}
        </div>
    );
};

export default AdminUsersPage;