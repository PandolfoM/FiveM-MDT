import ecrpLogo from "../../assets/ecrp.svg";
import { faX } from "@fortawesome/free-solid-svg-icons";
import IconButton from "../IconButton";
import { AppContext, Dialogs } from "../../context/AppContext";
import { ReactElement, useContext } from "react";

type Props = {
  open: Dialogs;
  title: string;
  children: ReactElement;
};

function BaseModal({ open, title, children }: Props) {
  const { isOpen, setIsOpen } = useContext(AppContext);
  return (
    <dialog
      open={isOpen === open}
      className="fixed left-0 top-0 z-50 w-full h-full transition-all bg-transparent text-white">
      <div className="fixed flex flex-col gap-3 w-96 h-auto bg-ecrp-900 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-3 rounded-md max-h-[50rem] shadow-[0_0_15rem_0_rgba(187,154,247,0.8)]">
        <header className="flex items-center gap-5 relative h-14">
          <img src={ecrpLogo} width={30} />
          <p className="whitespace-nowrap font-bold">{title}</p>
          <IconButton
            icon={faX}
            variant="close"
            onClick={() => setIsOpen(Dialogs.Closed)}
          />
        </header>
        {children}
      </div>
    </dialog>
  );
}

export default BaseModal;
