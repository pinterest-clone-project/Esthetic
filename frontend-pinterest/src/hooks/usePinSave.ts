import { useGetSavedLocationsQuery, useUnsavePinMutation } from "@/services/pinService";
import { useToast } from "@/components/ui/Toast/UseToast";
import { useTranslation } from "react-i18next";

export const usePinSave = (pinId: string) => {
    const { t } = useTranslation("common");
    const { showToast } = useToast();

    const {
        data: savedLocations = [],
        isLoading
    } = useGetSavedLocationsQuery(pinId);

    const [unsavePin] = useUnsavePinMutation();

    const isSaved = savedLocations.length > 0;

    const unsave = async () => {
        try {
            await Promise.all(
                savedLocations.map(location =>
                    unsavePin({
                        pinId,
                        boardId: location.boardId,
                        sectionId: location.sectionId ?? undefined
                    }).unwrap()
                )
            );

            showToast(
                t("toast.removedFromBoard"),
                "success"
            );

        } catch {
            showToast(
                t("toast.somethingWentWrong"),
                "error"
            );
        }
    };

    return {
        isSaved,
        savedLocations,
        isLoading,
        unsave
    };
};
