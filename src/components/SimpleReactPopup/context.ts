import { createContext, useContext } from "react";

export type PopupContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  triggerId: string;
  hasTrigger: boolean;
  registerTrigger: () => () => void;
};

export const PopupContext = createContext<PopupContextValue | null>(null);

export function usePopupContext(component: string): PopupContextValue {
  const ctx = useContext(PopupContext);
  if (!ctx) {
    throw new Error(`<SimpleReactPopup.${component}> must be rendered inside <SimpleReactPopup>.`);
  }
  return ctx;
}
