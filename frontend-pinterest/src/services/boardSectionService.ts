import { api } from "@/services/api.ts";

export interface BoardSection {
    id: string;
    boardId: string;
    title: string;
    pinsCount: number;
    previewPins: any[];
    createdAt: string;
    updatedAt: string | null;
}

export interface BoardSectionDetails {
    id: string;
    boardId: string;
    title: string;
    pinsCount: number;
    pins: any[];
    createdAt: string;
    updatedAt: string | null;
    ownerId: string
}

export interface CreateBoardSectionRequest {
    boardId: string;
    title: string;
}

export interface UpdateBoardSectionRequest {
    id: string;
    title?: string;
}


export const boardSectionService = api.injectEndpoints({
    endpoints: (builder) => ({
        getBoardSections: builder.query<BoardSection[], string>({
            query: (boardId) => `BoardSections/byBoard/${boardId}`,
            providesTags: ["BoardSections"],
        }),

        getBoardSectionById: builder.query<BoardSectionDetails, string>({
            query: (id) => `BoardSections/getById/${id}`,
            providesTags: (_result, _error, id) => [
                {
                    type: "BoardSections",
                    id: id
                }
            ],
        }),

        createBoardSection: builder.mutation<
            BoardSection,
            CreateBoardSectionRequest
        >({
            query: (body) => ({
                url: "BoardSections/create",
                method: "POST",
                body,
            }),
            invalidatesTags: ["BoardSections"],
        }),

        updateBoardSection: builder.mutation<
            BoardSection,
            UpdateBoardSectionRequest
        >({
            query: ({id, ...body}) => ({
                url: `BoardSections/update/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["BoardSections"],
        }),

        deleteBoardSection: builder.mutation<void, string>({
            query: (id) => ({
                url: `BoardSections/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["BoardSections"],
        }),
    }),
});


export const {
    useGetBoardSectionsQuery,
    useGetBoardSectionByIdQuery,
    useCreateBoardSectionMutation,
    useUpdateBoardSectionMutation,
    useDeleteBoardSectionMutation,
} = boardSectionService;
