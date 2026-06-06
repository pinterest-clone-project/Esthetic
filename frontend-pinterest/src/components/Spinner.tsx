const Spinner = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-content-center backdrop-blur-md bg-black/40">
        <div className="relative flex items-center justify-center w-full">
            <div className="w-16 h-16 rounded-full border-2 border-[#1a1a1a]" />
            <div className="absolute w-16 h-16 rounded-full border-2 border-transparent border-t-btn-primary animate-spin" />
            <div className="absolute w-2 h-2 rounded-full bg-btn-primary" />
        </div>
    </div>
);

export default Spinner;