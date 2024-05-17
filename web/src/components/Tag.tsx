import React from "react";
import IconButton from "./IconButton";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { getContrastColor } from "../utils/functions";

type Props = {
  children: React.ReactNode | string;
  onClick?: () => void;
  addClick?: () => void;
  background?: string;
  className?: string;
};

function Tag({ children, onClick, addClick, background, className }: Props) {
  let textColor = "#fff"
  if (background) {
    textColor = getContrastColor(background && background)
  } 

  return (
    <div className={`flex cursor-default h-full ${className}`} onClick={addClick}>
      <p className={`h-6 text-sm tracking-tight bg-ecrp-500/80 p-1`} style={{backgroundColor: background, color: textColor}}>
        {children}
      </p>
      {onClick && (
        <IconButton icon={faX} variant="disabled" onClick={onClick} />
      )}
    </div>
  );
}

export default Tag;
