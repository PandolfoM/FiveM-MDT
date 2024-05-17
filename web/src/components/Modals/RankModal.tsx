import ranks from "../../data/ranks.json";
import { Dialogs } from "../../context/AppContext";
import BaseModal from "./BaseModal";
import Search from "../Search";
import { useState } from "react";
import IconButton from "../IconButton";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

type Props = {
  onClick: (value: string) => void;
};

function RankModal({ onClick }: Props) {
  const [search, setSearch] = useState<string>("");

  const filteredRanks = ranks.filter((rank) =>
    rank.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <BaseModal open={Dialogs.Rank} title="Certs">
      <>
        <div className="grid grid-cols-5 items-center gap-4">
          <label className="col-span-2 text-sm">Ranks</label>
          <Search
            setValue={setSearch}
            value={search}
            className="col-span-3 w-full"
          />
        </div>
        <div className="max-h-80 flex flex-col gap-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {filteredRanks.map((rank, i) => (
            <div
              key={i}
              className={`flex justify-between items-center bg-zinc-500/10 p-2`}>
              <div className="flex items-center gap-3">
                <p>{rank.name}</p>
              </div>
              <IconButton
                icon={faPlus}
                variant="solid"
                onClick={() => {
                  onClick(rank.value);
                }}
              />
            </div>
          ))}
        </div>
      </>
    </BaseModal>
  );
}

export default RankModal;
