import { faPlus } from "@fortawesome/free-solid-svg-icons";
import IconButton from "../IconButton";
import Search from "../Search";
import BaseModal from "./BaseModal";
import { Criminal, IncidentData } from "../../Pages/Incidents";
import { useContext, useEffect, useState } from "react";
import { AppContext, Dialogs } from "../../context/AppContext";
import { isEnvBrowser } from "../../utils/misc";
import { fetchNui } from "../../utils/fetchNui";
import { Report } from "../../Pages/Report";

type Props = {
  onClick: (crim: Criminal) => void;
  incident?: IncidentData;
  report?: Report;
};

function CriminalsModal({ onClick, incident, report }: Props) {
  const { isOpen } = useContext(AppContext);
  const [search, setSearch] = useState<string>("");
  const [criminals, setCriminals] = useState<Criminal[]>([]);

  useEffect(() => {
    if (isOpen === Dialogs.Criminals && !isEnvBrowser()) {
      fetchNui<Criminal[]>("GetCriminals").then((data) => {
        setCriminals(data);
      });
    } else {
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isEnvBrowser()) {
      setTimeout(() => {
        fetchNui<Criminal[]>("SearchCriminals", `%${search}%`).then((data) => {
          setCriminals(data);
        });
      }, 500);
    }
  }, [search]);

  return (
    <BaseModal open={Dialogs.Criminals} title="Criminal Scum">
      <>
        <div className="grid grid-cols-5 items-center gap-4">
          <label htmlFor="title" className="col-span-2 text-sm">
            Assign Criminals
          </label>
          <Search
            setValue={setSearch}
            value={search}
            className="col-span-3 w-full"
          />
        </div>
        <div className="max-h-80 flex-col flex gap-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <>
            {criminals.map((crim, i) => (
              <div key={i}>
                {incident && (
                  <>
                    {incident.criminals.some(
                      (o) => o.citizenid === crim.citizenid
                    ) ? null : (
                      <div
                        className={`flex justify-between items-center bg-zinc-500/10 p-2 mt-3`}>
                        <div className="flex items-center gap-3">
                          <img
                            src={crim.pfp}
                            alt="pfp"
                            className="aspect-square w-11"
                          />
                          <p>{crim.name}</p>
                        </div>
                        <IconButton
                          icon={faPlus}
                          variant="solid"
                          onClick={() => {
                            onClick(crim);
                          }}
                        />
                      </div>
                    )}
                  </>
                )}

                {report && (
                  <>
                    {report.citizens.some(
                      (o) => o.citizenid === crim.citizenid
                    ) ? null : (
                      <div
                        className={`flex justify-between items-center bg-zinc-500/10 p-2 mt-3`}>
                        <div className="flex items-center gap-3">
                          <img
                            src={crim.pfp}
                            alt="pfp"
                            className="aspect-square w-11"
                          />
                          <p>{crim.name}</p>
                        </div>
                        <IconButton
                          icon={faPlus}
                          variant="solid"
                          onClick={() => {
                            onClick(crim);
                          }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </>
        </div>
      </>
    </BaseModal>
  );
}

export default CriminalsModal;
