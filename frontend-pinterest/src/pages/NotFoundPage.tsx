import { Link, useNavigate } from "react-router";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#121212] px-6 py-10 text-center">

            <div className="pointer-events-none absolute inset-0 grid grid-cols-6 grid-rows-5 gap-1.5 p-1.5 opacity-[0.06]">
                {Array.from({ length: 30 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-btn-primary"
                        style={{ borderRadius: i % 3 === 0 ? "50%" : "10px" }}
                    />
                ))}
            </div>

            <p
                className="relative text-[clamp(96px,18vw,160px)] font-black leading-none tracking-[-6px] text-transparent"
                style={{ WebkitTextStroke: "2px #1DB954" }}
            >
                404
            </p>

            <h1 className="relative mt-1 text-[22px] font-bold tracking-[-0.5px] text-white">
                Сторінку не знайдено
            </h1>

            <p className="relative mt-2 max-w-[300px] text-sm leading-relaxed tracking-[-0.3px] text-text-muted">
                Цей пін кудись загубився. Поверніться на головну та знайдіть натхнення!
            </p>

            <Link
                to="/"
                className="relative mt-10 inline-flex items-center gap-2 rounded-full bg-btn-primary px-6 py-3 text-sm font-semibold tracking-[-0.5px] text-button-text-color transition-all duration-150 hover:bg-[#1aa34a] active:scale-[0.97]"
            >
                <svg className="h-4 w-4 fill-button-text-color" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
                На головну
            </Link>

            <div className="relative mt-7 flex w-[260px] items-center gap-2.5">
                <hr className="flex-1 border-[#2a2a2a]" />
                <span className="text-xs text-btn-dark">або</span>
                <hr className="flex-1 border-[#2a2a2a]" />
            </div>

            <button
                onClick={() => navigate(-1)}
                className="relative mt-5 text-sm text-text-muted underline transition-colors hover:text-white"
            >
                Повернутися назад
            </button>
        </div>
    );
};

export default NotFoundPage;