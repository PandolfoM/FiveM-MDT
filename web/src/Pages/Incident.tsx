import tags from "../data/tags.json";
import { faFloppyDisk, faPlus } from "@fortawesome/free-solid-svg-icons";
import IconButton from "../components/IconButton";
import Modal from "../components/Modal";
import { useContext, useEffect, useState } from "react";
import { AppContext, Dialogs } from "../context/AppContext";
import { Criminal, IncidentData } from "./Incidents";
import { isEnvBrowser } from "../utils/misc";
import { fetchNui } from "../utils/fetchNui";
import { formatDateAgo } from "../utils/functions";
import Tag from "../components/Tag";
import { toast } from "../../components/ui/use-toast";
import { EvidenceModalData, Officers } from "./Report";
import HoverImage from "../components/HoverImage";
import Editor from "../components/Editor";
import PlayerCharges from "../components/PlayerCharges";
import {
  Charge,
  Charges,
  GetChargesData,
  References,
} from "../utils/contstants";
import {
  ChargesModal,
  CriminalsModal,
  ReferencesModal,
  TagsModal,
} from "../components/Modals";

type Props = {
  id?: number;
};

function Incident({ id }: Props) {
  const { setOpen, setIsOpen } = useContext(AppContext);
  const [currentCid, setCurrentCid] = useState<number>(0);
  const [chargesOpen, setChargesOpen] = useState<boolean>(false);
  const [editorTxt, setEditorTxt] = useState<string>("");
  const [dialogType, setDialogType] = useState<
    "officers" | "evidence" | "citizens" | "criminals" | "tags"
  >("criminals");
  const [charges, setCharges] = useState<Charges[]>([]);
  const [refs, setRefs] = useState<References[]>([]);
  const [officers, setOfficers] = useState<Officers[]>([]);
  const [evidence, setEvidence] = useState<EvidenceModalData[]>([]);
  const [incident, setIncident] = useState<IncidentData>({
    author: "",
    description: "",
    incidentid: 0,
    time: 0,
    title: "",
    criminals: [],
    evidence: [],
    officers: [],
    tags: [],
    references: [],
  });

  useEffect(() => {
    if (!isEnvBrowser()) {
      fetchNui<IncidentData>("GetIncident", id).then((data) => {
        setIncident(data);
        setEditorTxt(data.description);
      });

      fetchNui<EvidenceModalData[]>("GetEvidence").then((data) => {
        setEvidence(data);
      });

      fetchNui<Officers[]>("GetOfficers").then((data) => {
        setOfficers(data);
      });

      fetchNui<GetChargesData>("GetCharges", { incidentid: id }).then(
        (data) => {
          setCharges(data.charges);
        }
      );

      fetchNui<References[]>("GetIncidentReferences", id).then((data) => {
        setRefs(data);
      });
    } else {
      setIncident({
        author: "Matt Walker",
        description: "Test",
        incidentid: 6969,
        time: 123123,
        title: "Test Title",
        criminals: [
          {
            citizenid: 1000,
            firstname: "Matt",
            lastname: "Walker",
            pfp: "https://kappa.lol/6HWQV",
          },
          {
            citizenid: 1002,
            firstname: "Ryan",
            lastname: "Johnson",
            pfp: "https://kappa.lol/6HWQV",
          },
        ],
        evidence: [],
        officers: [],
        tags: [],
        references: [],
      });
      setCharges([
        {
          charges: [],
          citizenid: 1002,
          guilty: false,
          processed: false,
          warrant: false,
        },
        {
          charges: [],
          citizenid: 1000,
          guilty: false,
          processed: false,
          warrant: false,
        },
      ]);
    }
  }, [id]);

  useEffect(() => {
    setIncident((prev) => ({ ...prev, description: editorTxt }));
  }, [editorTxt]);

  const AddCrim = (criminal: Criminal) => {
    setIncident((prev) => ({
      ...prev,
      criminals: prev.criminals ? [...prev.criminals, criminal] : [criminal],
    }));
    setCharges((prev) => [
      ...prev,
      {
        charges: [],
        citizenid: criminal.citizenid,
        guilty: false,
        processed: false,
        warrant: false,
      },
    ]);
  };

  const deleteCrim = (cid: number, incidentid: number) => {
    setIncident((prev) => ({
      ...prev,
      criminals: prev.criminals.filter((crim) => crim.citizenid !== cid),
    }));
    setCharges((charges) => charges.filter((item) => item.citizenid !== cid));

    fetchNui<GetChargesData>("GetCharges", { incidentid, citizenid: cid }).then(
      (data) => {
        const newCharges = data.charges.filter(
          (crim) => crim.citizenid !== cid
        );
        const newCrims = incident.criminals.filter(
          (crim) => crim.citizenid !== cid
        );
        const findInCharges = data.charges.find(
          (charge) => charge.citizenid === cid
        );

        const crimIds = newCrims.map((crim) => crim.citizenid);

        // if (data.history && Array.isArray(data.history)) {
        const historyI = data.history.findIndex(
          (item) => item.id === incidentid
        );

        if (historyI !== -1) {
          data.history.splice(historyI, 1);
        }
        // }

        if (findInCharges?.warrant === true) {
          fetchNui("SetWarrant", {
            end_date: null,
            citizenid: cid,
            incidentid: incidentid,
            exists: true,
          });
        }

        fetchNui("SaveCharges", {
          charges: JSON.stringify(newCharges),
          criminals: JSON.stringify(crimIds),
          incidentid,
          citizenid: cid,
          history: JSON.stringify(data.history),
        }).then((data) => {
          if (data === true) {
            toast({
              title: "Saved!",
              variant: "success",
              duration: 1000,
            });
          }
        });
      }
    );
  };

  const addOfficer = (officer: Officers) => {
    setIncident((prev) => ({
      ...prev,
      officers: prev.officers ? [...prev.officers, officer] : [officer],
    }));
  };

  const removeOfficer = (index: number) => {
    setIncident((prev) => ({
      ...prev,
      officers: prev.officers.filter((_, i) => i !== index),
    }));
  };

  const removeEvidence = (index: number) => {
    setIncident((prevReport) => ({
      ...prevReport,
      evidence: prevReport.evidence.filter((_, i) => i !== index),
    }));
  };

  const addEvidence = (evidence: EvidenceModalData) => {
    setIncident((prev) => ({
      ...prev,
      evidence: prev.evidence ? [...prev.evidence, evidence] : [evidence],
    }));
  };

  const AddCharge = (charge: Charge) => {
    setCharges((prev) => {
      return prev.map((citizen) => {
        if (citizen.citizenid === currentCid) {
          return {
            ...citizen,
            charges: [...citizen.charges, charge],
          };
        }
        return citizen;
      });
    });
  };

  const removeCharge = (index: number) => {
    setCharges((prevCharges) => {
      return prevCharges.map((citizen) => {
        if (citizen.citizenid === currentCid) {
          const updatedCharges = citizen.charges.filter((_, i) => i !== index);
          return {
            ...citizen,
            charges: updatedCharges,
          };
        }
        return citizen;
      });
    });
  };

  const createEvidence = (data: EvidenceModalData) => {
    const createEvidenceObject = (data: EvidenceModalData, id: number) => ({
      ...data,
      evidenceid: id,
    });

    if (!isEnvBrowser()) {
      fetchNui<number>("CreateEvidence", data).then((id) => {
        setIncident((prev) => ({
          ...prev,
          evidence: prev.evidence
            ? [...prev.evidence, createEvidenceObject(data, id)]
            : [createEvidenceObject(data, id)],
        }));
      });
    }
  };

  const addTag = (data: string) => {
    setIncident((prev) => ({
      ...prev,
      tags: prev.tags ? [...prev.tags, data] : [data],
    }));
  };

  const removeTag = (i: number) => {
    const updatedItems = [
      ...incident.tags.slice(0, i),
      ...incident.tags.slice(i + 1),
    ];
    setIncident((prev) => ({
      ...prev,
      tags: updatedItems,
    }));
  };

  const addRef = (data: References) => {
    setIncident((prev) => ({
      ...prev,
      references: prev.references ? [...prev.references, data] : [data],
    }));
  };

  const removeRef = (i: number) => {
    setRefs((prev) => {
      const newArray = [...prev];
      newArray.splice(i, 1);
      return newArray;
    });
  };

  const saveIncident = () => {
    if (!isEnvBrowser()) {
      const evidenceIds = incident.evidence.map(
        (evidence) => evidence.evidenceid
      );
      const officerIds = incident.officers.map((officer) => officer.citizenid);
      // const referenceIds = refs.map((ref) =>
      //   ref.incidentid
      // );

      const incidentStringified = {
        ...incident,
        officers: JSON.stringify(officerIds),
        evidence: JSON.stringify(evidenceIds),
        tags: JSON.stringify(incident.tags),
        references: JSON.stringify(refs),
      };
      fetchNui("SaveIncident", incidentStringified).then((data) => {
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

  return (
    <>
      <ReferencesModal onClick={addRef} incident={incident} />
      <TagsModal onClick={addTag} />
      <CriminalsModal onClick={AddCrim} incident={incident} />
      <Modal
        title="Criminal Scum"
        close
        logo
        report={incident}
        data={dialogType === "evidence" ? evidence : officers}
        type={dialogType}
        onClick={
          dialogType === "officers"
            ? addOfficer
            : dialogType === "tags"
            ? addTag
            : addEvidence
        }
        onSubmit={createEvidence}
      />
      <ChargesModal
        open={chargesOpen}
        setOpen={setChargesOpen}
        onClick={AddCharge}
        charges={charges}
        setCharges={setCharges}
        removeClick={removeCharge}
        cid={currentCid}
      />
      <div className="overflow-hidden h-full gap-3 grid grid-cols-3">
        <div className="col-span-2 flex flex-col gap-3">
          <header className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
            <div>
              <h3>View Incident #{incident.incidentid}</h3>
              <h5 className="text-xs text-white/40 font-normal">
                Created by {incident.author} - {formatDateAgo(incident.time)}
              </h5>
            </div>
            <IconButton
              variant="solid"
              icon={faFloppyDisk}
              onClick={saveIncident}
            />
          </header>
          <div className="bg-zinc-500/50 p-2 text-sm font-bold flex justify-between items-center h-9">
            {incident.title}
          </div>
          <div className="flex h-full bg-zinc-500/20 p-2">
            <div className="w-1 h-full bg-ecrp-500 shadow-[0_0_8px_0_rgba(187,154,247,0.8)]" />
            <Editor value={editorTxt} setValue={setEditorTxt} />
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-3 overflow-y-auto">
          {/* Criminals */}
          <section className="flex flex-col gap-2">
            <div className="bg-zinc-500/40 p-2  font-bold flex justify-between items-center h-9">
              <h3>Add Criminal Scum</h3>
              <IconButton
                icon={faPlus}
                variant="solid"
                onClick={() => {
                  setIsOpen(Dialogs.Criminals);
                }}
              />
            </div>
            {incident.criminals?.length > 0 && (
              <>
                {incident.criminals.map((crim, i) => (
                  <PlayerCharges
                    key={i}
                    crim={crim}
                    incident={incident}
                    charges={charges}
                    setCharges={setCharges}
                    setOpen={setChargesOpen}
                    setCid={setCurrentCid}
                    deleteCrim={deleteCrim}
                  />
                ))}
              </>
            )}
          </section>

          {/* Tags */}
          <section>
            <div className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
              <h3>Tags</h3>
              <IconButton
                icon={faPlus}
                variant="solid"
                onClick={() => {
                  setIsOpen(Dialogs.Tags);
                }}
              />
            </div>
            {incident.tags?.length > 0 && (
              <div className="bg-zinc-500/10 flex flex-wrap gap-2 p-2">
                {incident.tags.map((t, i) => (
                  <Tag
                    key={i}
                    onClick={() => removeTag(i)}
                    background={
                      tags.find((tag) => tag.value === t)?.background
                    }>
                    {tags.find((tag) => tag.value === t)?.name}
                  </Tag>
                ))}
              </div>
            )}
          </section>

          {/* Evidence */}
          <section>
            <div className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
              <h3>Evidence</h3>
              <IconButton
                icon={faPlus}
                variant="solid"
                onClick={() => {
                  setOpen(true);
                  setDialogType("evidence");
                }}
              />
            </div>
            {incident.evidence?.length > 0 && (
              <div className="bg-zinc-500/10 flex flex-wrap gap-2 p-2">
                {incident.evidence.map((evidence, i) => (
                  <>
                    {evidence.category === "photo" && (
                      <HoverImage
                        imageurl={evidence.photo ? evidence.photo : ""}
                        key={i}>
                        <Tag onClick={() => removeEvidence(i)}>
                          <>
                            <span className="capitalize">
                              {evidence.category}:{" "}
                            </span>
                            {evidence.title}
                            <span className="text-white/60 text-[.65rem] font-normal">
                              {" "}
                              {evidence.evidenceid}
                            </span>
                          </>
                        </Tag>
                      </HoverImage>
                    )}
                    {evidence.category !== "photo" && (
                      <Tag key={i} onClick={() => removeEvidence(i)}>
                        <>
                          <span className="capitalize">
                            {evidence.category}:
                          </span>
                          {evidence.title}
                          <span className="text-white/60 text-[.65rem] font-normal">
                            {" "}
                            {evidence.evidenceid}
                          </span>
                        </>
                      </Tag>
                    )}
                  </>
                ))}
              </div>
            )}
          </section>

          {/* Officers Involved */}
          <section>
            <div className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
              <h3>Officers Involved</h3>
              <IconButton
                icon={faPlus}
                variant="solid"
                onClick={() => {
                  setOpen(true);
                  setDialogType("officers");
                }}
              />
            </div>
            {incident.officers?.length > 0 && (
              <div className="bg-zinc-500/10 flex flex-wrap gap-2 p-2">
                {incident.officers.map((officer, i) => (
                  <Tag key={i} onClick={() => removeOfficer(i)}>
                    #{officer.callsign} {officer.firstname} {officer.lastname}
                  </Tag>
                ))}
              </div>
            )}
          </section>

          {/* Vehicles */}
          <section>
            <div className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
              <h3>Vehicles</h3>
              <IconButton icon={faPlus} variant="solid" onClick={() => {}} />
            </div>
          </section>

          {/* References */}
          <section>
            <div className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
              <h3>References</h3>
              <IconButton
                icon={faPlus}
                variant="solid"
                onClick={() => {
                  setIsOpen(Dialogs.References);
                }}
              />
            </div>
            {refs.length > 0 && (
              <div className="bg-zinc-500/10 flex flex-wrap gap-2 p-2">
                {refs.map((ref, i) => (
                  <Tag key={i} onClick={() => removeRef(i)}>
                    {ref.title}
                  </Tag>
                ))}
              </div>
            )}
          </section>

          {/* Share Report */}
          <section>
            <div className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
              <h3>Share Report</h3>
              <IconButton icon={faPlus} variant="solid" onClick={() => {}} />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Incident;
