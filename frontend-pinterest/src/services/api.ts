import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../utils/createBaseQuery.ts";

export const api = createApi({
    reducerPath: "api",
    baseQuery: createBaseQuery(""),
    refetchOnMountOrArgChange: true,
    tagTypes: [
        "CurrentUser",
        "MyPins",
        "AllPins",
        "Comments",
        "MyMoodboards",
        "AllMoodboards",
        "Chat",
        "Message",
        "Notification",
        "RecommendedPins",
        "AllUsers",
        "AllReports",
        "MyReports",
        "FollowStats",
        "FollowRequests",
        "AllTags",
        "AllCategories",
        "Statistics",
    ],
    endpoints: () => ({})
});
