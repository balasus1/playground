import { isMacish } from "./getPlatform";

interface IKey {
  [key: string]: string;
  longform: string;
  shortform: string;
}

export interface IMetaKey extends IKey {
  modifier: "altKey" | "ctrlKey" | "metaKey" | "shiftKey";
  symbol: "⌥" | "^" | "⌘" | "⊞" | "⇧";
}

export interface IPlatformModifier extends IKey {
  modifier: "ctrlKey" | "metaKey";
  symbol: "^" | "⌘";
}

export interface IMetaKeys {
  [key: string]: IMetaKey;
  altKey: IMetaKey;
  ctrlKey: IMetaKey;
  metaKey: IMetaKey;
  shiftKey: IMetaKey;
}

export enum ShortcutMetaKeywords {
  alt = "altKey",
  ctrl = "ctrlKey",
  meta = "metaKey",
  platform = "platformKey",
  shift = "shiftKey"
}

const altModifier: IMetaKey = {
  longform: "Option",
  shortform: "Alt",
  modifier: "altKey",
  symbol: "⌥"
}

const ctrlModifier: IMetaKey & IPlatformModifier = {
  longform: "Control",
  shortform: "Ctrl",
  modifier: "ctrlKey",
  symbol: "^"
}

const metaModifierMac: IMetaKey & IPlatformModifier = {
  longform: "Command",
  shortform: "Cmd",
  modifier: "metaKey",
  symbol: "⌘"   
}

const metaModifierWin: IMetaKey = {
  longform: "Windows",
  shortform: "Win",
  modifier: "metaKey",
  symbol: "⊞"
}

const shiftModifier: IMetaKey = {
  longform: "Shift",
  shortform: "Shift",
  modifier: "shiftKey",
  symbol: "⇧"
}

export const metaKeys: IMetaKeys = {
  altKey: altModifier,
  ctrlKey: ctrlModifier,
  metaKey: isMacish() ? metaModifierMac : metaModifierWin,
  shiftKey: shiftModifier
}

// Platform modifier differs from Mac to Windows so we have to get it dynamically

export const defaultPlatformModifier = ctrlModifier;

export const getPlatformModifier = (): IPlatformModifier => {
  if (isMacish()) {
    return metaModifierMac;
  } else {
    return ctrlModifier;
  }
}