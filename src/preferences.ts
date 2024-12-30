import { StaticBreakpoints } from "./hooks/useBreakpoints";
import { ScrollAffordancePref, ScrollBackTo } from "./helpers/scrollAffordance";
import { ActionKeys, ActionVisibility } from "./components/Templates/ActionComponent";
import { ShortcutRepresentation } from "./components/Shortcut";
import { ShortcutMetaKeywords } from "./helpers/keyboard/getMetaKeys";

import dayMode from "readium-css/css/vars/day.json";
import sepiaMode from "readium-css/css/vars/sepia.json";
import nightMode from "readium-css/css/vars/night.json";

export enum Themes {
  auto = "auto",
  light = "light",
  sepia = "sepia",
  dark = "dark",
  paper = "paper",
  contrast1 = "contrast1",
  contrast2 = "contrast2",
  contrast3 = "contrast3"
}

export const RSPrefs = {
  typography: {
    minimalLineLength: 35, // undefined | null | number of characters. If 2 cols will switch to 1 based on this
    optimalLineLength: 75, // number of characters. If auto layout, picks colCount based on this
    pageGutter: 20 // body padding in px
    // In the future we could have useDynamicBreakpoint: boolean so that devs can disable it and use breakpoints instead
  },
  scroll: {
    topAffordance: ScrollAffordancePref.none,
    bottomAffordance: ScrollAffordancePref.both,
    backTo: ScrollBackTo.top
  },
  theming: {
    arrow: {
      size: 40, // Size of the left and right arrows in px
      offset: 5 // offset of the arrows from the edges in px
    },
    icon: {
      size: 24, // Size of icons in px
      tooltipOffset: 10 // offset of tooltip in px
    },
    breakpoints: {
      // See https://m3.material.io/foundations/layout/applying-layout/window-size-classes
      [StaticBreakpoints.compact]: 600, // Phone in portrait
      [StaticBreakpoints.medium]: 840, // Tablet in portrait, Foldable in portrait (unfolded)
      [StaticBreakpoints.expanded]: 1200, // Phone in landscape, Tablet in landscape, Foldable in landscape (unfolded), Desktop
      [StaticBreakpoints.large]: 1600, // Desktop
      [StaticBreakpoints.xLarge]: null // Desktop Ultra-wide
    },
    themes: {
      reflowOrder: [
        Themes.auto, 
        Themes.light, 
        Themes.sepia, 
        Themes.paper, 
        Themes.dark, 
        Themes.contrast1, 
        Themes.contrast2, 
        Themes.contrast3
      ],
      fxlOrder: [
        Themes.auto,
        Themes.light,
        Themes.dark
      ],
      [Themes.light]: {
        background: dayMode.RS__backgroundColor, // Color of background
        text: dayMode.RS__textColor,    // Color of text
        link: "#0000ee",                // Color of links
        visited: "#551a8b",             // Color of visited links
        subdue: "#808080",              // Color of subdued elements
        disable: "#808080",             // color for :disabled
        hover: "#d9d9d9",               // color of background for :hover
        onHover: dayMode.RS__textColor, // color of text for :hover
        select: "#b4d8fe",              // color of selected background
        onSelect: "inherit",            // color of selected text
        focus: "#0067f4",               // color of :focus-visible
        elevate: `0px 0px 2px ${ dayMode.RS__textColor }`, // drop shadow of containers
        immerse: "0.6"                  // opacity of immersive mode
      },
      [Themes.sepia]: {
        background: sepiaMode.RS__backgroundColor,
        text: sepiaMode.RS__textColor,
        link: sepiaMode.RS__linkColor,
        visited: sepiaMode.RS__visitedColor,
        subdue: "#8c8c8c",
        disable: "#8c8c8c",
        hover: "#edd7ab",
        onHover: sepiaMode.RS__textColor,
        select: sepiaMode.RS__selectionBackgroundColor,
        onSelect: sepiaMode.RS__selectionTextColor,
        focus: "#0067f4",
        elevate: `0px 0px 2px ${ sepiaMode.RS__textColor }`,
        immerse: "0.5"
      },
      [Themes.dark]: {
        background: nightMode.RS__backgroundColor,
        text: nightMode.RS__textColor,
        link: nightMode.RS__linkColor,
        visited: nightMode.RS__visitedColor,
        subdue: "#808080",
        disable: "#808080",
        hover: "#404040",
        onHover: nightMode.RS__textColor,
        select: nightMode.RS__selectionBackgroundColor,
        onSelect: nightMode.RS__selectionTextColor,
        focus: "#0067f4",
        elevate: `0px 0px 5px ${ nightMode.RS__textColor }`,
        immerse: "0.4"
      },
      [Themes.paper]: {
        background: "#e9ddc8",
        text: "#000000",
        link: sepiaMode.RS__linkColor,
        visited: sepiaMode.RS__visitedColor,
        subdue: "#8c8c8c",
        disable: "#8c8c8c",
        hover: "#ccb07f",
        onHover: sepiaMode.RS__textColor,
        select: sepiaMode.RS__selectionBackgroundColor,
        onSelect: sepiaMode.RS__selectionTextColor,
        focus: "#004099",
        elevate: `0px 0px 2px ${ sepiaMode.RS__textColor }`,
        immerse: "0.45"
      },
      [Themes.contrast1]: {
        background: "#000000",
        text: "#ffff00",
        link: nightMode.RS__linkColor,
        visited: nightMode.RS__visitedColor,
        subdue: "#808000",
        disable: "#808000",
        hover: "#404040",
        onHover: nightMode.RS__textColor,
        select: nightMode.RS__selectionBackgroundColor,
        onSelect: nightMode.RS__selectionTextColor,
        focus: "#0067f4",
        elevate: `0px 0px 5px #ffffff`,
        immerse: "0.4"
      },
      [Themes.contrast2]: {
        background: "#181842",
        text: "#ffffff",
        link: "#adcfff",
        visited: "#7ab2ff",
        subdue: "#808080",
        disable: "#808080",
        hover: "#4444bb",
        onHover: nightMode.RS__textColor,
        select: nightMode.RS__selectionBackgroundColor,
        onSelect: nightMode.RS__selectionTextColor,
        focus: "#6BA9FF",
        elevate: `0px 0px 5px ${ nightMode.RS__textColor }`,
        immerse: "0.4"
      },
      [Themes.contrast3]: {
        background: "#c5e7cd",
        text: "#000000",
        link: sepiaMode.RS__linkColor,
        visited: sepiaMode.RS__visitedColor,
        subdue: "#8c8c8c",
        disable: "#8c8c8c",
        hover: "#6fc383",
        onHover: sepiaMode.RS__textColor,
        select: sepiaMode.RS__selectionBackgroundColor,
        onSelect: sepiaMode.RS__selectionTextColor,
        focus: "#004099",
        elevate: `0px 0px 2px ${ sepiaMode.RS__textColor }`,
        immerse: "0.45"
      }
    }
  },
  shortcuts: {
    representation: ShortcutRepresentation.symbol,
    joiner: " + "
  },
  actions: {
    displayOrder: [
      ActionKeys.settings,
      ActionKeys.fullscreen,
    //  ActionKeys.toc,
    //  ActionKeys.jumpToPosition
    ],
    [ActionKeys.settings]: {
      visibility: ActionVisibility.always,
      shortcut: `${ShortcutMetaKeywords.platform}+P`
    },
    [ActionKeys.fullscreen]: {
      visibility: ActionVisibility.always,
      shortcut: `${ShortcutMetaKeywords.platform}+F11`
    },
    [ActionKeys.toc]: {
      visibility: ActionVisibility.partially,
      shortcut: `${ShortcutMetaKeywords.platform}+N`
    },
    [ActionKeys.jumpToPosition]: {
      visibility: ActionVisibility.overflow,
      shortcut: `${ShortcutMetaKeywords.platform}+J`
    }
  }
}