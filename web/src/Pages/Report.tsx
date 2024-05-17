import tags from "../data/tags.json";
import { faFloppyDisk, faPlus } from "@fortawesome/free-solid-svg-icons";
import IconButton from "../components/IconButton";
import Editor from "../components/Editor";
import { useContext, useEffect, useState } from "react";
import { fetchNui } from "../utils/fetchNui";
import { isEnvBrowser } from "../utils/misc";
import { formatDateAgo } from "../utils/functions";
import { toast } from "../../components/ui/use-toast";
import Modal from "../components/Modal";
import { AppContext, Dialogs } from "../context/AppContext";
import Tag from "../components/Tag";
import HoverImage from "../components/HoverImage";
import { ReferencesModal, TagsModal } from "../components/Modals";
import { References } from "../utils/contstants";

type Props = {
  id?: number;
};

export type Officers = {
  callsign: string;
  firstname: string;
  lastname: string;
  pfp: string;
  citizenid: number;
};

export type Citizen = {
  firstname: string;
  lastname: string;
  pfp: string;
  citizenid: number;
};

export type Report = {
  reportid: number;
  title: string;
  category: string;
  author: string;
  description: string;
  time: number;
  officers: Officers[];
  citizens: Citizen[];
  evidence: EvidenceModalData[];
  tags: string[];
  references: References[];
};

export interface EvidenceModalData {
  id: number;
  identifier?: string;
  title: string;
  category: string;
  evidenceid: number;
  photo?: string;
  stateid?: string;
}

export interface OfficersModalData {
  title: string;
  category: string;
  id: string;
  stateid: string;
}

