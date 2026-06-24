import { useState } from "react";
import { useCreateMoodboardMutation } from "@/services/moodboardService.ts";
import {useGetMyPinsQuery} from "@/services/pinService.ts";
import { APP_ENV } from "@/constants/env";

interface CreateMoodboardFormProps {
    onSuccess: () => void;
}

const CreateMoodboardForm: React.FC<CreateMoodboardFormProps> = ({ onSuccess }) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [selectedCoverPinId, setSelectedCoverPinId] = useState<string | null>(null);

    const [createMoodboard, { isLoading }] = useCreateMoodboardMutation();
    const { data: myPins } = useGetMyPinsQuery(undefined, {
        skip: step === 1,
    });

    const handleSubmit = async () => {
        if (!title.trim()) return;
        try {
            let coverImageFile: File | undefined;

            if (selectedCoverPinId) {
                const pin = myPins?.find(p => p.id === selectedCoverPinId);
                if (pin?.image) {
                    const res = await fetch(`${APP_ENV.IMAGES_800_URL}${pin.image}`);
                    const blob = await res.blob();
                    coverImageFile = new File([blob], "cover.jpg", { type: blob.type });
                }
            }

            await createMoodboard({
                title: title.trim(),
                description: description.trim() || undefined,
                isPrivate,
                coverImageFile,
            }).unwrap();

            onSuccess();
        } catch (error) {
            console.error("Помилка створення Board:", error);
        }
    };

    return (
        <div className="bg-black dark:bg-white rounded-[20px] px-8 py-7 w-full">
            {step === 1 ? (
                <>
                    <h2 className="text-center text-white dark:text-black text-lg font-semibold mb-5">
                        Create your Board
                    </h2>

                    <div className="flex justify-center mb-6">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1DB954" strokeWidth="1.5">
                            <rect x="3" y="7" width="14" height="14" rx="2" />
                            <path d="M7 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2" />
                        </svg>
                    </div>

                    <label className="block text-sm text-white dark:text-black mb-1">Board name</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Name your Board"
                        className="w-full border border-btn-primary rounded-lg px-3 py-2 text-sm text-white dark:text-black outline-none focus:ring-1 focus:ring-btn-primary mb-5"
                    />

                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <p className="text-sm text-white dark:text-black font-medium">Private Board</p>
                            <p className="text-xs text-gray-400 max-w-[200px]">
                                Only you can see this Board
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsPrivate((v) => !v)}
                            className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                                isPrivate ? "bg-[#1DB954]" : "bg-gray-300"
                            }`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black dark:bg-white rounded-full transition-transform ${
                                    isPrivate ? "translate-x-5" : ""
                                }`}
                            />
                        </button>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={() => setStep(2)}
                            disabled={!title.trim()}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                                title.trim()
                                    ? "bg-[#1DB954] text-white dark:text-black hover:bg-[#1aa34a]"
                                    : "bg-[#A1A1A1] text-white dark:text-black"
                            }`}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center mb-5">
                        <button
                            onClick={() => setStep(1)}
                            className="text-gray-400 hover:text-black transition-colors mr-3"
                        >
                            ←
                        </button>
                        <h2 className="text-white dark:text-black text-lg font-semibold">Add details</h2>
                    </div>

                    <label className="block text-sm text-white dark:text-black mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What's this board about?"
                        rows={3}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-white dark:text-black outline-none focus:ring-1 focus:ring-[#1DB954] mb-5 resize-none"
                    />

                    <label className="block text-sm text-white dark:text-black mb-2">Choose cover</label>
                    {myPins && myPins.length > 0 ? (
                        <div className="grid grid-cols-4 gap-2 mb-6 max-h-[200px] overflow-y-auto">
                            {myPins.map((pin) => (
                                <div
                                    key={pin.id}
                                    onClick={() => setSelectedCoverPinId(
                                        selectedCoverPinId === pin.id ? null : pin.id
                                    )}
                                    className={`relative cursor-pointer rounded-lg overflow-hidden aspect-square border-2 transition-colors ${
                                        selectedCoverPinId === pin.id
                                            ? "border-[#1DB954]"
                                            : "border-transparent"
                                    }`}
                                >
                                    <img
                                        src={pin.image ? `${APP_ENV.IMAGES_200_URL}${pin.image}` : undefined}
                                        className="w-full h-full object-cover"
                                    />
                                    {selectedCoverPinId === pin.id && (
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                            <span className="text-white text-lg">✓</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 mb-6">No pins yet — you can add a cover later</p>
                    )}

                    <div className="flex justify-center">
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="px-5 py-2 rounded-lg bg-[#1DB954] text-black text-sm font-medium hover:bg-[#1aa34a] transition-colors disabled:opacity-50"
                        >
                            {isLoading ? "Creating..." : "Create Board"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CreateMoodboardForm;