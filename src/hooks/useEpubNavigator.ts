import { useCallback, useRef } from "react";

import Locale from "../resources/locales/en.json";
import { RSPrefs, ScrollBackTo } from "@/preferences";
import fontStacks from "readium-css/css/vars/fontStacks.json";

import { EPUBLayout, Link, Locator, Publication, ReadingProgression } from "@readium/shared";
import { EpubNavigator, EpubNavigatorListeners, FrameManager, FXLFrameManager } from "@readium/navigator";

import { useAppDispatch } from "@/lib/hooks";

import { ScrollAffordance } from "@/helpers/scrollAffordance";
import { getOptimalLineLength, IOptimalLineLength } from "@/helpers/autoLayout/optimalLineLength";
import { autoPaginate } from "@/helpers/autoLayout/autoPaginate";
import { localData } from "@/helpers/localData";
import { setProgression } from "@/lib/publicationReducer";

type cbb = (ok: boolean) => void;

export interface IEpubNavigatorConfig {
  container: HTMLDivElement | null;
  publication: Publication;
  listeners: EpubNavigatorListeners;
  positionsList?: Locator[];
  initialPosition?: Locator;
  localDataKey: string;
}

export const useEpubNavigator = () => {
  const container = useRef<HTMLDivElement | null>(null);
  const nav = useRef<EpubNavigator | null>(null);
  const publication = useRef<Publication | null>(null);
  const localDataKey = useRef<string | null>(null);

  const arrowsWidth = useRef(2 * ((RSPrefs.theming.arrow.size || 40) + (RSPrefs.theming.arrow.offset || 0)));
  const optimalLineLength = useRef<IOptimalLineLength | null>(null);

  const scrollAffordanceTop = useRef(new ScrollAffordance({ pref: RSPrefs.scroll.topAffordance, placement: "top" }));
  const scrollAffordanceBottom = useRef(new ScrollAffordance({ pref: RSPrefs.scroll.bottomAffordance, placement: "bottom" }));

  const dispatch = useAppDispatch();

  const applyReadiumCSSStyles = useCallback((stylesObj: { [key: string]: string }) => {
    nav.current?._cframes.forEach((frameManager: FrameManager | FXLFrameManager | undefined) => {
      if (frameManager) {
        for (const [key, value] of Object.entries(stylesObj)) {
          frameManager.msg?.send(
            "set_property",
            [key, value],
            (ok: boolean) => (ok ? {} : {})
          );
        }
      }
    })
  }, []);

  const handleColCountReflow = useCallback((colCount: string) => {
    if (container.current) {
      if (!optimalLineLength.current) {
        optimalLineLength.current = getOptimalLineLength({
          minChars: RSPrefs.typography.minimalLineLength,
          optimalChars: RSPrefs.typography.optimalLineLength,
          fontFace: fontStacks.RS__oldStyleTf,
          pageGutter: RSPrefs.typography.pageGutter,
        //  letterSpacing: 2,
        //  wordSpacing: 2,
        //  sample: "It will be seen that this mere painstaking burrower and grub-worm of a poor devil of a Sub-Sub appears to have gone through the long Vaticans and street-stalls of the earth, picking up whatever random allusions to whales he could anyways find in any book whatsoever, sacred or profane. Therefore you must not, in every case at least, take the higgledy-piggledy whale statements, however authentic, in these extracts, for veritable gospel cetology. Far from it. As touching the ancient authors generally, as well as the poets here appearing, these extracts are solely valuable or entertaining, as affording a glancing bird’s eye view of what has been promiscuously said, thought, fancied, and sung of Leviathan, by many nations and generations, including our own."
        });
      }

      let RCSSColCount = 1;

      if (colCount === "auto") {
        RCSSColCount = autoPaginate(RSPrefs.breakpoint, window.innerWidth, optimalLineLength.current.optimal);
      } else if (colCount === "2") {
        const requiredWidth = ((2 * optimalLineLength.current.min) * optimalLineLength.current.fontSize);
        window.innerWidth > requiredWidth ? RCSSColCount = 2 : RCSSColCount = 1;
      } else {
        RCSSColCount = Number(colCount);
      }

      if (RSPrefs.breakpoint <= window.innerWidth) {
        const containerWithArrows = window.innerWidth - arrowsWidth.current;
        const containerWidth = RCSSColCount > 1 ? Math.min(((RCSSColCount * optimalLineLength.current.optimal) * optimalLineLength.current.fontSize), containerWithArrows) : containerWithArrows;
        container.current.style.width = `${containerWidth}px`;
      } else {
        container.current.style.width = `${window.innerWidth}px`;
      }

      applyReadiumCSSStyles({
        "--USER__colCount": `${RCSSColCount}`,
        "--RS__defaultLineLength": `${optimalLineLength.current.optimal}rem`
      })
    }
  }, [applyReadiumCSSStyles]);

  const mountScroll = useCallback(() => {
    nav.current?._cframes.forEach((frameManager: FrameManager | FXLFrameManager | undefined) => {
      if (frameManager) {        
        scrollAffordanceTop.current.render(frameManager.window.document);
        scrollAffordanceBottom.current.render(frameManager.window.document)
      }
    });
  }, []);

  const unmountScroll = useCallback(() => {
    nav.current?._cframes.forEach((frameManager: FrameManager | FXLFrameManager | undefined) => {
      if (frameManager) {
        scrollAffordanceTop.current.destroy(frameManager.window.document);
        scrollAffordanceBottom.current.destroy(frameManager.window.document)
      }
    });
  }, []);

  const applyColumns = useCallback(async (colCount: string) => {
    applyReadiumCSSStyles({
      "--USER__view": "readium-paged-on"
    });
    if (nav.current?.readingProgression !== ReadingProgression.ltr) {
      await nav.current?.setReadingProgression(ReadingProgression.ltr);
    }
    unmountScroll();
    handleColCountReflow(colCount);
  }, [applyReadiumCSSStyles, handleColCountReflow, unmountScroll]);

  const applyScrollable = useCallback(async () => {
    applyReadiumCSSStyles({
      "--USER__view": "readium-scroll-on",
      "--USER__colCount": ""
    });
    if (nav.current?.readingProgression !== ReadingProgression.ttb) {
      await nav.current?.setReadingProgression(ReadingProgression.ttb);
    }
    mountScroll();
  }, [applyReadiumCSSStyles, mountScroll]);

  const scrollBackTo = useCallback((position: ScrollBackTo) => {
    if (position !== ScrollBackTo.untouched) {
      nav.current?._cframes.forEach((frameManager: FrameManager | FXLFrameManager | undefined) => {
        if (frameManager) {
          const scrollingEl = frameManager.window.document.scrollingElement;
          if (position === ScrollBackTo.top) {
            scrollingEl?.scrollTo(0, 0);
          } else {
            scrollingEl?.scrollTo(0, scrollingEl.scrollHeight);
          }
        }
      });
    }
  }, []);

  const setFXLPages = useCallback((count: number) => {
    // @ts-ignore
    nav.current?.pool.setPerPage(count);
  }, [])

  const handleProgression = useCallback((locator: Locator) => {
    const relativeRef = locator.title || Locale.reader.app.progression.referenceFallback;
      
    dispatch(setProgression( { currentPositions: nav.current?.currentPositionNumbers, relativeProgression: locator.locations.progression, currentChapter: relativeRef, totalProgression: locator.locations.totalProgression }));
  }, [dispatch]);  

  // [TMP] Working around positionChanged not firing consistently for FXL
  // We’re observing the FXLFramePoolManager spine div element’s style
  // and checking whether its translate3d has changed.
  // Sure IntersectionObserver should be the obvious one to use here,
  // observing iframes instead of the style attribute on the spine element
  // but there’s additional complexity to handle as a spread = 2 iframes
  // And keeping in sync while the FramePool is re-aligning on resize can be suboptimal
  const FXLPositionChanged = new MutationObserver((mutationsList: MutationRecord[]) => {
    for (const mutation of mutationsList) {
      const re = /translate3d\(([^)]+)\)/;
      const newVal = (mutation.target as HTMLElement).getAttribute(mutation.attributeName as string);
      const oldVal = mutation.oldValue;
      if (newVal?.split(re)[1] !== oldVal?.split(re)[1]) {
        const locator = nav.current?.currentLocator;
        if (locator) {
          handleProgression(locator);
          if (localDataKey.current) localData.set(localDataKey.current, locator)
        }
      }
    }
  });

  const EpubNavigatorLoad = useCallback((config: IEpubNavigatorConfig, cb: Function) => {
    if (config.container) {
      container.current = config.container;
      publication.current = config.publication;
      localDataKey.current = config.localDataKey;

      nav.current = new EpubNavigator(config.container, config.publication, config.listeners, config.positionsList, config.initialPosition);

      nav.current.load().then(() => {
        cb();

        if (nav.current?.layout === EPUBLayout.fixed) {
          // @ts-ignore
          FXLPositionChanged.observe((nav.current?.pool.spineElement as HTMLElement), {attributes: ["style"], attributeOldValue: true});
        }
      });
    }
  }, []);

  const EpubNavigatorDestroy = useCallback((cb: Function) => {
    cb();

    if (nav.current?.layout === EPUBLayout.fixed) {
      FXLPositionChanged.disconnect();
    }
    nav.current?.destroy;
  }, []);

  const goRight = useCallback((animated: boolean, callback: cbb) => {
    nav.current?.goRight(animated, callback);
  }, []);

  const goLeft = useCallback((animated: boolean, callback: cbb) => {
    nav.current?.goLeft(animated, callback)
  }, []);

  const goBackward = useCallback((animated: boolean, callback: cbb) => {
    nav.current?.goBackward(animated, callback);
  }, []);

  const goForward = useCallback((animated: boolean, callback: cbb) => {
    nav.current?.goForward(animated, callback);
  }, []);

  const goLink = useCallback((link: Link, animated: boolean, callback: cbb) => {
    nav.current?.goLink(link, animated, callback);
  }, []);

  const navLayout = useCallback(() => {
    return nav.current?.layout;
  }, []);

  const currentLocator = useCallback(() => {
    return nav.current?.currentLocator;
  }, []);

  const getCframes = useCallback(() => {
    return nav.current?._cframes;
  }, []);

  return { 
    EpubNavigatorLoad, 
    EpubNavigatorDestroy, 
    goRight, 
    goLeft, 
    goBackward, 
    goForward,
    goLink, 
    navLayout, 
    currentLocator,
    getCframes, 
    applyReadiumCSSStyles,
    applyColumns,
    applyScrollable,
    scrollBackTo, 
    handleColCountReflow,
    setFXLPages, 
    handleProgression
  }
}