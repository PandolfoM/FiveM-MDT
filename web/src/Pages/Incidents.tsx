import { faGavel, faPlus } from "@fortawesome/free-solid-svg-icons";
import Search from "../components/Search";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { AppContext } from "../context/AppContext";
import Incident from "./Incident";
import { fetchNui } from "../utils/fetchNui";
import { formatDateAgo } from "../utils/functions";
import { isEnvBrowser } from "../utils/misc";
import { EvidenceModalData, Officers } from "./Report";
import { References } from "../utils/contstants";

export interface IncidentModalData {
  title: string;
}

export type Criminal = {
  firstname: string;
  lastname: string;
  pfp: string;
  citizenid: number;
  name?: string;
};

export type IncidentData = {
  title: string;
  incidentid: number;
  author: string;
  time: number;
  description: string;
  criminals: Criminal[],
  officers: Officers[],
  evidence: EvidenceModalData[],
  tags: string[]
  references: References[]
};

function Incidents() {
  const { setTabs, activeTab, tabs, setOpen } = useContext(AppContext);
  const [value, setValue] = useState<string>("");
  const [incidents, setIncidents] = useState<Array<IncidentData>>([]);

  useEffect(() => {
    fetchNui<IncidentData[]>("GetIncidents").then((data) => {
      setIncidents(data);
    });
  }, []);

  const selectIncident = (id: number) => {
    const newTabs = [...tabs];
    newTabs[activeTab] = {
      title: "Incidents",
      content: <Incident id={id} />,
    };
    setTabs(newTabs);
  };

  const CreateIncident = (data: IncidentModalData) => {
    if (!isEnvBrowser()) {
      fetchNui<number>("CreateIncident", {
        title: data.title,
      }).then((data) => {
        const newTabs = [...tabs];
        newTabs[activeTab] = {
          title: "Incidents",
          content: <Incident id={data} />,
        };
        setTabs(newTabs);
      });
    } else {
      const newTabs = [...tabs];
      newTabs[activeTab] = {
        title: "Incidents",
        content: <Incident />,
      };
      setTabs(newTabs);
    }
  };

  const Content = ({ incident }: { incident: IncidentData }) => {
    return (
      <div className="flex gap-1 bg-zinc-500/20 p-1"  onClick={() => selectIncident(incident.incidentid)}>
        <div className="bg-zinc-500/20 aspect-square h-12 flex items-center justify-center text-white/50">
          <FontAwesomeIcon icon={faGavel} size="xl" />
        </div>
        <div className="flex flex-col justify-between gap-[2px]">
          <p className="text-sm font-bold leading-3">{incident.title}</p>
          <div className="bg-zinc-50/20 flex items-center text-xs max-w-max">
            <p className=" bg-ecrp-500 w-fit px-1 leading-4 h-full py-[0.1rem]">
              ID: {incident.incidentid}
            </p>
            <p className="px-1 py-[0.1rem]">
              {incident.author} - {formatDateAgo(incident.time)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Modal
        title="Create Incident"
        close
        logo
        type="incident"
        onSubmit={CreateIncident}
      />
      <div className="overflow-hidden h-full flex flex-col gap-3">
        <header className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
          <h3>Incidents</h3>
          <div className="flex gap-1 max-h-50% whitespace-nowrap">
            <Button
              variant="solid"
              text="Create Incident"
              icon={faPlus}
              onClick={() => setOpen(true)}
              className="w-max"
            />
            <Search value={value} setValue={setValue} />
          </div>
        </header>

        <div className="h-full overflow-y-auto flex flex-col gap-1 custom-scrollbar">
          {incidents.map((incident, i) => (
            <Content key={i} incident={incident} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Incidents;
