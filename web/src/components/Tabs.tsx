import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import Dashboard from "../Pages/Dashboard";

function Tabs() {
  const { tabs, setTabs, setActiveTab, activeTab } = useContext(AppContext);

  useEffect(() => {
    if (tabs.length < 1) {
      setTabs([{ title: "Dashboard", content: <Dashboard /> }]);
      setActiveTab(0);
    }
  }, []);

  const addNewTab = () => {
    setTabs((prev) => [
      ...prev,
      { title: "Dashboard", content: <Dashboard /> },
    ]);
    setActiveTab(tabs.length);
  };

  const deleteTab = (indexToDelete: number) => {
    setTabs((prevTabs) => {
      return prevTabs.filter((_, index) => index !== indexToDelete);
    });

    if (activeTab === indexToDelete) {
      setActiveTab(tabs.length - 2);
    } else if (activeTab === 0) {
      setActiveTab(0);
    }
  };

  const changeTab = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="flex gap-3 w-full overflow-hidden no-scrollbar row-span-1 h-[5%]">
      {/* Tabs */}
      {tabs.map((tab, i) => (
        <div
          key={i}
          className={`relative h-[1.9rem] w-[8.5rem] min-w-16 bg-zinc-500/40 transform cursor-pointer`}>
          {/* Text */}
          <div
            className={`flex items-center h-full pl-2`}
            onClick={() => changeTab(i)}>
            <p className="text-left text-sm overflow-hidden text-ellipsis font-bold select-none pointer-events-none">
              {tab.title}
            </p>
            <div
              className={`absolute inset-0 border-b-2  w-1/3 ${
                activeTab === i ? "border-ecrp-500" : "border-transparent"
              }`}></div>
          </div>

          {/* Bottom Border */}

          {/* Close X */}
          <div
            className={`bg-ecrp-500 w-7 absolute top-0 -right-1 transform skew-x-12 flex items-center justify-center h-8 cursor-pointer z-10`}
            onClick={() => deleteTab(i)}>
            <FontAwesomeIcon icon={faX} size="xs" className="font-bold" />
          </div>
        </div>
      ))}

      {/* New Tab */}
      <div
        className="relative h-8 min-w-7 max-w-7 bg-ecrp-500 skew-x-12 flex items-center justify-center cursor-pointer"
        onClick={addNewTab}>
        <FontAwesomeIcon icon={faPlus} size="sm" className="font-bold" />
      </div>
    </div>
  );
}

export default Tabs;
