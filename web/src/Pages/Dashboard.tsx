import { useContext, useEffect, useState } from "react";
import { Warrant } from "../utils/contstants";
import { fetchNui } from "../utils/fetchNui";
import { formatDistance } from "date-fns";
import { AppContext } from "../context/AppContext";
import { isEnvBrowser } from "../utils/misc";
import Incident from "./Incident";

function Dashboard() {
  const { activeTab, tabs, setTabs } = useContext(AppContext);
  const [warrants, setWarrants] = useState<Warrant[]>([]);
  useEffect(() => {
    if (!isEnvBrowser()) {
      fetchNui<Warrant[]>("GetWarrants").then((data) => {
        setWarrants(data);
      });
    } else {
      setWarrants([
        {
          citizenid: "1001",
          name: "Matt Walker",
          pfp: "https://kappa.lol/D0jxn",
          end_date: 1715031176458,
          title: "test incident",
          incidentid: 5399
        },
      ]);
    }
  }, []);

  const SelectIncident = (incidentid: number) => {
    const newTabs = [...tabs];
    newTabs[activeTab] = {
      title: "Incidents",
      content: <Incident id={incidentid} />,
    };
    setTabs(newTabs);
  };

  const Warrant = ({ warrant }: { warrant: Warrant }) => {
    return (
      <div
        className="h-max flex gap-1 bg-zinc-500/20 p-1 cursor-pointer"
        onClick={() => SelectIncident(warrant.incidentid)}>
        <img src={warrant.pfp} className="object-cover h-12 w-12" />
        <div className="flex flex-col justify-around">
          <p className="text-sm font-bold">{warrant.name}</p>
          <p className="text-white/50 tracking-tight text-sm">Incident {warrant.incidentid} - {warrant.title}</p>
          <p className="text-xs font-bold tracking-tight bg-zinc-500/50 px-1 py-[0.15rem] w-max">
            Expires in {formatDistance(new Date(), warrant.end_date)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-3 h-full">
      {/* Warrants */}
      <div className="col-span-1 h-full overflow-hidden flex flex-col gap-3">
        <header className="bg-zinc-500/40 p-2 text-sm font-bold flex items-center h-9">
          <h3>Warrants</h3>
        </header>

        <div className="h-full overflow-y-auto">
          {warrants.length > 0 && (
            <>
              {warrants.map((warrant) => (
                <Warrant key={warrant.citizenid} warrant={warrant} />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Announcements */}
      <div className="col-span-1 h-full overflow-hidden flex flex-col gap-3">
        <header className="bg-zinc-500/40 p-2 text-sm font-bold flex items-center h-9">
          <h3>Announcements</h3>
        </header>

        <div className="h-full overflow-y-auto">{/* <Content /> */}</div>
      </div>

      {/* BOLO */}
      <div className="col-span-1 h-full overflow-hidden flex flex-col gap-3">
        <header className="bg-zinc-500/40 p-2 text-sm font-bold flex items-center h-9">
          <h3>BOLO</h3>
        </header>

        <div className="h-full overflow-y-auto">{/* <Content /> */}</div>
      </div>
    </div>
  );
}

export default Dashboard;
