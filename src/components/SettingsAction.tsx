import React from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import settingsStyles from "./assets/styles/readerSettings.module.css";
import readerSharedUI from "./assets/styles/readerSharedUI.module.css";

import TuneIcon from "./assets/icons/match_case.svg";
import CloseIcon from "./assets/icons/close.svg";

import { Button, Dialog, DialogTrigger, Heading, Popover, Separator } from "react-aria-components";
import { ActionIcon } from "./Templates/ActionIcon";
import { OverflowMenuItem } from "./Templates/OverflowMenuItem";
import { ActionComponentVariant, ActionKeys, IActionComponent } from "./Templates/ActionComponent";
import { ReadingDisplayCol } from "./ReadingDisplayCol";
import { ReadingDisplayLayout } from "./ReadingDisplayLayout";
import { ReadingDisplayTheme } from "./ReadingDisplayTheme";

import { setHovering, setSettingsOpen } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export const SettingsAction: React.FC<IActionComponent> = ({ variant }) => {
  const isOpen = useAppSelector(state => state.reader.settingsOpen);
  const dispatch = useAppDispatch();

  const setOpen = (value: boolean) => {
    dispatch(setSettingsOpen(value));

    // hover false otherwise it tends to stay on close button press…
    if (!value) dispatch(setHovering(false));
  }


  if (variant && variant === ActionComponentVariant.menu) {
    return(
      <>
        <OverflowMenuItem 
          label={ Locale.reader.settings.trigger }
          SVG={ TuneIcon }
          shortcut={ RSPrefs.actions.settings.shortcut } 
          id={ ActionKeys.settings }
        />
      </>
    )
  } else {
    return(
      <>
      <DialogTrigger>
        <ActionIcon 
          visibility={ RSPrefs.actions[ActionKeys.settings].visibility }
          ariaLabel={ Locale.reader.settings.trigger }
          SVG={ TuneIcon } 
          placement="bottom" 
          tooltipLabel={ Locale.reader.settings.tooltip } 
          onPressCallback={ () => setOpen(true) }
        />
        <Popover 
          placement="bottom" 
          className={ settingsStyles.readerSettingsPopover }
          isOpen={ isOpen }
          onOpenChange={ setOpen } 
          >
          <Dialog>
            <Button 
              autoFocus={ true }
              className={ readerSharedUI.closeButton } 
              aria-label={ Locale.reader.settings.close } 
              onPress={ () => setOpen(false) }
            >
              <CloseIcon aria-hidden="true" focusable="false" />
            </Button>
            <Heading slot="title" className={ readerSharedUI.popoverHeading }>{ Locale.reader.settings.heading }</Heading>
            <ReadingDisplayTheme />
            <Separator />
            <ReadingDisplayCol />
            <Separator />
            <ReadingDisplayLayout />
          </Dialog>
        </Popover>
      </DialogTrigger>
      </>
    )
  }
}