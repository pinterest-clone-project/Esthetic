import { useTheme } from "@/context/ThemeContext.tsx";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="relative inline-block w-11 h-5 shrink-0">
            <input
                id="switch-component"
                type="checkbox"
                checked={theme === "dark"}
                onChange={toggleTheme}
                className="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-btn-primary cursor-pointer transition-colors duration-300"
            />
            <label
                htmlFor="switch-component"
                className="absolute top-1/2 left-0.5 -translate-y-1/2 w-4 h-4 bg-white dark:bg-black rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-700 cursor-pointer"
            />
        </div>
    );
};

export default ThemeToggle;