import fines from "../data/fines.json";
import Hint from "../components/Hint";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBusinessTime,
  faClock,
  faIdCard,
  faSackDollar,
} from "@fortawesome/free-solid-svg-icons";
import Search from "../components/Search";
import { useState } from "react";

function Charges() {
  const [search, setSearch] = useState<string>("");

  return (
    <div className="overflow-hidden h-full flex flex-col gap-3">
      <header className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
        <h3>Charges</h3>
        <div className="flex gap-1 max-h-50% whitespace-nowrap">
          <Search value={search} setValue={setSearch} />
        </div>
      </header>
      <div className="overflow-y-auto custom-scrollbar flex flex-col gap-3">
        {fines.map((fine, i) => {
          const filteredCharges = fine.charges.filter((charge) =>
            charge.title.toLowerCase().includes(search.toLowerCase())
          );

          if (filteredCharges.length > 0) {
            return (
              <div
                key={i}
                className="bg-ecrp-700 py-2 px-3 rounded-md flex flex-col gap-3">
                <h3 className="text-xl font-bold">{fine.category}</h3>
                {filteredCharges.map((charge, i) => (
                  <div
                    key={i}
                    className="bg-ecrp-900 rounded-md cursor-pointer grid grid-cols-12 gap-3 p-2 text-sm text-white/60">
                    <div className="col-span-1">
                      <p>
                        <Hint text="Time">
                          <FontAwesomeIcon
                            icon={faClock}
                            className="text-white"
                          />
                        </Hint>{" "}
                        {charge.time}
                      </p>
                      {charge.parole && (
                        <p>
                          <Hint text="Parole">
                            <FontAwesomeIcon
                              icon={faBusinessTime}
                              className="text-white"
                            />
                          </Hint>{" "}
                          {charge.parole}
                        </p>
                      )}
                      <p>
                        <Hint text="Fine">
                          <FontAwesomeIcon
                            icon={faSackDollar}
                            className="text-white"
                          />
                        </Hint>{" "}
                        {charge.fine}
                      </p>
                      <p>
                        <Hint text="Points">
                          <FontAwesomeIcon
                            icon={faIdCard}
                            className="text-white"
                          />
                        </Hint>{" "}
                        {charge.points}
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p className="text-white">{charge.title}</p>
                      <p>{charge.type}</p>
                    </div>
                    <div className="col-span-8">
                      <p className="text-white">{charge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
}

export default Charges;
