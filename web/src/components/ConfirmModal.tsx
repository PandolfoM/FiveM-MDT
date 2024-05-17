import { Dispatch, SetStateAction } from "react";
import ecrpLogo from "../assets/ecrp.svg";
import IconButton from "./IconButton";
import { faX } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

type Props = {
  close?: boolean;
  logo?: boolean;
  text: string;
  onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>
};

function ConfirmModal({ close, logo, text, onClick, open, setOpen }: Props) {
  return (
    <dialog
      open={open}
      className={`fixed left-0 top-0 z-50 w-full h-full transition-all bg-transparent text-white`}>
      <div className="fixed flex flex-col gap-3 w-96 h-auto bg-ecrp-900 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-3 rounded-md max-h-[50rem] shadow-[0_0_15rem_0_rgba(187,154,247,0.8)]">
        <header className="flex items-center gap-5 relative h-14">
          {logo && <img src={ecrpLogo} width={30} />}
          <p className="whitespace-nowrap font-bold">Confirm?</p>
          {close && (
            <IconButton
              icon={faX}
              variant="close"
              onClick={() => setOpen(false)}
            />
          )}
        </header>
        <div className="py-2">
          <p className="text-center">
            Are you sure you would like to delete<br/>
            <span className="text-ecrp-500 font-bold">{text}</span>?
          </p>
        </div>
        <div className="flex justify-between items-center gap-3">
          <Button
            text="Cancel"
            variant="outline"
            className="text-center p-0 rounded-none"
            onClick={() => setOpen(false)}
          />
          <Button
            text="Confirm"
            variant="solid"
            className="text-center py-1 px-2"
            onClick={() => {
              setOpen(false);
              onClick();
            }}
          />
        </div>
      </div>
    </dialog>
  );
}

export default ConfirmModal;
