import { useDeletePinMutation } from "@/services/pinService.ts";
import { useToast } from "@/components/ui/Toast/UseToast.ts";
import type { IPinSummaryResponse } from "@/types/pin/responses/IPinSummaryResponse.ts";

const DeletePinModal = ({ pin, onClose }: { pin: IPinSummaryResponse; onClose: () => void }) => {
    const [deletePin, { isLoading }] = useDeletePinMutation();
    const { showToast } = useToast();

    const confirm = async () => {
        try {
            await deletePin(pin.id).unwrap();
            showToast("Pin deleted", "success");
            onClose();
        } catch {
            showToast("Unable to delete the pin.", "error");
        }
    };

    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
        <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#161616] p-6">
            <h2 className="mb-2 text-lg font-semibold">Delete pin?</h2>
            <p className="mb-5 text-sm text-white/55">“{pin.title || "Untitled pin"}” will be removed and its owner will not be able to restore it.</p>
            <div className="flex gap-2"><button onClick={onClose} className="flex-1 rounded-2xl bg-white/10 py-2.5 text-white/75">Cancel</button><button onClick={confirm} disabled={isLoading} className="flex-1 rounded-2xl bg-red-500 py-2.5 text-white disabled:opacity-50">Delete</button></div>
        </div>
    </div>;
};

export default DeletePinModal;
