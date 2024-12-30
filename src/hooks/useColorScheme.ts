import { useEffect } from "react";
import { useMediaQuery } from "./useMediaQuery";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setColorScheme } from "@/lib/themeReducer";

export enum ColorScheme {
  light = "light",
  dark = "dark"
}

export const useColorScheme = () => {
  const colorScheme = useAppSelector(state => state.theming.colorScheme);
  const dispatch = useAppDispatch();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    dispatch(setColorScheme(
      prefersDarkMode ? 
      ColorScheme.dark : 
      ColorScheme.light
    ));
  }, [dispatch, prefersDarkMode]);

  return colorScheme;
}