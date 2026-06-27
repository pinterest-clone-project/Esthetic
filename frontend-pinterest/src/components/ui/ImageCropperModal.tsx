import { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import Modal from "./Modal.tsx";

interface ImageCropperModalProps {
    imageSrc: string;
    onCrop: (file: File) => void;
    onClose: () => void;
    aspect?: number;
}

const createCroppedImage = async (imageSrc: string, cropArea: Area): Promise<File> => {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = imageSrc;
    });

    const canvas = document.createElement("canvas");
    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
        image,
        cropArea.x, cropArea.y,
        cropArea.width, cropArea.height,
        0, 0,
        cropArea.width, cropArea.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (!blob) return reject(new Error("Canvas is empty"));
            resolve(new File([blob], "cropped.jpg", { type: "image/jpeg" }));
        }, "image/jpeg", 0.92);
    });
};

const ImageCropperModal = ({ imageSrc, onCrop, onClose, aspect }: ImageCropperModalProps) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleConfirm = async () => {
        if (!croppedAreaPixels) return;
        setIsProcessing(true);
        try {
            const file = await createCroppedImage(imageSrc, croppedAreaPixels);
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
                    <h3 className="text-black dark:text-white text-base font-semibold">Crop Image</h3>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Crop area */}
                <div className="relative w-full h-[360px] rounded-xl overflow-hidden bg-black">
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
                    <span className="text-gray-500 text-xs shrink-0">Zoom</span>
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

                {/* No aspect hint */}
                {!aspect && (
                    <p className="text-gray-500 text-[10px] text-center -mt-2">
                        Free crop — drag to reposition, pinch or scroll to zoom
                    </p>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isProcessing}
                        className="flex-1 h-10 rounded-xl bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-50 text-black text-sm font-semibold transition-colors"
                    >
                        {isProcessing ? "Processing..." : "Apply Crop"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ImageCropperModal;
