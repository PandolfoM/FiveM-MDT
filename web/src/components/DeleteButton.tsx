import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmModal from "./ConfirmModal";
import { useState } from "react";

type Props = {
  onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  text?: string;
};

function DeleteButton({ onClick, text }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <ConfirmModal
        onClick={onClick}
        text={text ? text : ""}
        open={isOpen}
        setOpen={setIsOpen}
        close
        logo
      />
      <button
        className="w-6 h-6 text-left text-sm text-white flex items-center justify-center bg-red-600/40"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}>
        <FontAwesomeIcon icon={faTrash} size="sm" className="text-red-300" />
      </button>
    </>
  );
}

export default DeleteButton;
