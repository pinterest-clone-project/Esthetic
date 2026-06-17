import { useState } from "react";
import { useCreateMoodboardMutation } from "@/services/moodboardService.ts";

interface CreateMoodboardFormProps {
    onSuccess: () => void;
}

const CreateMoodboardForm: React.FC<CreateMoodboardFormProps> = ({ onSuccess }) => {
    const [name, setName] = useState("");
    const [isHidden, setIsHidden] = useState(false);
    const [createMoodboard, { isLoading }] = useCreateMoodboardMutation();

    const handleSubmit = async () => {
        if (!name.trim()) return;
        try {
            await createMoodboard({ name: name.trim(), isHidden }).unwrap();
            onSuccess();
        } catch (error) {
            console.error("Помилка створення Moodboard:", error);
        }
    };

    return (
        <div className="bg-white rounded-[20px] px-8 py-7 w-full">
            <h2 className="text-center text-black text-lg font-semibold mb-5">
                Create your Moodboard
            </h2>

            <div className="flex justify-center mb-6">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1DB954" strokeWidth="1.5">
                    <rect x="3" y="7" width="14" height="14" rx="2" />
                    <path d="M7 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2" />
                </svg>
            </div>

            <label className="block text-sm text-black mb-1">Moodboard name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name your Moodboard"
                className="w-full border border-btn-primary rounded-lg px-3 py-2 text-sm text-black outline-none focus:ring-1 focus:ring-btn-primary mb-5"
            />

            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-sm text-black font-medium">Hide Moodboard</p>
                    <p className="text-xs text-gray-400 max-w-[200px]">
                        Only you can see this Moodboard
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setIsHidden((v) => !v)}
                    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                        isHidden ? "bg-btn-primary" : "bg-gray-300"
                    }`}
                >
                    <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            isHidden ? "translate-x-5" : ""
                        }`}
                    />
                </button>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !name.trim()}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                        name.trim()
                            ? "bg-[#1DB954] text-black hover:bg-[#1aa34a]"
                            : "bg-[#A1A1A1] text-black hover:bg-[#d4d4d4]"
                    }`}
                >
                    {isLoading ? "Creating..." : "Create Moodboard"}
                </button>
            </div>
        </div>
    );
};

export default CreateMoodboardForm;