import React, { useCallback, useEffect, useState } from "react";

import { RSPrefs } from "@/preferences";

import { Links } from "@readium/shared";

import { FullscreenAction } from "@/components/FullscreenAction";
import { JumpToPositionAction } from "@/components/JumpToPositionAction";
import { SettingsAction } from "@/components/SettingsAction";
import { TocAction } from "@/components/TocAction";
import { useAppSelector } from "@/lib/hooks";
import { ActionComponentVariant, ActionKeys, ActionVisibility } from "@/components/Templates/ActionComponent";
import { StaticBreakpoints } from "./useBreakpoints";

export const useCollapsibility = (toc: Links) => {
  const [ActionIcons, setActionIcons] = useState<React.JSX.Element[]>([]);
  const [MenuItems, setMenuItems] = useState<React.JSX.Element[]>([]);
  const staticBreakpoint = useAppSelector(state => state.theming.staticBreakpoint);

  const triageActions = useCallback(() => {
    const ActionIconsMap = {
      [ActionKeys.fullscreen]: <FullscreenAction key={ ActionKeys.fullscreen } variant={ ActionComponentVariant.button } />,
      [ActionKeys.jumpToPosition]: <JumpToPositionAction key={ ActionKeys.jumpToPosition } variant={ ActionComponentVariant.button } />,
      [ActionKeys.settings]: <SettingsAction key={ ActionKeys.settings } variant={ ActionComponentVariant.button } />,
      [ActionKeys.toc]: <TocAction key={ ActionKeys.toc } variant={ ActionComponentVariant.button } toc={ toc } />
    };
  
    const MenuItemsMap = {
      [ActionKeys.fullscreen]: <FullscreenAction key={ ActionKeys.fullscreen } variant={ ActionComponentVariant.menu } />,
      [ActionKeys.jumpToPosition]: <JumpToPositionAction key={ ActionKeys.jumpToPosition } variant={ ActionComponentVariant.menu } />,
      [ActionKeys.settings]: <SettingsAction key={ ActionKeys.settings } variant={ ActionComponentVariant.menu } />,
      [ActionKeys.toc]: <TocAction key={ ActionKeys.toc } variant={ ActionComponentVariant.menu } toc={ toc } />
    };
  
    const actionsOrder = RSPrefs.actions.displayOrder;

    const actionIcons: React.JSX.Element[] = [];
    const menuItems: React.JSX.Element[] = [];

    let countdown: number = 0;
    if (staticBreakpoint === StaticBreakpoints.compact) {
      countdown = actionsOrder.length - (actionsOrder.length - 2);
    } else if (staticBreakpoint === StaticBreakpoints.medium) {
      countdown = actionsOrder.length - (actionsOrder.length - 1);
    }

    // Creating a shallow copy so that actionsOrder doesn’t mutate between rerenders
    [...actionsOrder].slice().reverse().map((key) => {
      const actionPref = RSPrefs.actions[key];
      if (actionPref.visibility === ActionVisibility.overflow) {
        menuItems.unshift(MenuItemsMap[key]);
      } else if (actionPref.visibility === ActionVisibility.partially) {
          if (countdown > 0) {
            menuItems.unshift(MenuItemsMap[key]);
            --countdown;
          } else {
            actionIcons.unshift(ActionIconsMap[key]);
          }
      } else {
        actionIcons.unshift(ActionIconsMap[key]);
      }
    });

    setActionIcons(actionIcons);
    setMenuItems(menuItems);
  }, [staticBreakpoint, toc]);

  useEffect(() => {
    triageActions();
  }, [staticBreakpoint, triageActions]);

  return {
    ActionIcons,
    MenuItems
  }
}