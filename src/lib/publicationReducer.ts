import Locale from "../resources/locales/en.json";

import { IProgression } from '@/components/ProgressionOf';
import { createSlice } from "@reduxjs/toolkit";

interface IPublicationState {
  runningHead?: string;
  isFXL: boolean;
  isRTL: boolean;
  progression: IProgression;
  atPublicationStart: boolean;
  atPublicationEnd: boolean;
}

const initialState: IPublicationState = {
  runningHead: undefined,
  isFXL: false,
  isRTL: false,
  progression: {},
  atPublicationStart: false,
  atPublicationEnd: false
}

export const publicationSlice = createSlice({
  name: "publication",
  initialState,
  reducers: {
    setRunningHead: (state, action) => {
      state.runningHead = action.payload
    },
    setFXL: (state, action) => {
      state.isFXL = action.payload
    },
    setRTL: (state, action) => {
      state.isRTL = action.payload
    },
    setProgression: (state, action) => {
      state.progression = {...state.progression, ...action.payload }
    },
    setPublicationStart: (state, action) => {
      state.atPublicationStart = action.payload
    },
    setPublicationEnd: (state, action) => {
      state.atPublicationEnd = action.payload
    },
  }
});

// Action creators are generated for each case reducer function
export const { 
  setRunningHead,
  setFXL,
  setRTL,
  setProgression,
  setPublicationStart,
  setPublicationEnd 
} = publicationSlice.actions;

export default publicationSlice.reducer;