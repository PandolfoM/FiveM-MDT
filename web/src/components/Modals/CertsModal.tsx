import certs from "../../data/certs.json";
import { Dialogs } from "../../context/AppContext";
import BaseModal from "./BaseModal";
import Search from "../Search";
import { useState } from "react";
import IconButton from "../IconButton";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

type Props = {
  onClick: (value: string) => void;
};

function CertsModal({ onClick }: Props) {
  const [search, setSearch] = useState<string>("");

  const filteredCerts = certs.filter((cert) =>
    cert.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <BaseModal open={Dialogs.Certs} title="Certs">
      <>
        <div className="grid grid-cols-5 items-center gap-4">
          <label className="col-span-2 text-sm">Certs</label>
          <Search
            setValue={setSearch}
            value={search}
            className="col-span-3 w-full"
          />
        </div>
        <div className="max-h-80 flex flex-col gap-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {filteredCerts.map((cert, i) => (
            <div
              key={i}
              className={`flex justify-between items-center bg-zinc-500/10 p-2`}>
              <div className="flex items-center gap-3">
                <p>{cert.name}</p>
              </div>
              <IconButton
                icon={faPlus}
                variant="solid"
                onClick={() => {
                  onClick(cert.value);
                }}
              />
            </div>
          ))}
        </div>
      </>
    </BaseModal>
  );
}

export default CertsModal;
