export enum DialogMode {
  EDIT = "EDIT",
  ADD = "ADD",
}

export type DialogAction = "delete" | "edit" | "add";

export type DialogResult = {
  action: DialogAction
  id: number | null
  success: boolean
}

export function clickOutside(node) {
  const handleClick = (event: Event): void => {
    if (!node.contains(event.target)) {
      node.dispatchEvent(new CustomEvent("outclick"));
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    destroy(): void {
      document.removeEventListener("click", handleClick, true);
    }
  };
}

