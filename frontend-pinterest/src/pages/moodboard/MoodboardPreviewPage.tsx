import { useGetMoodboardByIdQuery } from "@/services/moodboardService.ts";
import { useGetMeQuery } from "@/services/accountService.ts";
import { useParams } from "react-router";
import { APP_ENV } from "@/constants/env";
import PinCard from "@/components/ui/PinCard.tsx";

const MoodboardPreviewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: board, isLoading, isError } = useGetMoodboardByIdQuery(id!);
    const { data: me } = useGetMeQuery();
    const isOwner = !!me && !!board && me.id === board.ownerId;

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
            <div className="relative w-full overflow-hidden">
                {board.coverImageUrl && (
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-40"
                        style={{ backgroundImage: `url(${APP_ENV.IMAGES_400_URL}${board.coverImageUrl})` }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 dark:from-black/60 via-white/80 dark:via-black/70 to-white dark:to-black" />

                <div className="relative px-6 pt-10 pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-6">
                    <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-2xl shrink-0 mt-8 sm:mt-0">
                        {board.coverImageUrl ? (
                            <img
                                src={`${APP_ENV.IMAGES_400_URL}${board.coverImageUrl}`}
                                alt={board.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-[#1a1a1a]" />
                        )}
                    </div>

                    <div className="text-center sm:text-left">
                        <h1 className="text-black dark:text-white text-2xl sm:text-3xl font-semibold">{board.title}</h1>
                        {board.description && (
                            <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">{board.description}</p>
                        )}
                        <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                            <span className="text-xs text-gray-600 dark:text-gray-400">{board.pinsCount} pins</span>
                            {board.isPrivate && (
                                <span className="text-xs text-[#A1A1A1] bg-black/10 dark:bg-black/40 px-3 py-1 rounded-full border border-black/10 dark:border-white/10">
                                    Private
                                </span>
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-600">
                                {new Date(board.createdAt).toLocaleDateString("en-GB", {
                                    day: "numeric", month: "long", year: "numeric"
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-8">
                {board.previewPins.length > 0 ? (
                    <>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex-1 h-px bg-black/5 dark:bg-white/5" />
                                <span className="text-gray-600 text-xs tracking-widest uppercase">Pins</span>
                                <div className="flex-1 h-px bg-black/5 dark:bg-white/5" />
                            </div>
                            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3">
                                {board.previewPins.map((pin) => (
                                    <div key={pin.id} className="break-inside-avoid mb-3">
                                        <PinCard pin={pin} boardId={isOwner ? board.id : undefined} />
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