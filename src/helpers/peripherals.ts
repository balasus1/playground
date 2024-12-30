// Peripherals based on XBReader
import { RSPrefs } from "@/preferences";
import { buildShortcut, PShortcut } from "./keyboard/buildShortcut";

import { useAppStore } from "@/lib/hooks";
import { isInteractiveElement } from "./isInteractiveElement";
import { ActionKeys } from "@/components/Templates/ActionComponent";

export interface PCallbacks {
  moveTo: (direction: "left" | "right" | "up" | "down" | "home" | "end") => void;
  goProgression: (shiftKey?: boolean) => void;
  toggleFullscreen: () => void;
}

interface PShortcuts {
  [key: string]: PShortcut;
}

export default class Peripherals {
  private readonly observers = ["keydown"];
  private targets: EventTarget[] = [];
  private readonly callbacks: PCallbacks;
  private readonly store = useAppStore();
  private readonly shortcuts: PShortcuts;

  constructor(callbacks: PCallbacks) {
    this.observers.forEach((method) => {
      (this as any)["on" + method] = (this as any)["on" + method].bind(this);
    });
    this.callbacks = callbacks;
    this.shortcuts = this.retrieveShortcuts();
  }

  private getPlatformModifier() {
    return this.store.getState().reader.platformModifier.modifier;
  }

  private retrieveShortcuts() {
    const shortcutsObj: PShortcuts = {};

    for (const actionKey in ActionKeys) {
      const shortcutString = RSPrefs.actions[actionKey as keyof typeof ActionKeys].shortcut;
      
      if (shortcutString) {
        const shortcutObj = buildShortcut(shortcutString);

        Object.defineProperty(shortcutsObj, actionKey, {
          value: shortcutObj,
          writable: false,
          enumerable: true
        });
      }
    }
    return shortcutsObj;
  }

  destroy() {
    this.targets.forEach((t) => this.unobserve(t));
  }

  unobserve(item: EventTarget) {
    if (!item) return;
    this.observers.forEach((EventName) => {
      item.removeEventListener(
        EventName,
        (this as any)["on" + EventName],
        false
      );
    });
    this.targets = this.targets.filter((t) => t !== item);
  }

  observe(item: EventTarget) {
    if (!item) return;
    if (this.targets.includes(item)) return;
    this.observers.forEach((EventName) => {
      item.addEventListener(EventName, (this as any)["on" + EventName], false);
    });
    this.targets.push(item);
  }

  onkeydown(e: KeyboardEvent) {
    if (!isInteractiveElement(document.activeElement)) {
      switch(e.code) {
        case "Space":
          this.callbacks.goProgression(e.shiftKey);
          break;
        case "ArrowRight":
          this.callbacks.moveTo("right");
          break;
        case "ArrowLeft":
          this.callbacks.moveTo("left");
          break;
        case "ArrowUp":
        case "PageUp":
          this.callbacks.moveTo("up");
          break;
        case "ArrowDown":
        case "PageDown":
          this.callbacks.moveTo("down");
          break;
        case "Home":
          this.callbacks.moveTo("home");
          break;
        case "End":
          this.callbacks.moveTo("end");
          break;
        case "F11":
          if (e[this.getPlatformModifier()]) this.callbacks.toggleFullscreen();
          break;
        default:
          break;
      } 
    }
  }
}