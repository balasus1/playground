export const isInteractiveElement = (element: Element | null) => {
  const iElements = ["A", "AREA", "BUTTON", "DETAILS", "INPUT", "SELECT", "TEXTAREA"];
  const iRoles = ["dialog", "radiogroup", "radio", "menu", "menuitem"]

  if (element && (element instanceof HTMLElement || element instanceof SVGElement)) {
    if (element.closest("[inert]")) return false;
    if (element.hasAttribute("disabled")) return false;
    if (element.role && iRoles.includes(element.role)) return true;
    if (element.tabIndex) return element.tabIndex >= 0;
    if (iElements.includes(element.tagName)) return true;
  }

  return false;
}