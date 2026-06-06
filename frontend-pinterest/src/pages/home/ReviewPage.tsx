import { useGetAllPinsQuery } from "../../services/pinService.ts";
import PinCard from "../../components/UI/PinCard.tsx";

const PinCardSkeleton = () => (
    <div className="break-inside-avoid mb-3 rounded-xl overflow-hidden bg-white/5 animate-pulse"
         style={{ height: `${Math.floor(Math.random() * 120) + 160}px` }} />
);

const ReviewPage = () => {
    const { data: pins, isLoading, isError } = useGetAllPinsQuery();

    return (
        <div className="w-full min-h-full bg-[#000000] px-6 py-6">

            {isError && (
                <div className="flex items-center justify-center h-40">
                    <p className="text-red-400 text-sm">Failed to load pins.</p>
                </div>
            )}

            {/* Masonry grid */}
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3">
                {isLoading
                    ? Array.from({ length: 12 }).map((_, i) => <PinCardSkeleton key={i} />)
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

