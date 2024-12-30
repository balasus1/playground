export enum ActionKeys {
  fullscreen = "fullscreen",
  jumpToPosition = "jumpToPosition",
  settings = "settings",
  toc = "toc"
}

export enum ActionVisibility {
  always = "always",
  partially = "partially",
  overflow = "overflow"
}

export enum ActionComponentVariant {
  button = "iconButton",
  menu = "menuItem"
}

export interface IActionComponent {
  variant: ActionComponentVariant;
}