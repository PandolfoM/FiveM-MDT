import ecrpLogo from "../../assets/ecrp.svg";
import fines from "../../data/fines.json";
import {
  faBusinessTime,
  faClock,
  faIdCard,
  faSackDollar,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction, useState } from "react";
import IconButton from "../IconButton";
import Search from "../Search";
import Tag from "../Tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Hint from "../Hint";
import { Charge, Charges } from "../../utils/contstants";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onClick: (charge: Charge) => void;
  removeClick: (i: number) => void;
  charges: Charges[];
  setCharges: Dispatch<SetStateAction<Charges[]>>;
  cid: number;
};

function ChargesModal({
  open,
  setOpen,
  onClick,
  removeClick,
  charges,
  cid,
}: Props) {
  const [search, setSearch] = useState<string>("");

  return (
    <dialog
      open={open}
      className={`fixed left-0 top-0 z-50 w-full h-full transition-all bg-transparent text-white`}>
      <div className="fixed flex flex-col gap-3 w-3/5 h-auto bg-ecrp-900 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-3 rounded-md max-h-[50rem] shadow-[0_0_15rem_0_rgba(187,154,247,0.8)]">
        <header className="flex items-center gap-5 relative h-14">
          <img src={ecrpLogo} width={30} />
          <p className="whitespace-nowrap font-bold">Charges</p>
          <IconButton
            icon={faX}
            variant="close"
            onClick={() => setOpen(false)}
          />
        </header>
        <div className="h-max flex flex-col gap-1">
          <Search setValue={setSearch} value={search} />
          <div className="flex flex-wrap gap-1 items-center max-h-[5rem] overflow-y-auto custom-scrollbar">
            {charges
              .find((playerCharge) => playerCharge.citizenid === cid)
              ?.charges.map((charge, i) => (
                <Tag key={i} onClick={() => removeClick(i)}>
                  {charge.title}
                </Tag>
              ))}
          </div>
        </div>
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
                      onClick={() => onClick(charge)}
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
    </dialog>
  );
}

export default ChargesModal;
