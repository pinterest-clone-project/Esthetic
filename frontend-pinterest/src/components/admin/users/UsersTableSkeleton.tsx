import Skeleton from "react-loading-skeleton";

interface UsersTableSkeletonProps {
    rowCount: number;
}

const UsersTableSkeleton = ({ rowCount }: UsersTableSkeletonProps) => {
    return (
        <>
            {Array.from({ length: rowCount }).map((_, idx) => (
                <tr key={idx} className="border-b border-white/5">
                    <td className="px-4 sm:px-5 py-3">
                        <div className="flex items-center gap-3">
                            <Skeleton circle width={32} height={32} />
                            <Skeleton width={100} height={12} />
                        </div>
                    </td>
                    <td className="px-4 sm:px-5 py-3 hidden sm:table-cell"><Skeleton width={140} height={12} /></td>
                    <td className="px-4 sm:px-5 py-3 hidden lg:table-cell"><Skeleton width={70} height={12} /></td>
                    <td className="px-4 sm:px-5 py-3"><Skeleton width={70} height={20} borderRadius={999} /></td>
                    <td className="px-4 sm:px-5 py-3 hidden md:table-cell"><Skeleton width={80} height={12} /></td>
                    <td className="px-4 sm:px-5 py-3"><Skeleton width={80} height={28} borderRadius={8} /></td>
                </tr>
            ))}
        </>
    );
};

export default UsersTableSkeleton;