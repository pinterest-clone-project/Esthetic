import {api} from "@/services/api.ts";
import type { INotification } from "@/types/notification/INotification";
import type { IPagedResult } from "@/types/IPagedResult";

export const notificationService = api.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<IPagedResult<INotification>, { page?: number; pageSize?: number }>({
            query: (arg) => ({
                url: "Notifications",
                method: "GET",
                params: { page: arg?.page ?? 1, pageSize: arg?.pageSize ?? 5 },
            }),
            providesTags: ["Notification"],
        }),
        markAllAsRead: builder.mutation<void, void>({
            query: () => ({ url: "Notifications/read", method: "POST" }),
            invalidatesTags: ["Notification"],
        }),
        markAsRead: builder.mutation<void, string>({
            query: (id) => ({ url: `Notifications/${id}/read`, method: "POST" }),
            invalidatesTags: ["Notification"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetNotificationsQuery,
    useMarkAllAsReadMutation,
    useMarkAsReadMutation,
} = notificationService;