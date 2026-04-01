import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE = "/note";

const getHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  async (
    {
      page = 1,
      limit = 8,
      search = "",
      sortBy = "createdAt",
      order = "desc",
    } = {},
    { getState, rejectWithValue },
  ) => {
    try {
      const { token } = getState().auth;

      const res = await axios.get(`${BASE}/get`, {
        ...getHeaders(token),
        params: {
          page,
          limit,
          search,
          sortBy,
          order,
        },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch notes",
      );
    }
  },
);

export const createNote = createAsyncThunk(
  "notes/createNote",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.post(`${BASE}/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data.createdNote;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create note",
      );
    }
  },
);

export const updateNote = createAsyncThunk(
  "notes/updateNote",
  async ({ id, formData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.put(
        `${BASE}/update/${id}`,
        formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.updatedNote;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update note",
      );
    }
  },
);

export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await axios.delete(`${BASE}/delete/${id}`, getHeaders(token));
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete note",
      );
    }
  },
);

const notesSlice = createSlice({
  name: "notes",
  initialState: {
    notes: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
  },
  reducers: {
    clearNotes: (state) => {
      state.notes = [];
      state.error = null;
      state.loading = false;
      state.totalPages = 1;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload.notes || [];
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
        state.error = null;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notes = [];
      });

    builder
      .addCase(createNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes.unshift(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.notes.findIndex((n) => n._id === action.payload._id);
        if (idx !== -1) state.notes[idx] = action.payload;
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = state.notes.filter((n) => n._id !== action.payload);
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearNotes } = notesSlice.actions;
export default notesSlice.reducer;
