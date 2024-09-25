"use client";

import "./reader.css";
import fontStacks from "readium-css/css/vars/fontStacks.json";

import {
  BasicTextSelection,
  FrameClickEvent,
} from "@readium/navigator-html-injectables";
import { EpubNavigator, EpubNavigatorListeners, FrameManager, FXLFrameManager } from "@readium/navigator";
import { Locator, Manifest, Publication, Fetcher, HttpFetcher, EPUBLayout, ReadingProgression } from "@readium/shared";
import Peripherals from "@/helpers/peripherals";
import { useEffect, useState, useRef } from "react";
import { ReaderFooter } from "./ReaderFooter";
import { ReaderHeader } from "./ReaderHeader";
import { autoPaginate } from "@/helpers/autoLayout/autoPaginate";
import { RSPrefs } from "@/preferences";
import { getOptimalLineLength } from "@/helpers/autoLayout/optimalLineLength";

import LeftArrow from "./assets/icons/baseline-arrow_left_ios-24px.svg";
import RightArrow from "./assets/icons/baseline-arrow_forward_ios-24px.svg";
import { control } from "../helpers/control";
import Locale from "../resources/locales/en.json";

export const Reader = ({ rawManifest, selfHref }: { rawManifest: object, selfHref: string }) => {
  const container = useRef<HTMLDivElement>(null);
  let nav: EpubNavigator | undefined;
  let isRTL: boolean = false;

  const [immersive, setImmersive] = useState(false);
  const [fullscreen, setFullscren] = useState(false);
  const [publicationStart, setPublicationStart] = useState(true);
  const [publicationEnd, setPublicationEnd] = useState(false);
  const [breakpointReached, setBreakpointReached] = useState(false);

  useEffect(() => {
    const fetcher: Fetcher = new HttpFetcher(undefined, selfHref);
    const manifest = Manifest.deserialize(rawManifest)!;
    manifest.setSelfLink(selfHref);

    const publication = new Publication({
      manifest: manifest,
      fetcher: fetcher,
    });

    isRTL = (publication.metadata.effectiveReadingProgression === ReadingProgression.rtl);

    const p = new Peripherals({
      moveTo: (direction) => {
        if (direction === "right") {
          nav.goRight(true, () => {});
        } else if (direction === "left") {
          nav.goLeft(true, () => {});
        }
      },
      goProgression: (shiftKey) => {
        shiftKey 
          ? nav.goBackward(true, () => {}) 
          : nav.goForward(true, () => {});
      },
      resize: () => {
        handleResize();
      }
    });

    let optimalLineLength: number;

    const handleResize = () => {
      if (nav && container.current) {
        setBreakpointReached(RSPrefs.breakpoint < container.current!.clientWidth);

        const colCount = autoPaginate(RSPrefs.breakpoint, container.current.clientWidth, optimalLineLength);

        nav._cframes.forEach((frameManager: FrameManager | FXLFrameManager | undefined) => {
          if (frameManager) {
            frameManager.window.document.documentElement.style.setProperty("--RS__colCount", `${colCount}`);
            frameManager.window.document.documentElement.style.setProperty("--RS__defaultLineLength", `${optimalLineLength}rem`);
            frameManager.window.document.documentElement.style.setProperty("--RS__pageGutter", `${RSPrefs.pageGutter}px`);
          }
        });
      }
    };

    const initReadingEnv = () => {
      if (nav.layout === EPUBLayout.reflowable) {
        optimalLineLength = getOptimalLineLength({
          chars: RSPrefs.lineLength,
          fontFace: fontStacks.RS__oldStyleTf,
          pageGutter: RSPrefs.pageGutter,
        //  letterSpacing: 2,
        //  wordSpacing: 2,
        //  sample: "It will be seen that this mere painstaking burrower and grub-worm of a poor devil of a Sub-Sub appears to have gone through the long Vaticans and street-stalls of the earth, picking up whatever random allusions to whales he could anyways find in any book whatsoever, sacred or profane. Therefore you must not, in every case at least, take the higgledy-piggledy whale statements, however authentic, in these extracts, for veritable gospel cetology. Far from it. As touching the ancient authors generally, as well as the poets here appearing, these extracts are solely valuable or entertaining, as affording a glancing bird’s eye view of what has been promiscuously said, thought, fancied, and sung of Leviathan, by many nations and generations, including our own."
        });
        handleResize();
      }
    }

    const listeners: EpubNavigatorListeners = {
      frameLoaded: function (_wnd: Window): void {
        initReadingEnv();
        nav._cframes.forEach(
          (frameManager: FrameManager | FXLFrameManager | undefined) => {
            if (frameManager) p.observe(frameManager.window);
          }
        );
        p.observe(window);
      },
      positionChanged: function (_locator: Locator): void {
        window.focus();
        
        // Start of publication
        if (_locator.locations.totalProgression === 0) {
          setPublicationStart(true);
        } else {
          setPublicationStart(false);
        }

        // End of publication TBD
      },
      tap: function (_e: FrameClickEvent): boolean {
        return false;
      },
      click: function (_e: FrameClickEvent): boolean {
        return false;
      },
      zoom: function (_scale: number): void {},
      miscPointer: function (_amount: number): void {
        setImmersive(immersive => !immersive);
      },

      customEvent: function (_key: string, _data: unknown): void {},
      handleLocator: function (locator: Locator): boolean {
        const href = locator.href;
        if (
          href.startsWith("http://") ||
          href.startsWith("https://") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:")
        ) {
          if (confirm(`Open "${href}" ?`)) window.open(href, "_blank");
        } else {
          console.warn("Unhandled locator", locator);
        }
        return false;
      },
      textSelected: function (_selection: BasicTextSelection): void {},
    };
    const nav = new EpubNavigator(container.current!, publication, listeners);
    nav.load().then(() => {
      p.observe(window);

      window.addEventListener("reader-control", (ev) => {
        const detail = (ev as CustomEvent).detail as {
          command: string;
          data: unknown;
        };
        switch (detail.command) {
          case "goRight":
            nav.goRight(true, () => {});
            break;
          case "goLeft":
            nav.goLeft(true, () => {});
            break;
          case "goTo":
            const link = nav.publication.linkWithHref(detail.data as string);
            if (!link) {
              console.error("Link not found", detail.data);
              return;
            }
            nav.goLink(link, true, () => {});
            break;
          default:
            console.error("Unknown reader-control event", ev);
        }
      });
    });

    return () => {
      // Cleanup TODO!
      p.destroy();
      nav.destroy();
    };
  }, [rawManifest, selfHref]);

  return (
    <>
      <ReaderHeader 
        className={immersive ? "immersive" : ""} 
        title = { nav?.publication.metadata.title.getTranslation("en") } 
      />

      <nav className="arrow-container" id="arrow-left">
        <button 
          title={isRTL ? Locale.reader.navigation.moveForward : Locale.reader.navigation.moveBackward} 
          aria-label={isRTL ? Locale.reader.navigation.moveForward : Locale.reader.navigation.moveBackward} 
          onClick={() => { control("goLeft")} } 
          className={(immersive && !breakpointReached || fullscreen || publicationStart) ? "arrow-hidden": immersive ? "immersive" : ""} 
          disabled={publicationStart ? true : false}>
          <LeftArrow aria-hidden="true" focusable="false"/>
        </button>
      </nav>

      <article id="wrapper" aria-label={Locale.reader.app.publicationWrapper}>
        <div id="container" ref={container}></div>
      </article>

      <nav className="arrow-container" id="arrow-right">
        <button 
          title={isRTL ? Locale.reader.navigation.moveBackward : Locale.reader.navigation.moveForward}
          aria-label={isRTL ? Locale.reader.navigation.moveBackward : Locale.reader.navigation.moveForward}
          onClick={() => { control("goRight")} } 
          className={(immersive && !breakpointReached || fullscreen || publicationEnd) ? "arrow-hidden": immersive ? "immersive" : ""} 
          disabled={publicationEnd ? true : false}>
          <RightArrow aria-hidden="true" focusable="false"/>
        </button>
      </nav>

      <ReaderFooter
        className={immersive ? "immersive" : ""}
      />
    </>
  );
};
