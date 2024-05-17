import { faChevronDown, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

export type OptionProps = {
  value: string;
  label: string;
};

type SelectProps = {
  placeholder: string;
  options: OptionProps[];
  isMulti?: boolean;
  isSearchable?: boolean;
  onChange: (selectedOption: OptionProps | OptionProps[]) => void;
};

const Select = ({
  placeholder,
  options,
  isMulti,
  isSearchable,
  onChange,
}: SelectProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedValue, setSelectedValue] = useState<
    OptionProps | OptionProps[] | null
  >(isMulti ? [] : null);
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchValue("");
    if (showMenu && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showMenu]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  });

  const handleInputClick = () => {
    setShowMenu(!showMenu);
  };

  const getDisplay = () => {
    if (
      !selectedValue ||
      (Array.isArray(selectedValue) && selectedValue.length === 0)
    ) {
      return placeholder;
    }
    if (isMulti) {
      return (
        <div className="h-full flex gap-1">
          {(selectedValue as OptionProps[]).map((option, index) => (
            <div
              key={`${option.value}-${index}`}
              className="flex items-center h-6 bg-ecrp-500">
              <p className="tracking-tighter px-1">{option.label}</p>
              <div
                onClick={(e) => onTagRemove(e, option)}
                className="bg-zinc-500 w-5 flex items-center justify-center h-full py-1">
                <FontAwesomeIcon icon={faX} size="xs" />
              </div>
            </div>
          ))}
        </div>
      );
    }
    return (selectedValue as OptionProps).label;
  };

  const removeOption = (option: OptionProps) => {
    return (selectedValue as OptionProps[]).filter(
      (o) => o.value !== option.value
    );
  };

  const onTagRemove = (e: React.MouseEvent, option: OptionProps) => {
    e.stopPropagation();
    const newValue = removeOption(option);
    setSelectedValue(newValue);
    onChange(newValue);
  };

  const onItemClick = (option: OptionProps) => {
    let newValue;
    if (isMulti) {
      if (
        (selectedValue as OptionProps[]).findIndex(
          (o) => o.value === option.value
        ) >= 0
      ) {
        newValue = removeOption(option);
      } else {
        newValue = [...(selectedValue as OptionProps[]), option];
      }
    } else {
      newValue = option;
    }
    setSelectedValue(newValue);
    onChange(newValue);
  };

  const isSelected = (option: OptionProps) => {
    if (isMulti) {
      return (
        (selectedValue as OptionProps[]).filter((o) => o.value === option.value)
          .length > 0
      );
    }

    if (!selectedValue) {
      return false;
    }

    return (selectedValue as OptionProps).value === option.value;
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const getOptions = () => {
    if (!searchValue) {
      return options;
    }

    return options.filter(
      (option) =>
        option.label.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
    );
  };

  return (
    <div className="bg-zinc-500/40 text-white px-2 py-1 text-sm leading-6 w-full border-none outline-none relative">
      <div
        ref={inputRef}
        onClick={handleInputClick}
        className="flex items-center justify-between gap-2 select-none leading-6">
        <div
          className={`bg-transparent w-full pointer-events-none ${
            !selectedValue ||
            (Array.isArray(selectedValue) && selectedValue.length === 0)
              ? "text-white/40"
              : "text-white"
          }`}>
          {getDisplay()}
        </div>
        <FontAwesomeIcon
          icon={faChevronDown}
          size="xs"
          className={`transition-all text-white ${
            showMenu ? "rotate-180" : ""
          }`}
        />
      </div>

      {showMenu && (
        <div className="absolute bg-ecrp-700 left-0 top-8 w-full">
          {isSearchable && (
            <input
              placeholder="Search..."
              className="w-full p-1 border-none outline-none ring-0 bg-ecrp-900 placeholder:text-white/40"
              onChange={onSearch}
              value={searchValue}
              ref={searchRef}
            />
          )}
          {getOptions().map((option) => (
            <div
              onClick={() => onItemClick(option)}
              key={option.value}
              className={`cursor-pointer p-1 hover:bg-ecrp-500 ${
                isSelected(option) ? "bg-ecrp-500" : ""
              }`}>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
