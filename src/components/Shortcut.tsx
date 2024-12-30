import React from "react";

import { RSPrefs } from "@/preferences";

import { Keyboard } from "react-aria-components";

import { useAppSelector } from "@/lib/hooks";
import { buildShortcut } from "@/helpers/keyboard/buildShortcut";
import { metaKeys } from "@/helpers/keyboard/getMetaKeys";

export enum ShortcutRepresentation {
  symbol = "symbol",
  short = "shortform",
  long = "longform"
};

export interface IShortcut {
  className?: string;
  rawForm: string;
  representation?: ShortcutRepresentation; 
  joiner?: string;
}

export const Shortcut: React.FC<IShortcut> = ({
  className,
  rawForm,
  representation = RSPrefs.shortcuts.representation || ShortcutRepresentation.symbol,
  joiner = RSPrefs.shortcuts.joiner || " + "
}) => {
  const platformModifier = useAppSelector(state => state.reader.platformModifier);

  const shortcutObj = buildShortcut(rawForm);

  if (shortcutObj) {
    let shortcutRepresentation = [];

    for (const prop in shortcutObj) {
      if (prop !== "key" && prop !== "platformKey") {
        const metaKey = metaKeys[prop];
        shortcutRepresentation.push(metaKey[representation]);
      } else if (prop === "platformKey") {
        shortcutRepresentation.push(platformModifier[representation]);
      } else {
        shortcutRepresentation.push(shortcutObj[prop]);
      }
    }

    if (shortcutRepresentation.length > 0) {
      const displayShortcut = shortcutRepresentation.join(joiner);
      
      return (
        <Keyboard className={ className }>{ displayShortcut }</Keyboard>
      ) 
    } else {
      return (
        <></>
      )
    }
  }

  return (
    <></>
  );
}