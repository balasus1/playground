import React, { ComponentType, SVGProps, useRef } from "react";

import { RSPrefs } from "@/preferences";

import readerSharedUI from "../assets/styles/readerSharedUI.module.css";
import readerStateStyles from "../assets/styles/readerStates.module.css";

import { Button, Tooltip, TooltipTrigger, TooltipProps, PressEvent, ButtonProps } from "react-aria-components";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setImmersive } from "@/lib/readerReducer";

import classNames from "classnames";
import { isActiveElement, isKeyboardTriggered } from "@/helpers/focus";
import { ActionVisibility } from "./ActionComponent";

export interface IActionIconProps {
  className?: string;
  ariaLabel: string;
  SVG: ComponentType<SVGProps<SVGElement>>;
  placement: TooltipProps["placement"];
  tooltipLabel: string;
  visibility: ActionVisibility;
  onPressCallback?: (e: PressEvent) => void;
}

export const ActionIcon: React.FC<Pick<ButtonProps, "preventFocusOnPress"> & IActionIconProps> = ({
  className,
  ariaLabel, 
  SVG,
  placement,
  tooltipLabel,
  visibility,
  onPressCallback,
  ...props
}) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isHovering = useAppSelector(state => state.reader.isHovering);

  const dispatch = useAppDispatch();

  const handleClassNameFromState = () => {
    let className = "";
    
    switch(visibility) {
      case ActionVisibility.always:
        if (!isHovering && isImmersive) {
          className = readerStateStyles.subduedAlways;
        } else {
          className = visibility;
        }
        break;
      case ActionVisibility.partially:
        if (!isHovering && isImmersive) {
          className = readerStateStyles.subduedPartially;
        } else {
          className = visibility;
        }
        break;
      case ActionVisibility.overflow:
      default:
        break;
    }

    return className
  };

  const defaultOnPressFunc = () => {
    dispatch(setImmersive(false));
  };

  const handleImmersive = (event: React.FocusEvent) => {
    // Check whether the focus was triggered by keyboard…
    // We don’t have access to type/modality, unlike onPress
    if (isKeyboardTriggered(event.target)) {
      dispatch(setImmersive(false));
    }
  };

  const blurOnEsc = (event: React.KeyboardEvent) => {
  // TODO: handle Tooltip cos first time you press esc, it’s the tooltip that is closed.
    if (isActiveElement(triggerRef.current) && event.code === "Escape") {
      triggerRef.current!.blur();
    }
  };
  
  return (
    <>
    <TooltipTrigger>
      <Button 
        ref={ triggerRef }
        className={ classNames(readerSharedUI.icon, handleClassNameFromState(), className) } 
        aria-label={ ariaLabel } 
        onPress={ onPressCallback || defaultOnPressFunc }
        onKeyDown={ blurOnEsc } 
        onFocus={ handleImmersive }
        { ...props }
      >
      <SVG aria-hidden="true" focusable="false" />  
      </Button>
      <Tooltip
        className={ readerSharedUI.tooltip }
        placement={ placement } 
        offset={ RSPrefs.theming.icon.tooltipOffset || 0 }
      >
        { tooltipLabel }
      </Tooltip>
    </TooltipTrigger>
    </>
  )
};