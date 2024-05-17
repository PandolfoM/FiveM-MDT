import { faShoePrints } from "@fortawesome/free-solid-svg-icons";
import Search from "../components/Search";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EvidenceModalData } from "./Report";
import { fetchNui } from "../utils/fetchNui";
import { AppContext } from "../context/AppContext";
import EvidenceInfo from "./EvidenceInfo";

function Evidence() {
  const {activeTab, tabs, setTabs} = useContext(AppContext)
  const [value, setValue] = useState<string>("");
  const [evidence, setEvidence] = useState<EvidenceModalData[]>([])

  const SelectEvidence = (evidenceid: number) => {
    const newTabs = [...tabs];
    newTabs[activeTab] = {
      title: "Evidence",
      content: <EvidenceInfo evidenceid={evidenceid} />,
    };
    setTabs(newTabs);
  };

  const Content = ({evidence}: {evidence: EvidenceModalData}) => {
    return (
      <div className="flex gap-1 bg-zinc-500/20 p-1" onClick={() => SelectEvidence(evidence.evidenceid)}>
        <div className="bg-zinc-500/20 aspect-square h-12 flex items-center justify-center text-white/50">
          <FontAwesomeIcon icon={faShoePrints} size="xl" />
        </div>
        <div className="flex flex-col justify-between gap-[2px]">
          <p className="text-sm font-bold leading-3 capitalize">{evidence.category}</p>
          <p className="text-sm text-white/50">{evidence.title}</p>
          <p className=" bg-ecrp-500 w-fit text-xs px-1 leading-4">ID: {evidence.evidenceid}</p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchNui<EvidenceModalData[]>("GetEvidence").then((data) => {
      setEvidence(data);
    });
  }, [])

  return (
    <div className="overflow-hidden h-full flex flex-col gap-3">
      <header className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
        <h3>Evidence</h3>
        <div className="flex gap-1 max-h-50% whitespace-nowrap">
          <Search value={value} setValue={setValue} />
        </div>
      </header>

      <div className="h-full overflow-y-auto flex flex-col gap-1 custom-scrollbar">
        {evidence.map((evi, i) => (
          <Content key={i} evidence={evi} />
        ))}
      </div>
    </div>
  );
}

export default Evidence;
