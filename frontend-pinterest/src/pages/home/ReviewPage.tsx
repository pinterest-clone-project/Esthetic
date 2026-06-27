import PinCard from "@/components/ui/PinCard.tsx";
import {useMemo} from "react";
import {useGetRecommendedPinsQuery} from "@/services/recommendedPinsService.ts";



const PinCardSkeleton = ({ height }: { height: number }) => (
    <div className="break-inside-avoid mb-3 rounded-xl overflow-hidden bg-white/5 animate-pulse"
         style={{ height: `${height}px` }} />
);

const ReviewPage = () => {
    const { data: pins, isLoading, isError } = useGetRecommendedPinsQuery();

    const skeletonHeights = useMemo(
        () => Array.from({ length: 12 }, () => Math.floor(Math.random() * 120) + 160),
        []
    );

    return (
        <div className="w-full min-h-full bg-white dark:bg-black px-2 py-4 sm:px-6 sm:py-6">

            {isError && (
                <div className="flex items-center justify-center h-40">
                    <p className="text-red-400 text-sm">Failed to load pins.</p>
                </div>
            )}

            {/* Masonry grid */}
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3">
                {isLoading
                    ? skeletonHeights.map((h, i) => <PinCardSkeleton key={i} height={h} />)
                    : pins?.map(pin => <PinCard key={pin.id} pin={pin} />)
                }
            </div>

            {!isLoading && !isError && pins?.length === 0 && (
                <div className="flex items-center justify-center h-40">
                    <p className="text-gray-500 text-sm">No pins yet.</p>
                </div>
            )}
        </div>
    );
};

export default ReviewPage;

