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
        "Chat",
        "Message",
        "Notification",
        "RecommendedPins",
        "AllUsers",
    ],
    endpoints: () => ({})
});
