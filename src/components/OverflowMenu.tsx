import React, { ReactNode } from "react";

import Locale from "../resources/locales/en.json";
import overflowMenuStyles from "./assets/styles/overflowMenu.module.css";

import MenuIcon from "./assets/icons/more_vert.svg";

import { Key, Menu, MenuTrigger, Popover } from "react-aria-components";
import { ActionIcon } from "./Templates/ActionIcon";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setOverflowMenuOpen, toggleImmersive } from "@/lib/readerReducer";
import { ActionVisibility } from "./Templates/ActionComponent";

export const OverflowMenu = ({ children }: { children?: ReactNode }) => {
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isHovered = useAppSelector(state => state.reader.isHovering);
  const dispatch = useAppDispatch();

  const toggleMenuState = (value: boolean) => {
    dispatch(setOverflowMenuOpen(value));
  }
  
  return(
    <>
    { React.Children.toArray(children).length > 0 && (!isImmersive || isHovered) ? 
      <>
      <MenuTrigger onOpenChange={ (val) => toggleMenuState(val) }>
        <ActionIcon 
          className={ overflowMenuStyles.activeButton }
          ariaLabel={ Locale.reader.overflowMenu.active.trigger }
          SVG={ MenuIcon } 
          placement="bottom"
          tooltipLabel={ Locale.reader.overflowMenu.active.tooltip } 
          visibility={ ActionVisibility.always }
        />
        <Popover
          placement="bottom"
          className={ overflowMenuStyles.overflowPopover }
        >
          <Menu 
            selectionMode="none" 
            onAction={ (key: Key) => { console.log(key) } 
            
          }>
            { children }
          </Menu>
        </Popover>
      </MenuTrigger>
      </>
      : <>
        <ActionIcon 
          className={ overflowMenuStyles.hintButton } 
          ariaLabel={ Locale.reader.overflowMenu.hint.trigger }
          SVG={ MenuIcon } 
          placement="bottom"
          tooltipLabel={ Locale.reader.overflowMenu.hint.tooltip } 
          visibility={ ActionVisibility.always }
          onPressCallback={ () => { dispatch(toggleImmersive()) } }
          preventFocusOnPress={ true }
        />
      </>
    }
    </>
  )
}