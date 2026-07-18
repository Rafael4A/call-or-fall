import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";
import type { Views } from "../types";

const ViewContext = createContext<{
  setView: Dispatch<SetStateAction<Views>>;
  view: Views;
}>({
  setView: () => {
    throw new Error("setView function not implemented");
  },
  view: "HOME" as Views,
});

//eslint-disable-next-line react-refresh/only-export-components
export function useViewContext() {
  return useContext(ViewContext);
}

export function ViewProvider({ children }: Readonly<PropsWithChildren>) {
  const [view, setView] = useState<Views>("HOME");

  return <ViewContext value={{ setView, view }}>{children}</ViewContext>;
}
