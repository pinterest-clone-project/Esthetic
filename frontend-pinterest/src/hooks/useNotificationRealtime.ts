import {useAppDispatch, useAppSelector} from "@/store";
import {useEffect} from "react";
import {getChatConnection, startChatConnection} from "@/utils/chatHub.ts";
import type {INotification} from "@/types/notification/INotification.ts";
import {notificationService} from "@/services/notificationService.ts";
import {selectIsAuth} from "@/store/selectors/authSelectors.ts";

export const useNotificationRealtime = () => {
    const dispatch = useAppDispatch();
    const isAuth    = useAppSelector(selectIsAuth);

    useEffect(() => {
        if (!isAuth) return;

        let active = true;

        const setup = async () => {
            await startChatConnection();
            if (!active) return;

            getChatConnection().on("ReceiveNotification", (notification: INotification) => {
                dispatch(
                    notificationService.util.updateQueryData("getNotifications", {}, (draft) => {
                        if (!draft.items.some((n: INotification) => n.id === notification.id)) {
                            draft.items.unshift(notification);
                            draft.totalCount += 1;
                        }
                    })
                );
            });
        };

        setup();

        return () => {
            active = false;
            getChatConnection().off("ReceiveNotification");
        };
    }, [isAuth, dispatch]);
};
