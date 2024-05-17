import Button from "./Button";
import {
  faCalendar,
  faClipboardUser,
  faFileLines,
  faGavel,
  faLocationDot,
  faShoePrints,
  faTableColumns,
  faTriangleExclamation,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import ecrpLogo from "../assets/ecrp.svg";
import CurrentUser from "./CurrentUser";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Dashboard from "../Pages/Dashboard";
import TimeDisplay from "./TimeDisplay";
import Reports from "../Pages/Reports";
import Evidence from "../Pages/Evidence";
import Profiles from "../Pages/Profiles";
import Incidents from "../Pages/Incidents";
import Staff from "../Pages/Staff";
import Charges from "../Pages/Charges";

const Buttons = [
  {
    text: "Dashboard",
    icon: faTableColumns,
    content: <Dashboard />,
  },
  {
    text: "Profiles",
    icon: faUser,
    content: <Profiles />,
  },
  {
    text: "Incidents",
    icon: faTriangleExclamation,
    content: <Incidents />,
  },
  {
    text: "Reports",
    icon: faFileLines,
    content: <Reports />,
  },
  {
    text: "Evidence",
    icon: faShoePrints,
    content: <Evidence />,
  },
  {
    text: "Charges",
    icon: faLocationDot,
    content: <Charges />,
  },
  {
    text: "Staff",
    icon: faClipboardUser,
    content: <Staff />,
  },
  {
    text: "Legislation",
    icon: faGavel,
    content: <div></div>,
  },
  {
    text: "Calendar",
    icon: faCalendar,
    content: <div></div>,
  },
  {
    text: "Shared Reports",
    icon: faFileLines,
    content: <div></div>,
  },
];

function Sidebar() {
  const { activeTab, tabs, setTabs } = useContext(AppContext);

  const handleButtonClick = (buttonIndex: number) => {
    const newTabs = [...tabs];
    newTabs[activeTab] = {
      title: Buttons[buttonIndex].text,
      content: Buttons[buttonIndex].content,
    };
    setTabs(newTabs);
  };

  return (
    <aside className="flex flex-col justify-between border-r-2 border-zinc-500/30 pl-5 pr-5 overflow-hidden w-60 min-w-60">
      <div className="flex flex-col items-start text-left text-sm gap-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <img src={ecrpLogo} width={25} />
          <div>
            <p className="leading-4">Epicans</p>
            <p className="text-xs leading-4 whitespace-nowrap">
              Los Santos Police
            </p>
          </div>
        </div>

        {/* Buttons */}
        <>
          {Buttons.map((button, i) => (
            <Button
              key={i}
              text={button.text}
              icon={button.icon}
              variant={
                tabs[activeTab]?.title === button.text ? "active" : "outline"
              }
              onClick={() => handleButtonClick(i)}
            />
          ))}
        </>

        {/* Time */}
        <TimeDisplay />
      </div>

      <CurrentUser />
    </aside>
  );
}

export default Sidebar;
