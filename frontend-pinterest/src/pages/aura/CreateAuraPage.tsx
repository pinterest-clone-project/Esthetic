import { useState } from "react";
import { useCreatePinMutation } from "../../services/pinService.ts";
import { useGetAllCategoriesQuery } from "../../services/categoryService.ts";
import { useNavigate } from "react-router";

const CreateAuraPage = () => {
    const navigate = useNavigate();
    const [createPin, { isLoading }] = useCreatePinMutation();
    const { data: categories } = useGetAllCategoriesQuery();

    const [mediaUrl, setMediaUrl] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [sourceUrl] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");

    const handleMediaUrlBlur = () => {
        setPreviewUrl(mediaUrl);
    };

    const handleSubmit = async () => {
        if (!mediaUrl) return;
        try {
            await createPin({
                mediaUrl,
                title: title || undefined,
                description: description || undefined,
                sourceUrl: sourceUrl || undefined,
                categoryId: categoryId || undefined,
            }).unwrap();
            navigate("/collections");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="w-full min-h-full px-10 py-8 flex flex-col items-center">

            {/* Top bar */}
            <div className="flex items-center justify-between mb-8 w-full max-w-[1000px]">
                <h1 className="text-white text-sm font-medium tracking-wide">Create Aura</h1>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !mediaUrl}
                    className="bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-40 disabled:cursor-not-allowed
                        text-black text-xs font-semibold px-5 py-2 rounded-md transition-colors"
                >
                    {isLoading ? "Creating..." : "Create"}
                </button>
            </div>

            {/* Main layout */}
            <div className="flex gap-10 items-start">

                {/* Left — image preview */}
                <div className="shrink-0">
                    <div className="w-[200px] min-h-[200px] rounded-2xl overflow-hidden bg-[#1e1e1e] border border-[#333] flex items-center justify-center">
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={() => setPreviewUrl("")}
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-2 p-6 text-center">
                                <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-gray-600 text-xs">Preview</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right — form fields */}
                <div className="flex flex-col gap-5 w-[340px]">

                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-white text-xs font-medium">Name</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Aura name"
                            className="bg-[#1e1e1e] border border-[#333] rounded-md px-3 h-9 text-white text-xs
                                placeholder:text-gray-600 outline-none focus:border-[#1DB954] transition-colors"
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-white text-xs font-medium">Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Describe your aura..."
                            rows={4}
                            className="bg-[#1e1e1e] border border-[#333] rounded-md px-3 py-2 text-white text-xs
                                placeholder:text-gray-600 outline-none focus:border-[#1DB954] transition-colors resize-none"
                        />
                    </div>

                    {/* URL */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-white text-xs font-medium">Url</label>
                        <input
                            type="text"
                            value={mediaUrl}
                            onChange={e => setMediaUrl(e.target.value)}
                            onBlur={handleMediaUrlBlur}
                            placeholder="Add Url"
                            className="bg-[#1e1e1e] border border-[#333] rounded-md px-3 h-9 text-white text-xs
                                placeholder:text-gray-600 outline-none focus:border-[#1DB954] transition-colors"
                        />
                    </div>

                    {/* Moodboard / Category */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-white text-xs font-medium">Moodboard</label>
                        <select
                            value={categoryId}
                            onChange={e => setCategoryId(e.target.value)}
                            className="bg-[#1e1e1e] border border-[#333] rounded-md px-3 h-9 text-xs
                                outline-none focus:border-[#1DB954] transition-colors appearance-none
                                text-gray-400 cursor-pointer"
                        >
                            <option value="">Choose Moodboard</option>
                            {categories?.map(cat => (
                                <option key={cat.id} value={cat.id} className="text-white bg-[#1e1e1e]">
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CreateAuraPage;
