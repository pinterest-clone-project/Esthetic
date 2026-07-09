import {api} from "@/services/api.ts";

export interface IStatistics {
    userCount: number;
    pinCount: number;
    boardCount: number;
    tagCount: number;
    categoryCount: number;
}

export interface IDailyStatistics {
    dailyUserCounts: DailyCount[];
    dailyPinCounts: DailyCount[];
}

export interface DailyCount {
    date: string;
    count: number;
}

export const statisticsService = api.injectEndpoints({
    endpoints: (builder) => ({
        getStatistics: builder.query<IStatistics, void>({
            query: () => ({
                url: 'Statistics',
                method: 'GET',
            }),
            providesTags: ['Statistics'],
        }),
        getDailyStatistics: builder.query<IDailyStatistics, void>({
            query: () => ({
                url: 'Statistics/daily',
                method: 'GET',
            }),
            providesTags: ['Statistics'],
        }),
    }),
});

export const {
    useGetStatisticsQuery,
    useGetDailyStatisticsQuery,
} = statisticsService;
