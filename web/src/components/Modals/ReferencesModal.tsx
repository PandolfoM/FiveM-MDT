import { AppContext, Dialogs } from "../../context/AppContext";
import { useContext, useEffect, useState } from "react";
import IconButton from "../IconButton";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Search from "../Search";
import { fetchNui } from "../../utils/fetchNui";
import { References } from "../../utils/contstants";
import BaseModal from "./BaseModal";
import { isEnvBrowser } from "../../utils/misc";
import { IncidentData } from "../../Pages/Incidents";
import { Report } from "../../Pages/Report";

type Props = {
  onClick: (ref: References) => void;
  incident?: IncidentData;
  report?: Report;
};

function ReferencesModal({ onClick, incident, report }: Props) {
  const { isOpen } = useContext(AppContext);
  const [search, setSearch] = useState<string>("");
  const [refs, setRefs] = useState<References[]>([]);

  useEffect(() => {
    if (isOpen === Dialogs.References && !isEnvBrowser()) {
      fetchNui<References[]>("GetReferences").then((data) => {
        setRefs(data);
      });
    } else {
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isEnvBrowser()) {
      setTimeout(() => {
        fetchNui<References[]>("SearchReferences", `%${search}%`).then(
          (data) => {
            setRefs(data);
          }
        );
      }, 500);
    }
  }, [search]);

  const filteredRefs = refs.filter(
    (ref) =>
      ref.title.toLowerCase().includes(search.toLowerCase()) ||
      (ref.incidentid && ref.incidentid.toString().includes(search)) ||
      (ref.reportid && ref.reportid.toString().includes(search))
  );

  return (
    <BaseModal open={Dialogs.References} title="References">
      <>
        <div className="grid grid-cols-5 items-center gap-4">
          <label className="col-span-2 text-sm">References</label>
          <Search
            setValue={setSearch}
            value={search}
            className="col-span-3 w-full"
          />
        </div>
        <div className="max-h-80 flex flex-col gap-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {filteredRefs.map((ref, i) => (
            <>
              {incident && (
                <>
                  {incident?.references.some((t) =>
                    t.incidentid
                      ? t.incidentid
                      : t.reportid === ref.incidentid
                      ? ref.incidentid
                      : ref.reportid
                  ) ? null : (
                    <div
                      key={i}
                      className={`flex justify-between items-center bg-zinc-500/10 p-2 mt-3`}>
                      <div className="flex items-center gap-3">
                        <p>
                          {ref.title} ({ref.incidentid ? "Incident" : "Report"}{" "}
                          #{ref.incidentid ? ref.incidentid : ref.reportid})
                        </p>
                      </div>
                      <IconButton
                        icon={faPlus}
                        variant="solid"
                        onClick={() => {
                          onClick(ref);
                        }}
                      />
                    </div>
                  )}
                </>
              )}

              {report && (
                <>
                  {report?.references.some((t) =>
                    t.incidentid
                      ? t.incidentid
                      : t.reportid === ref.incidentid
                      ? ref.incidentid
                      : ref.reportid
                  ) ? null : (
                    <div
                      key={i}
                      className={`flex justify-between items-center bg-zinc-500/10 p-2 mt-3`}>
                      <div className="flex items-center gap-3">
                        <p>
                          {ref.title} ({ref.incidentid ? "Incident" : "Report"}{" "}
                          #{ref.incidentid ? ref.incidentid : ref.reportid})
                        </p>
                      </div>
                      <IconButton
                        icon={faPlus}
                        variant="solid"
                        onClick={() => {
                          onClick(ref);
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          ))}
        </div>
      </>
    </BaseModal>
  );
}

export default ReferencesModal;
