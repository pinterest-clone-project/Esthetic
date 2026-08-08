import { useLoading } from "@/context/LoadingContext";
import logo from "@/assets/logo.png";

const GlobalLoadingOverlay = () => {
    const { isLoading } = useLoading();

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-[fadeIn_0.15s_ease]">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <img src={logo} alt="" className="w-12 h-12 animate-pulse" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#1DB954] animate-spin" />
                </div>
            </div>
        </div>
    );
};

export default GlobalLoadingOverlay;
