import { useState } from "react";

const PinCard = ({ pin }: { pin: IPinSummaryResponse }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="relative break-inside-avoid mb-3 rounded-xl overflow-hidden group cursor-pointer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); setMenuOpen(false); }}
        >
            {/* Image */}
            <img
                src={pin.mediaUrl ?? ""}
                alt={pin.title ?? "Pin"}
                className="w-full block rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
            />

            {/* Hover overlay */}
            <div className={`absolute inset-0 rounded-xl bg-black/30 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`} />

            {/* Title on hover */}
            {pin.title && (
                <div className={`absolute bottom-0 left-0 right-0 px-3 py-2.5 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-white text-xs font-medium truncate drop-shadow-lg">{pin.title}</p>
                </div>
            )}

            {/* Three dots menu button */}
            <div className={`absolute bottom-2 right-2 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
                <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(p => !p); }}
                    className="flex items-center gap-[3px] bg-black/50 hover:bg-black/70 rounded-full px-2 py-1.5 transition-colors"
                >
                    {[0, 1, 2].map(i => (
                        <span key={i} className="w-1 h-1 rounded-full bg-[#4ade80] block" />
                    ))}
                </button>

                {/* Dropdown */}
                {menuOpen && (
                    <div className="absolute bottom-8 right-0 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden w-36 z-10">
                        {["Save", "Share", "Edit", "Delete"].map((action) => (
                            <button
                                key={action}
                                className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Likes badge */}
            {pin.likesCount > 0 && (
                <div className={`absolute top-2 right-2 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span>♥</span>
                        <span>{pin.likesCount}</span>
                    </span>
                </div>
            )}
        </div>
    );
};

