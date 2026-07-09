import { useState } from "react";
import { useCreateMoodboardMutation } from "@/services/moodboardService.ts";
import {useGetMyPinsQuery} from "@/services/pinService.ts";
import { APP_ENV } from "@/constants/env";
import collectionIcon from "../../../src/assets/icons/collection_icon_green.svg";
import {useGetRecommendedPinsQuery} from "@/services/recommendedPinsService.ts";

interface CreateMoodboardFormProps {
    onSuccess: () => void;
}

const CreateMoodboardForm: React.FC<CreateMoodboardFormProps> = ({ onSuccess }) => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);


    const { data: myPins } = useGetMyPinsQuery(undefined, { skip: step === 1 });
    const { data: recommendedPins } = useGetRecommendedPinsQuery(undefined, { skip: step === 1 });

    const pinsToShow = [
        ...(myPins ?? []),
        ...(recommendedPins ?? []).filter(
            (rec) => !myPins?.some((mine) => mine.id === rec.id)
        ),
    ];


    const [selectedPinIds, setSelectedPinIds] = useState<string[]>([]);

    const togglePin = (id: string) => {
        setSelectedPinIds((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };


    const [createMoodboard, { isLoading }] = useCreateMoodboardMutation();


    const handleSubmit = async () => {
        if (!title.trim()) return;
        try {
            await createMoodboard({
                title: title.trim(),
                description: description.trim() || undefined,
                isPrivate,
                pinIds: selectedPinIds,
            }).unwrap();

            onSuccess();
        } catch (error) {
            console.error("Помилка створення Board:", error);
        }
    };

    return (
        <div className="bg-black dark:bg-white rounded-[20px] px-8 py-7 w-full">
            {step === 1 && (
                <>
                    <h2 className="text-center text-white dark:text-black text-lg font-semibold mb-5">
                        Create your Moodboard
                    </h2>

                    <div className="flex justify-center mb-6">
                        <img src={collectionIcon} alt="" width={64} height={64} />
                    </div>

                    <label className="block text-sm text-white dark:text-black mb-1">Moodboard name</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Name your Moodboard"
                        className="w-full border border-btn-primary rounded-lg px-3 py-2 text-sm text-white dark:text-black outline-none focus:ring-1 focus:ring-btn-primary mb-5"
                    />

                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <p className="text-sm text-white dark:text-black font-medium">Hide Moodboard</p>
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
            )}

            {step === 2 && (
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
                        rows={4}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-white dark:text-black outline-none focus:ring-1 focus:ring-[#1DB954] mb-6 resize-none"
                    />

                    <div className="flex justify-center">
                        <button
                            onClick={() => setStep(3)}
                            className="px-5 py-2 rounded-lg bg-[#1DB954] text-white dark:text-black text-sm font-medium hover:bg-[#1aa34a] transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            {step === 3 && (
                <>
                    <h2 className="text-center text-white dark:text-black text-lg font-semibold mb-5">
                        Choose Aura
                    </h2>

                    {pinsToShow && pinsToShow.length > 0 ? (
                        <div className="grid grid-cols-3 gap-3 mb-6 max-h-[340px] overflow-y-auto">
                            {pinsToShow.map((pin) => {
                                const isSelected = selectedPinIds.includes(pin.id);
                                return (
                                    <div
                                        key={pin.id}
                                        onClick={() => togglePin(pin.id)}
                                        className="relative cursor-pointer rounded-lg overflow-hidden aspect-square"
                                    >
                                        <img
                                            src={pin.image ? `${APP_ENV.IMAGES_800_URL}${pin.image}` : undefined}
                                            className="w-full h-full object-cover"
                                        />
                                        {isSelected && (
                                            <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-[#1DB954] flex items-center justify-center">
                                                <svg width="12" height="10" viewBox="0 0 10 8" fill="none">
                                                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 mb-6">Nothing to show here</p>
                    )}

                    <div className="flex justify-center">
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="px-8 py-2 rounded-lg bg-[#1DB954] text-black text-sm font-medium hover:bg-[#1aa34a] transition-colors disabled:opacity-50"
                        >
                            {isLoading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CreateMoodboardForm;