function Report({ id }: Props) {
  const { setOpen, setIsOpen } = useContext(AppContext);
  const [dialogType, setDialogType] = useState<
    "officers" | "evidence" | "citizens"
  >("officers");
  const [refs, setRefs] = useState<References[]>([]);
  const [editorTxt, setEditorTxt] = useState<string>("");
  const [officers, setOfficers] = useState<Officers[]>([]);
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [evidence, setEvidence] = useState<EvidenceModalData[]>([]);
  const [report, setReport] = useState<Report>({
    author: "",
    category: "",
    description: "",
    reportid: 0,
    time: 0,
    title: "",
    officers: [],
    evidence: [],
    citizens: [],
    tags: [],
    references: [],
  });

  useEffect(() => {
    if (!isEnvBrowser()) {
      fetchNui<Report>("GetReport", id).then((data) => {
        setReport(data);
        setEditorTxt(data.description);
      });

      fetchNui<Officers[]>("GetOfficers").then((data) => {
        setOfficers(data);
      });

      fetchNui<Citizen[]>("GetCitizens").then((data) => {
        setCitizens(data);
      });

      fetchNui<EvidenceModalData[]>("GetEvidence").then((data) => {
        setEvidence(data);
      });

      fetchNui<References[]>("GetReportReferences", id).then((data) => {
        setRefs(data);
      });
    } else {
      setReport({
        author: "Matt Walker",
        category: "Reports",
        description: "This is a test description",
        reportid: 1234,
        time: 1712253450000,
        title: "Test Title",
        officers: [],
        citizens: [],
        references: [],
        tags: [],
        evidence: [
          {
            id: 0,
            category: "photo",
            evidenceid: 1000,
            title: "test evidence",
            photo: "https://kappa.lol/641HC",
          },
        ],
      });
    }
  }, [id]);

  useEffect(() => {
    setReport((prev) => ({ ...prev, description: editorTxt }));
  }, [editorTxt]);

  const saveReport = () => {
    if (!isEnvBrowser()) {
      const evidenceIds = report.evidence.map(
        (evidence) => evidence.evidenceid
      );
      const officerIds = report.officers.map((officer) => officer.citizenid);
      const civIds = report.citizens.map((civ) => civ.citizenid);
      const reportStringified = {
        ...report,
        officers: JSON.stringify(officerIds),
        citizens: JSON.stringify(civIds),
        evidence: JSON.stringify(evidenceIds),
        tags: JSON.stringify(report.tags),
        references: JSON.stringify(refs),
      };
      fetchNui("SaveReport", reportStringified).then((data) => {
        if (data === true) {
          toast({
            title: "Saved Report!",
            variant: "success",
            duration: 1000,
          });
        }
      });
    } else {
      toast({
        title: "Saved Report!",
        variant: "success",
        duration: 1000,
      });
    }
  };

  const addOfficer = (officer: Officers) => {
    setReport((prev) => ({
      ...prev,
      officers: prev.officers ? [...prev.officers, officer] : [officer],
    }));
  };

  const createEvidence = (data: EvidenceModalData) => {
    const createEvidenceObject = (data: EvidenceModalData, id: number) => ({
      ...data,
      evidenceid: id,
    });

    if (!isEnvBrowser()) {
      fetchNui<number>("CreateEvidence", data).then((id) => {
        setReport((prev) => ({
          ...prev,
          evidence: prev.evidence
            ? [...prev.evidence, createEvidenceObject(data, id)]
            : [createEvidenceObject(data, id)],
        }));
      });
    }
  };

  const removeOfficer = (index: number) => {
    setReport((prevReport) => ({
      ...prevReport,
      officers: prevReport.officers.filter((_, i) => i !== index),
    }));
  };

  const removeCitizen = (index: number) => {
    setReport((prevReport) => ({
      ...prevReport,
      citizens: prevReport.citizens.filter((_, i) => i !== index),
    }));
  };

  const addCitizen = (civ: Citizen) => {
    setReport((prevReport) => ({
      ...prevReport,
      citizens: prevReport.officers ? [...prevReport.citizens, civ] : [civ],
    }));
  };

  const removeEvidence = (index: number) => {
    setReport((prevReport) => ({
      ...prevReport,
      evidence: prevReport.evidence.filter((_, i) => i !== index),
    }));
  };

  const addEvidence = (evidence: EvidenceModalData) => {
    setReport((prev) => ({
      ...prev,
      evidence: prev.evidence ? [...prev.evidence, evidence] : [evidence],
    }));
  };

  const addTag = (data: string) => {
    setReport((prev) => ({
      ...prev,
      tags: prev.tags ? [...prev.tags, data] : [data],
    }));
  };

  const removeTag = (i: number) => {
    const updatedItems = [
      ...report.tags.slice(0, i),
      ...report.tags.slice(i + 1),
    ];
    setReport((prev) => ({
      ...prev,
      tags: updatedItems,
    }));
  };

  const addRef = (data: References) => {
    setRefs((prev) => [...prev, data]);
  };

  const removeRef = (i: number) => {
    setRefs((prev) => {
      const newArray = [...prev];
      newArray.splice(i, 1);
      return newArray;
    });
  };

  return (
    <>
      <ReferencesModal onClick={addRef} report={report} />
      <TagsModal onClick={addTag} />
      <Modal
        title={dialogType === "officers" ? "Officers Involved" : "Evidence"}
        close
        logo
        data={
          dialogType === "officers"
            ? officers
            : dialogType === "citizens"
            ? citizens
            : evidence
        }
        type={dialogType}
        report={report}
        onClick={
          dialogType === "officers"
            ? addOfficer
            : dialogType === "citizens"
            ? addCitizen
            : addEvidence
        }
        onSubmit={createEvidence}
      />
      <div className="h-full gap-3 grid grid-cols-3 overflow-visible">
        <div className="col-span-2 flex flex-col gap-3">
          <header className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
            <div>
              <h3>
                Report #{report.reportid} -{" "}
                <span className="capitalize">{report.category}</span>
              </h3>
              <h5 className="text-xs text-white/40 font-normal">
                Created by {report.author} - {formatDateAgo(report.time)}
              </h5>
            </div>
            <IconButton
              variant="solid"
              icon={faFloppyDisk}
              onClick={saveReport}
            />
          </header>

          <div className="h-full flex flex-col gap-2 bg-zinc-500/20">
            <div className="bg-zinc-500/40 grid grid-cols-6 items-center pl-2 text-sm font-bold">
              <h3 className="col-span-5">{report.title}</h3>
              <p className="bg-zinc-500/40 h-full col-span-1 py-2 pl-2 capitalize">
                {report.category}
              </p>
            </div>
            <div className="flex h-full p-2">
              <div className="w-1 h-full bg-ecrp-500 shadow-[0_0_8px_0_rgba(187,154,247,0.8)]" />
              <Editor value={editorTxt} setValue={setEditorTxt} />
            </div>
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-3 overflow-y-auto">
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
            {report.tags?.length > 0 && (
              <div className="bg-zinc-500/10 flex flex-wrap gap-2 p-2">
                {report.tags.map((t, i) => (
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
            {report.evidence?.length > 0 && (
              <div className="bg-zinc-500/10 flex flex-wrap gap-2 p-2">
                {report.evidence.map((evidence, i) => (
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
            {report.officers?.length > 0 && (
              <div className="bg-zinc-500/10 flex flex-wrap gap-2 p-2">
                {report.officers.map((officer, i) => (
                  <Tag key={i} onClick={() => removeOfficer(i)}>
                    #{officer.callsign} {officer.firstname} {officer.lastname}
                  </Tag>
                ))}
              </div>
            )}
          </section>

          {/* Citizens Involved */}
          <section>
            <div className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
              <h3>Citizens Involved</h3>
              <IconButton
                icon={faPlus}
                variant="solid"
                onClick={() => {
                  setOpen(true);
                  setDialogType("citizens");
                }}
              />
            </div>
            {report.citizens?.length > 0 && (
              <div className="bg-zinc-500/10 flex flex-wrap gap-2 p-2">
                {report.citizens.map((civ, i) => (
                  <Tag key={i} onClick={() => removeCitizen(i)}>
                    {civ.firstname} {civ.lastname}
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
            <div className={`bg-zinc-500/10 flex flex-wrap gap-2 p-2`}></div>
          </section>

          {/* References */}
          <section>
            <div className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
              <h3>References</h3>
              <IconButton icon={faPlus} variant="solid" onClick={() => {
                setIsOpen(Dialogs.References)
              }} />
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
            <div className={`bg-zinc-500/10 flex flex-wrap gap-2 p-2`}></div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Report;
