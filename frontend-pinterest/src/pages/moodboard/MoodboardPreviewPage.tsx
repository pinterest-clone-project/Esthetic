import { useGetMoodboardByIdQuery } from "@/services/moodboardService.ts";
import { useParams } from "react-router";
import { APP_ENV } from "@/constants/env";
import BackButton from "@/components/ui/BackButton.tsx";

const MoodboardPreviewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: board, isLoading, isError } = useGetMoodboardByIdQuery(id!);

    if (isLoading) return (
        <div className="w-full min-h-full bg-white dark:bg-[#000000] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#1DB954] animate-spin" />
        </div>
    );

    if (isError || !board) return (
        <div className="w-full min-h-full bg-white dark:bg-[#000000] flex items-center justify-center">
            <p className="text-red-400 text-sm">Board not found.</p>
        </div>
    );

    return (
        <div className="w-full min-h-full bg-white dark:bg-[#000000]">
            <div className="relative w-full h-[380px] overflow-hidden">
                {board.coverImageUrl ? (
                    <img
                        src={`${APP_ENV.IMAGES_1200_URL}${board.coverImageUrl}`}
                        alt={board.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-[#1a1a1a]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white/100 dark:from-black/80 via-white/40 dark:via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 px-6 py-6">
                    <BackButton />
                    <h1 className="text-black dark:text-white text-3xl font-semibold">{board.title}</h1>
                    {board.description && (
                        <p className="text-gray-300 text-sm mt-1">{board.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400">{board.pinsCount} pins</span>
                        {board.isPrivate && (
                            <span className="text-xs text-[#A1A1A1] bg-black/40 px-3 py-1 rounded-full border border-white/10">
                            Private
                        </span>
                        )}
                        <span className="text-xs text-gray-800 dark:text-gray-600">
                        {new Date(board.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric", month: "long", year: "numeric"
                        })}
                    </span>
                    </div>
                </div>
            </div>

            {/* Pins */}
            <div className="px-6 py-8">
                {board.previewImageUrls.length > 0 ? (
                    <>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1 h-px bg-white/5" />
                            <span className="text-gray-600 text-xs tracking-widest uppercase">Pins</span>
                            <div className="flex-1 h-px bg-white/5" />
                        </div>
                        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3">
                            {board.previewImageUrls.map((url) => (
                                <div key={url} className="break-inside-avoid mb-3">
                                    <img
                                        src={`${APP_ENV.IMAGES_800_URL}${url}`}
                                        className="w-full rounded-xl object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-black dark:text-[#A1A1A1]">
                        <p className="text-lg mb-2">No pins yet</p>
                        <p className="text-sm">Save pins to this board to see them here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MoodboardPreviewPage;