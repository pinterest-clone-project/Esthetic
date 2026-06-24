import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

const TopProgressBar = () => {
    const location = useLocation();
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    const clearTimers = () => {
        timerRef.current.forEach(clearTimeout);
        timerRef.current = [];
    };

    useEffect(() => {
        clearTimers();
        setProgress(0);
        setVisible(true);

        timerRef.current.push(setTimeout(() => setProgress(30), 50));
        timerRef.current.push(setTimeout(() => setProgress(70), 200));
        timerRef.current.push(setTimeout(() => setProgress(85), 500));
        timerRef.current.push(setTimeout(() => setProgress(100), 700));
        timerRef.current.push(
            setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 1000)
        );

        return () => clearTimers();
    }, [location.pathname]);

    if (!visible) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                height: "3px",
                width: `${progress}%`,
                background: "linear-gradient(to right, #1DB954, #17a84a)",
                transition: progress === 0
                    ? "none"
                    : progress === 100
                        ? "width 0.2s ease"
                        : "width 0.4s ease",
                zIndex: 99999,
                borderRadius: "0 2px 2px 0",
                boxShadow: "0 0 8px rgba(29, 185, 84, 0.7)",
            }}
        />
    );
};

export default TopProgressBar;