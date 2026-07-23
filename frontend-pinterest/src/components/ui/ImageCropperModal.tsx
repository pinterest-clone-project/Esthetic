import { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import Modal from "./Modal.tsx";
import { useTranslation } from "react-i18next";

interface ImageCropperModalProps {
    imageSrc: string;
    onCrop: (file: File) => void;
    onClose: () => void;
    defaultWidth?: number;
    defaultHeight?: number;
}

const createCroppedImage = async (
    imageSrc: string,
    cropArea: Area,
    outputWidth?: number,
    outputHeight?: number
): Promise<File> => {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = imageSrc;
    });

    const canvas = document.createElement("canvas");
    canvas.width = outputWidth ?? cropArea.width;
    canvas.height = outputHeight ?? cropArea.height;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
        image,
        cropArea.x, cropArea.y,
        cropArea.width, cropArea.height,
        0, 0,
        canvas.width, canvas.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (!blob) return reject(new Error("Canvas is empty"));
            resolve(new File([blob], "cropped.jpg", { type: "image/jpeg" }));
        }, "image/jpeg", 0.92);
    });
};

const ImageCropperModal = ({
    imageSrc,
    onCrop,
    onClose,
    defaultWidth,
    defaultHeight,
}: ImageCropperModalProps) => {
    const { t } = useTranslation('common');

    const PRESETS = [
        { label: t('imageCropper.free'), width: null, height: null },
        { label: "1:1", width: 1000, height: 1000 },
        { label: "4:3", width: 1200, height: 900 },
        { label: "3:4", width: 900, height: 1200 },
        { label: "16:9", width: 1600, height: 900 },
    ];

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const [lockAspect, setLockAspect] = useState(
        !!(defaultWidth && defaultHeight)
    );
    const [outputWidth, setOutputWidth] = useState<string>(
        defaultWidth ? String(defaultWidth) : ""
    );
    const [outputHeight, setOutputHeight] = useState<string>(
        defaultHeight ? String(defaultHeight) : ""
    );

    const parsedWidth = outputWidth ? Number(outputWidth) : undefined;
    const parsedHeight = outputHeight ? Number(outputHeight) : undefined;
    const aspect =
        lockAspect && parsedWidth && parsedHeight
            ? parsedWidth / parsedHeight
            : undefined;

    const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handlePreset = (w: number | null, h: number | null) => {
        if (w === null || h === null) {
            setOutputWidth("");
            setOutputHeight("");
            setLockAspect(false);
        } else {
            setOutputWidth(String(w));
            setOutputHeight(String(h));
            setLockAspect(true);
        }
    };

    const handleWidthChange = (v: string) => {
        setOutputWidth(v);
        if (lockAspect && parsedHeight && Number(v)) {
            // keep aspect by not adjusting height — user controls both
        }
    };

    const handleConfirm = async () => {
        if (!croppedAreaPixels) return;
        setIsProcessing(true);
        try {
            const file = await createCroppedImage(
                imageSrc,
                croppedAreaPixels,
                parsedWidth,
                parsedHeight
            );
            onCrop(file);
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} width={520} height="auto" borderRadius={16} closeOnOverlay={false}>
            <div className="flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-black dark:text-white text-base font-semibold">{t('imageCropper.title')}</h3>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Presets */}
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs shrink-0">{t('imageCropper.preset')}</span>
                    <div className="flex gap-1.5 flex-wrap">
                        {PRESETS.map(p => {
                            const active = p.width === null
                                ? !lockAspect && !outputWidth && !outputHeight
                                : outputWidth === String(p.width) && outputHeight === String(p.height);
                            return (
                                <button
                                    key={p.label}
                                    type="button"
                                    onClick={() => handlePreset(p.width, p.height)}
                                    className={`px-2.5 py-1 rounded-md text-xs transition-colors
                                        ${active
                                            ? "bg-[#4ade80] text-black font-semibold"
                                            : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20"
                                        }`}
                                >
                                    {p.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Crop area */}
                <div className="relative w-full h-[320px] rounded-xl overflow-hidden bg-black">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                        style={{
                            containerStyle: { borderRadius: "12px" },
                            cropAreaStyle: {
                                border: "2px solid #4ade80",
                                boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)",
                            },
                        }}
                    />
                </div>

                {/* Zoom slider */}
                <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-xs shrink-0">{t('imageCropper.zoom')}</span>
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.01}
                        value={zoom}
                        onChange={e => setZoom(Number(e.target.value))}
                        className="flex-1 h-1 appearance-none rounded-full bg-gray-200 dark:bg-white/10 accent-[#4ade80] cursor-pointer"
                    />
                    <span className="text-gray-500 text-xs w-8 text-right shrink-0">{zoom.toFixed(1)}x</span>
                </div>

                {/* Output size */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-xs">{t('imageCropper.outputSize')}</span>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-gray-500 text-xs">{t('imageCropper.lockAspect')}</span>
                            <div
                                onClick={() => setLockAspect(p => !p)}
                                className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer
                                    ${lockAspect ? "bg-[#4ade80]" : "bg-gray-600"}`}
                            >
                                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform
                                    ${lockAspect ? "translate-x-4" : "translate-x-0.5"}`}
                                />
                            </div>
                        </label>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Width */}
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-gray-500 text-[10px]">{t('imageCropper.width')}</label>
                            <input
                                type="number"
                                value={outputWidth}
                                onChange={e => handleWidthChange(e.target.value)}
                                placeholder={t('imageCropper.auto')}
                                min={1}
                                className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 rounded-md px-2.5 h-8 text-black dark:text-white text-xs
                                    placeholder:text-gray-400 outline-none focus:border-[#4ade80] transition-colors"
                            />
                        </div>

                        {/* Link icon */}
                        <div className="pt-5">
                            <svg
                                width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke={lockAspect ? "#4ade80" : "#6b7280"}
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            >
                                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                            </svg>
                        </div>

                        {/* Height */}
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-gray-500 text-[10px]">{t('imageCropper.height')}</label>
                            <input
                                type="number"
                                value={outputHeight}
                                onChange={e => setOutputHeight(e.target.value)}
                                placeholder={t('imageCropper.auto')}
                                min={1}
                                className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 rounded-md px-2.5 h-8 text-black dark:text-white text-xs
                                    placeholder:text-gray-400 outline-none focus:border-[#4ade80] transition-colors"
                            />
                        </div>

                        {/* Clear */}
                        {(outputWidth || outputHeight) && (
                            <div className="pt-5">
                                <button
                                    type="button"
                                    onClick={() => { setOutputWidth(""); setOutputHeight(""); setLockAspect(false); }}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-xs transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>

                    {parsedWidth && parsedHeight && (
                        <p className="text-[10px] text-gray-400">
                            {t('imageCropper.outputInfo', { w: parsedWidth, h: parsedHeight, ratio: (parsedWidth! / parsedHeight!).toFixed(2) })}
                        </p>
                    )}
                    {(!outputWidth || !outputHeight) && (
                        <p className="text-[10px] text-gray-400">
                            {t('imageCropper.naturalSize')}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                        {t('imageCropper.cancel')}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isProcessing}
                        className="flex-1 h-10 rounded-xl bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-50 text-black text-sm font-semibold transition-colors"
                    >
                        {isProcessing ? t('imageCropper.processing') : t('imageCropper.applyCrop')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ImageCropperModal;
