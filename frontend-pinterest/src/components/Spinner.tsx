const Spinner = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md bg-black/40">
        <div className="flex flex-col items-center gap-5">

            <div className="relative w-14 h-14 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-white/[0.07]" />
                <div
                    className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
                    style={{
                        borderTopColor: '#1DB954',
                        borderRightColor: 'rgba(29,185,84,0.3)',
                        animationTimingFunction: 'cubic-bezier(0.5,0,0.5,1)',
                        animationDuration: '0.9s',
                    }}
                />
                <div
                    className="w-1.5 h-1.5 rounded-full bg-btn-primary"
                    style={{ boxShadow: '0 0 8px #1DB954' }}
                />
            </div>

            <span
                className="text-[13px] tracking-[0.08em] text-white/35 font-light"
                style={{ animation: 'pulse 1.8s ease-in-out infinite' }}
            >
        Loading
      </span>

        </div>
    </div>
);

export default Spinner;