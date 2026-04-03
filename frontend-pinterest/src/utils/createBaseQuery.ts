import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {APP_ENV} from "../constants/env";

export const createBaseQuery = (endpoint: string) =>
    fetchBaseQuery({
        baseUrl: `${APP_ENV.API_BASE_URL}/api/${endpoint}`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    });