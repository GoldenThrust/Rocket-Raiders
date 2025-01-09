import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Match {
  activeMatches: any;
}

const initialState: Match = {
  activeMatches: {},
};

export const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setActiveMatches: (state, action: PayloadAction<any>) => {
      state.activeMatches = action.payload;
    },
    setActiveMatch: (state, action: PayloadAction<any | null>) => {
      const match = action.payload;
      const newMatch = { ...state.activeMatches, [match.id]: match }
      state.activeMatches[match.id] = { [match.id]: match, ...newMatch };
    },
    delActiveMatch: (state, action: PayloadAction<any>) => {
      const matchid = action.payload;
      delete state.activeMatches[matchid];
    },
  },
});

export const { setActiveMatches, setActiveMatch, delActiveMatch } =
  matchSlice.actions;

export default matchSlice.reducer;
