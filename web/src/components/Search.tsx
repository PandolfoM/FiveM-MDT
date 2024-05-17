import {
  IconDefinition,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction } from "react";

type Props = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  onClick?: () => void;
  addIcon?: IconDefinition;
  className?: string;
};

function Search({ value, setValue, onClick, addIcon, className }: Props) {
  return (
    <div className={`text-right flex justify-between items-center w-48 overflow-hidden gap-2 h-full ${className}`}>
      <div className="relative flex items-center">
        <input
          placeholder="Search..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="bg-zinc-500/40 text-white py-1 pl-2 pr-6 text-sm placeholder:text-white/40 leading-6 w-full border-none outline-none"
        />
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="text-white/80 text-sm absolute right-0 top-1/2 transform -translate-y-1/2 pr-1"
        />
      </div>
      {addIcon && (
        <FontAwesomeIcon
          onClick={onClick}
          icon={addIcon}
          className="text-white cursor-pointer"
        />
      )}
    </div>
  );
}

export default Search;
