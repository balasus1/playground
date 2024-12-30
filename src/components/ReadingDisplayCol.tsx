import React, { useEffect } from "react";

import Locale from "../resources/locales/en.json";
import settingsStyles from "./assets/styles/readerSettings.module.css";

import AutoLayoutIcon from "./assets/icons/document_scanner.svg";
import OneColIcon from "./assets/icons/article.svg";
import TwoColsIcon from "./assets/icons/menu_book.svg";

import { RadioGroup, Radio, Label } from "react-aria-components";
import { setColCount } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export const ReadingDisplayCol = () => {
  const isPaged = useAppSelector(state => state.reader.isPaged);
  const colCount = useAppSelector(state => state.reader.colCount) || "auto";
  const dispatch = useAppDispatch();
  const scrollable = !isPaged;

  const handleChange = (value: string) => {
    dispatch(setColCount(value));
  }

  useEffect(() => {
    if (scrollable) {
      dispatch(setColCount("auto"));
    } else {
      dispatch(setColCount(colCount));
    }
  }, [scrollable, colCount, dispatch]);

  return (
    <>
    <div>
      <RadioGroup 
        orientation="horizontal" 
        value={`${ colCount }`} 
        onChange={ handleChange }
      >
        <Label className={ settingsStyles.readerSettingsLabel }>{ Locale.reader.settings.column.title }</Label>
        <div className={ settingsStyles.readerSettingsRadioWrapper }>
          <Radio 
            className={ settingsStyles.readerSettingsRadio } 
            value="auto" 
            isDisabled={ false }
          >
            <AutoLayoutIcon aria-hidden="true" focusable="false" />
            <span>{ Locale.reader.settings.column.auto }</span>
          </Radio>
          <Radio 
            className={ settingsStyles.readerSettingsRadio } 
            value="1" 
            isDisabled={ scrollable }
          >
            <OneColIcon aria-hidden="true" focusable="false" />
            <span>{ Locale.reader.settings.column.one }</span>
          </Radio>
          <Radio 
            className={ settingsStyles.readerSettingsRadio } 
            value="2" 
            isDisabled={ scrollable }
          >
            <TwoColsIcon aria-hidden="true" focusable="false" />
            <span>{ Locale.reader.settings.column.two }</span>
          </Radio>
        </div>
      </RadioGroup>
    </div>
    </>
  );
}