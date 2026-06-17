import { useGetMoodboardByIdQuery } from "@/services/moodboardService.ts";
import {useNavigate, useParams} from "react-router";
import {APP_ENV} from "@/constants/env";

const MoodboardPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: board, isLoading } = useGetMoodboardByIdQuery(id!);

    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!board) return (
        <div className="text-center text-white mt-20">Board not found</div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="text-[#A1A1A1] hover:text-white transition-colors"
                >
                    ←
                </button>
                {board.coverImageUrl && (
                    <img
                        src={`${APP_ENV.IMAGES_800_URL}${board.coverImageUrl}`}
                        className="w-14 h-14 rounded-xl object-cover"
                    />
                )}
                <div>
                    <h1 className="text-white text-2xl font-semibold">{board.title}</h1>
                    {board.description && (
                        <p className="text-[#A1A1A1] text-sm mt-1">{board.description}</p>
                    )}
                </div>
                <div className="ml-auto flex items-center gap-3">
                    {board.isPrivate && (
                        <span className="text-xs text-[#A1A1A1] bg-[#2a2a2a] px-3 py-1 rounded-full">
                            Private
                        </span>
                    )}
                    <span className="text-xs text-[#A1A1A1]">{board.pinsCount} pins</span>
                </div>
            </div>

            {/* Pins grid */}
            {board.previewImageUrls.length > 0 ? (
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
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-[#A1A1A1]">
                    <p className="text-lg mb-2">No pins yet</p>
                    <p className="text-sm">Save pins to this board to see them here</p>
                </div>
            )}
        </div>
    );
};

export default MoodboardPage;