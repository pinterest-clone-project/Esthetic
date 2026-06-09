import { useState } from "react";
import im1 from "@/assets/defaults/def-9.jpg";
import im2 from "@/assets/defaults/def-10.jpg";
import im3 from "@/assets/defaults/def-11.jpg";
import {useGetMyPinsQuery} from "@/services/pinService.ts";
import {useNavigate} from "react-router";

type CollectionTab = "Aura" | "Moodboard" | "Esthetic AI";

const tabs: CollectionTab[] = ["Aura", "Moodboard", "Esthetic AI"];

const CollectionsPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<CollectionTab>("Aura");
    const { data: pins } = useGetMyPinsQuery();

    const hasAuras = activeTab === "Aura" && pins && pins.length > 0;

    return (
        <div className="min-h-screen mt-11 text-white px-8 py-10">
            <div className="relative  flex flex-col items-center mb-6">
                <button className="absolute right-0 top-0 px-6 py-2 rounded-lg bg-[#2a2a2a] text-white text-sm hover:bg-[#333] transition-colors duration-150">
                    Create
                </button>
                <h1 className="text-4xl  mb-3">Your collection</h1>
                <div className="flex items-center gap-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-sm transition-colors duration-150 ${
                                activeTab === tab
                                    ? "text-btn-primary border-b border-btn-primary pb-0.5"
                                    : "text-white/50 hover:text-white/80"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>


            {hasAuras ? (
                <div className="mt-8">
                    <h2 className="text-lg">Your created Auras</h2>
                    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 mt-4">
                        {pins.map((pin) => (
                            <div key={pin.id} className="break-inside-avoid mb-3">
                                <img
                                    src={pin.mediaUrl ?? undefined}
                                    className="w-full rounded-xl object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    <h2 className="text-lg mt-4">Your saved Auras</h2>
                    <div className="mt-4">
                        <p className="text-white/30 text-sm text-center py-8 border border-white/10 rounded-xl">
                            You haven't saved any Auras yet
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center mt-16 gap-6">
                    <div className="relative w-[320px] h-[240px]">
                        <img src={im1} className="absolute top-[40px] left-0 w-[140px] h-[150px] object-cover rounded-xl" />
                        <img src={im2} className="absolute top-0 left-[90px] w-[150px] h-[160px] object-cover rounded-xl" />
                        <img src={im3} className="absolute top-[70px] left-[180px] w-[140px] h-[160px] object-cover rounded-xl" />
                    </div>

                    <div className="text-center mt-4">
                        <h2 className="text-2xl font-medium mb-3">Combine your ideas</h2>
                        <p className="text-white/40 text-sm max-w-[340px] leading-relaxed">
                            Aura pins are small aesthetic pieces inspired visuals and trends.
                            They capture moods, colors, and vibes, letting you express your
                            personal aesthetic in a simple, stylish way.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/aura/create")}
                        className="px-6 py-2 rounded-lg border border-white/20 text-white text-sm hover:bg-[#1a1a1a] transition-colors duration-150"
                    >
                        Create Aura
                    </button>
                </div>
            )}

        </div>
    );
};

export default CollectionsPage;