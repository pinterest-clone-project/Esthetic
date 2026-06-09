import logo from "@/assets/logo.png";
import { useEffect, useState } from "react";

const Spinner = () => {
    const [visible, setVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const fadeTimer = setTimeout(() => setFadeOut(true), 1600);
        const hideTimer = setTimeout(() => setVisible(false), 2000);
        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#121212]"
            style={{
                opacity: fadeOut ? 0 : 1,
                transition: 'opacity 0.4s ease',
            }}
        >
            <img
                src={logo}
                className="w-[60px] h-[60px]"
                style={{
                    animation: 'logoPulse 1.6s ease-in-out forwards',
                }}
            />

            <style>{`
                @keyframes logoPulse {
                    0%   { opacity: 0; transform: scale(0.8); }
                    30%  { opacity: 1; transform: scale(1.05); }
                    60%  { opacity: 1; transform: scale(1); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default Spinner;