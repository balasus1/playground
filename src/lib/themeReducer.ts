import { Themes } from "@/preferences";
import { StaticBreakpoints } from "@/hooks/useBreakpoints";
import { createSlice } from "@reduxjs/toolkit";
import { ColorScheme } from "@/hooks/useColorScheme";

interface IThemeState {
  colorScheme: ColorScheme;
  theme: Themes;
  hasReachedDynamicBreakpoint: boolean;
  staticBreakpoint?: StaticBreakpoints;
}

const initialState: IThemeState = {
  colorScheme: ColorScheme.light,
  theme: Themes.auto,
  hasReachedDynamicBreakpoint: false,
  staticBreakpoint: undefined
}

export const themeSlice = createSlice({
  name: "theming",
  initialState,
  reducers: {
    setColorScheme: (state, action) => {
      state.colorScheme = action.payload
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    setDynamicBreakpoint: (state, action) => {
      state.hasReachedDynamicBreakpoint = action.payload
    },
    setStaticBreakpoint: (state, action) => {
      state.staticBreakpoint = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { 
  setColorScheme, 
  setTheme, 
  setDynamicBreakpoint, 
  setStaticBreakpoint,
} = themeSlice.actions;

export default themeSlice.reducer;