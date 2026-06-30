import { useEffect, useMemo, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSearchUsersQuery, useBlockUserMutation, useUnblockUserMutation } from "@/services/userService.ts";
import type { IUser } from "@/types/user/IUser.ts";

const PAGE_SIZE = 10;

type StatusFilter = "all" | "active" | "blocked";

const AdminUsersPage = () => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [status, setStatus] = useState<StatusFilter>("all");
    const [page, setPage] = useState(1);
    const [blockTarget, setBlockTarget] = useState<IUser | null>(null);
    const [blockReason, setBlockReason] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timeout);
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, status]);

    const isBlockedParam = useMemo<boolean | undefined>(() => {
        if (status === "active") return false;
        if (status === "blocked") return true;
        return undefined;
    }, [status]);

    const { data, isLoading, isFetching } = useSearchUsersQuery({
        search: debouncedSearch || undefined,
        isBlocked: isBlockedParam,
        page,
        pageSize: PAGE_SIZE,
        sortBy: "CreatedAt",
        sortDirection: "Desc",
    });

    const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
    const [unblockUser, { isLoading: isUnblocking }] = useUnblockUserMutation();

    const isLoadingState = isLoading || (isFetching && !data);
    const totalPages = data?.totalPages ?? 1;

    const handleBlockSubmit = async () => {
        if (!blockTarget || !blockReason.trim()) return;
        await blockUser({ id: blockTarget.id, reason: blockReason.trim() }).unwrap();
        setBlockTarget(null);
        setBlockReason("");
    };

    const handleUnblock = async (id: string) => {
        await unblockUser(id).unwrap();
    };

    return (
        <SkeletonTheme baseColor="#202020" highlightColor="#333333">
            <div className="relative z-10 w-full max-w-full overflow-hidden">
                <h1 className="text-xl sm:text-2xl font-bold tracking-[-0.5px] mb-1">Користувачі</h1>
                <p className="text-xs sm:text-sm text-white/30 mb-6 sm:mb-8 tracking-[-0.3px]">
                    Управління користувачами та блокування
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Пошук за іменем або email..."
                        className="flex-1 bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-btn-primary/50 transition-colors"
                    />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as StatusFilter)}
                        className="bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white/80 outline-none focus:border-btn-primary/50 transition-colors"
                    >
                        <option value="all">Усі</option>
                        <option value="active">Активні</option>
                        <option value="blocked">Заблоковані</option>
                    </select>
                </div>

                <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="border-b border-white/8 text-white/40 text-xs uppercase">
                                <th className="text-left font-medium px-4 sm:px-5 py-3">Користувач</th>
                                <th className="text-left font-medium px-4 sm:px-5 py-3 hidden sm:table-cell">Email</th>
                                <th className="text-left font-medium px-4 sm:px-5 py-3">Статус</th>
                                <th className="text-left font-medium px-4 sm:px-5 py-3 hidden md:table-cell">Дата реєстрації</th>
                                <th className="text-right font-medium px-4 sm:px-5 py-3">Дії</th>
                            </tr>
                            </thead>
                            <tbody>
                            {isLoadingState
                                ? Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                                    <tr key={idx} className="border-b border-white/5">
                                        <td className="px-4 sm:px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <Skeleton circle width={32} height={32} />
                                                <Skeleton width={100} height={12} />
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-5 py-3 hidden sm:table-cell"><Skeleton width={140} height={12} /></td>
                                        <td className="px-4 sm:px-5 py-3"><Skeleton width={70} height={20} borderRadius={999} /></td>
                                        <td className="px-4 sm:px-5 py-3 hidden md:table-cell"><Skeleton width={80} height={12} /></td>
                                        <td className="px-4 sm:px-5 py-3"><Skeleton width={80} height={28} borderRadius={8} /></td>
                                    </tr>
                                ))
                                : data?.items.map((user) => (
                                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-4 sm:px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                                    {user.image ? (
                                                        <img src={user.image} alt={user.userName ?? ""} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs text-white/50">
                                                                {(user.userName ?? "?").charAt(0).toUpperCase()}
                                                            </span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-white/90 tracking-[-0.2px] truncate">{user.userName}</p>
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
                                        <td className="px-4 sm:px-5 py-3">
                                            {user.isBlocked ? (
                                                <span
                                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-red-500/10 text-red-400 cursor-help"
                                                    title={user.blockReason ?? undefined}
                                                >
                                                        Заблокований
                                                    </span>
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
                                                    onClick={() => handleUnblock(user.id)}
                                                    disabled={isUnblocking}
                                                    className="text-xs px-3 py-1.5 rounded-xl bg-white/8 text-white/80 hover:bg-white/15 transition-colors disabled:opacity-50"
                                                >
                                                    Розблокувати
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setBlockTarget(user)}
                                                    className="text-xs px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                >
                                                    Блокувати
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            }
                            {!isLoadingState && data?.items.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 sm:px-5 py-8 text-center text-white/30 text-sm">
                                        Користувачів не знайдено
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {!isLoadingState && data && data.totalCount > 0 && (
                    <div className="flex items-center justify-between mt-4 text-xs text-white/40">
                        <span>
                            Сторінка {data.page} з {totalPages} · Всього {data.totalCount}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="px-3 py-1.5 rounded-xl bg-white/8 text-white/70 hover:bg-white/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Назад
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                                className="px-3 py-1.5 rounded-xl bg-white/8 text-white/70 hover:bg-white/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Далі
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {blockTarget && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 sm:p-6 w-full max-w-sm">
                        <h3 className="text-base font-semibold tracking-[-0.3px] mb-1">
                            Блокувати {blockTarget.userName}?
                        </h3>
                        <p className="text-xs text-white/40 mb-4">
                            Вкажіть причину блокування, її побачить тільки адміністрація
                        </p>
                        <textarea
                            value={blockReason}
                            onChange={(e) => setBlockReason(e.target.value)}
                            placeholder="Причина блокування..."
                            maxLength={250}
                            rows={3}
                            className="w-full bg-[#121212] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-btn-primary/50 transition-colors resize-none"
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => {
                                    setBlockTarget(null);
                                    setBlockReason("");
                                }}
                                className="px-4 py-2 rounded-xl text-xs text-white/60 hover:bg-white/8 transition-colors"
                            >
                                Скасувати
                            </button>
                            <button
                                onClick={handleBlockSubmit}
                                disabled={!blockReason.trim() || isBlocking}
                                className="px-4 py-2 rounded-xl text-xs bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors disabled:opacity-40"
                            >
                                Заблокувати
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SkeletonTheme>
    );
};

export default AdminUsersPage;