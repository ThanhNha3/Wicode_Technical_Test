import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export type User = {
    id?: string;
    name?: string;
    bio?: string;
    language?: string;
    version?: number;
    state?: string;
    created?: string;
};

interface RowsState {
    rows: User[];
    newRow: User | null;
    searchQuery: string;
    selected: number[];
    addingRow: boolean;
}

const saved = JSON.parse(localStorage.getItem("bookmark") || "{}");

const initialState: RowsState = {
    rows: saved.data || [],
    newRow: null,
    searchQuery: "",
    selected: [],
    addingRow: false,
};

const rowsSlice = createSlice({
    name: "rows",
    initialState,
    reducers: {
        setSearchQuery(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
        },
    },
});

export const {
    setSearchQuery,
} = rowsSlice.actions;

export const selectRows = (state: RootState) => state.rows;

export default rowsSlice.reducer;
