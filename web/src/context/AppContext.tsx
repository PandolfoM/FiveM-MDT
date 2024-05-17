import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
} from "react";

interface Tab {
  title: string;
  content: JSX.Element;
}

export enum Dialogs {
  References = "references",
  Staff = "staff",
  Certs = "certs",
  Departments = "departments",
  Rank = "rank",
  Tags = "tags",
  Criminals = "criminals",
  Closed = "closed",
}

interface AppContext {
  activeTab: number;
  setActiveTab: Dispatch<SetStateAction<number>>;
  tabs: Array<Tab>;
  setTabs: Dispatch<SetStateAction<Array<Tab>>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: Dialogs;
  setIsOpen: Dispatch<SetStateAction<Dialogs>>;
}

export const AppContext = createContext<AppContext>({
  activeTab: 1,
  setActiveTab: () => {},
  tabs: [],
  setTabs: () => {},
  open: false,
  setOpen: () => {},
  isOpen: Dialogs.Closed,
  setIsOpen: () => {},
});

function AppContextProvider(props: React.PropsWithChildren) {
  const [open, setOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<Dialogs>(Dialogs.Closed);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [tabs, setTabs] = useState<Array<Tab>>([]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        tabs,
        setTabs,
        open,
        setOpen,
        isOpen,
        setIsOpen,
      }}>
      {props.children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
