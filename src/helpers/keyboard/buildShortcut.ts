import { ShortcutMetaKeywords } from "./getMetaKeys";

export interface PShortcut {
  [key: string]: string | boolean | undefined;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  platformKey?: boolean;
  shiftKey?: boolean;
  key?: string;
}

export const buildShortcut = (str: string) => {
  let shortcutObj: PShortcut = {}
  
  const shortcutArray = str.split(/\s*?[+-]\s*?/);

  shortcutArray.filter((val) => {
    if ((Object.values(ShortcutMetaKeywords) as string[]).includes(val)) {
      const trimmedKey = val.trim();
      shortcutObj[trimmedKey] = true;
    } else {
      shortcutObj.key = val.trim();
    }
  });

  return shortcutObj.key ? shortcutObj : null;
}