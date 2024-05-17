import React, { useContext, useState } from "react";
import { debugData } from "./utils/debugData";
import { AppContext } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Tabs from "./components/Tabs";
import { Toaster } from "../components/ui/toaster"

// This will set the NUI to visible if we are
// developing in browser
debugData([
  {
    action: "setVisible",
    data: true,
  },
]);

const App: React.FC = () => {
  const { activeTab, tabs } = useContext(AppContext);
  const [hover, setHover] = useState<boolean>(false);
  return (
    <div className="flex items-center justify-center h-full text-white group">
      <div className={`bg-ecrp-900 border-[10px] w-[93%] border-ecrp-700 h-[95%] rounded-2xl overflow-hidden p-5 flex relative z-50 transition-[opacity] ease-in-out ${hover && "opacity-20"}`}>
        <Toaster />
        <Sidebar />
        <div className="pl-5 w-full overflow-hidden">
          <Tabs />
          <div className="h-[95%]">
            {tabs.map((tab, i) => {
              if (activeTab === i) {
                return tab.content;
              }
              return null;
            })}
          </div>
        </div>
      </div>
      <div className="h-full w-full absolute z-10" onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}/>
    </div>
  );
};

export default App;
