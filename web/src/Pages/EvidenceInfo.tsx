import { useContext, useEffect, useState } from "react";
import { fetchNui } from "../utils/fetchNui";
import { EvidenceModalData } from "./Report";
import IconButton from "../components/IconButton";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { isEnvBrowser } from "../utils/misc";
import { useToast } from "../../components/ui/use-toast";
import DeleteButton from "../components/DeleteButton";
import { AppContext } from "../context/AppContext";
import Evidence from "./Evidence";

type Props = {
  evidenceid: number;
};

function EvidenceInfo({ evidenceid }: Props) {
  const { toast } = useToast();
  const { tabs, setTabs, activeTab } = useContext(AppContext);
  const [evidence, setEvidence] = useState<EvidenceModalData>({
    category: "",
    evidenceid: 0,
    title: "",
    id: 0,
    photo: "",
    stateid: "",
  });

  useEffect(() => {
    fetchNui<EvidenceModalData>("GetEvidenceInfo", evidenceid).then((data) => {
      setEvidence(data);
    });
  }, [evidenceid]);

  const SaveEvidence = () => {
    if (!isEnvBrowser()) {
      fetchNui("SaveEvidence", evidence).then((data) => {
        if (data === true) {
          toast({
            title: "Saved!",
            variant: "success",
            duration: 1000,
          });
        }
      });
    } else {
      toast({
        title: "Saved!",
        variant: "success",
        duration: 1000,
      });
    }
  };

  const DeleteEvidence = () => {
    if (!isEnvBrowser()) {
      fetchNui("DeleteEvidence", evidence.evidenceid).then((data) => {
        if (data === true) {
          const newTabs = [...tabs];
          newTabs[activeTab] = {
            title: "Evidence",
            content: <Evidence />,
          };
          setTabs(newTabs);

          toast({
            title: "Deleted!",
            variant: "success",
            duration: 1000,
          });
        }
      });
    } else {
      toast({
        title: "Deleted!",
        variant: "success",
        duration: 1000,
      });
    }
  };

  return (
    <>
      <div className="h-full gap-3 grid grid-cols-3 overflow-visible">
        <div className="col-span-3 flex flex-col gap-3">
          <header className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
            <h3 className="capitalize">
              {evidence.title} (#{evidence.evidenceid})
            </h3>
            <div className="flex items-center gap-2">
              <IconButton
                variant="solid"
                icon={faFloppyDisk}
                onClick={SaveEvidence}
              />
              <DeleteButton onClick={DeleteEvidence} text={evidence.title} />
            </div>
          </header>

          <div className="h-full flex flex-col gap-2 bg-zinc-500/20 p-2">
            <div className="h-52 flex gap-5">
              <div className="h-[208px] w-[208px] aspect-square bg-zinc-500/40">
                <img
                  src={evidence.photo}
                  alt="photo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col w-full justify-between">
                <div className="flex justify-between items-center">
                  <label htmlFor="id" className="text-sm">
                    Evidence ID
                  </label>
                  <input
                    id="id"
                    value={evidence.evidenceid}
                    disabled
                    className="w-3/5 col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 border-none outline-none disabled:bg-zinc-500/20 disabled:text-white/50"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label htmlFor="title" className="text-sm">
                    Title
                  </label>
                  <input
                    id="title"
                    value={evidence.title}
                    onChange={(e) =>
                      setEvidence((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-3/5 col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 border-none outline-none"
                  />
                </div>
                {evidence.category === "photo" && (
                  <div className="flex justify-between items-center">
                    <label htmlFor="url" className="text-sm">
                      Photo URL
                    </label>
                    <input
                      id="url"
                      value={evidence.photo}
                      onChange={(e) =>
                        setEvidence((prev) => ({
                          ...prev,
                          photo: e.target.value,
                        }))
                      }
                      className="w-3/5 col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 border-none outline-none"
                    />
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <label htmlFor="type" className="text-sm">
                    Type
                  </label>
                  <input
                    id="type"
                    disabled
                    value={evidence.category}
                    className="w-3/5 col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 border-none outline-none disabled:bg-zinc-500/20 disabled:text-white/50"
                  />
                </div>
                {evidence.stateid && (
                  <div className="flex justify-between items-center">
                    <label htmlFor="stateid" className="text-sm">
                      State ID
                    </label>
                    <input
                      id="stateid"
                      value={evidence.stateid}
                      className="w-3/5 col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 border-none outline-none"
                    />
                  </div>
                )}
                {evidence.identifier && (
                  <div className="flex justify-between items-center">
                    <label htmlFor="identifier" className="text-sm">
                      Identifier
                    </label>
                    <input
                      id="identifier"
                      value={evidence.identifier}
                      className="w-3/5 col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 border-none outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EvidenceInfo;
