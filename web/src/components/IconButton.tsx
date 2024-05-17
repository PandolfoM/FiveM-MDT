import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  variant: "solid" | "outline" | "close" | "disabled";
  icon: IconDefinition;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
};

function IconButton({ variant, icon, onClick, className }: Props) {
  const outlineClass =
    "hover:text-ecrp-500 hover:outline-ecrp-500 transition-all outline-2 outline outline-offset-4 outline-transparent rounded-sm";

  return (
    <button
      className={`w-6 h-6 text-left text-sm text-white flex items-center justify-center ${
        variant === "outline"
          ? outlineClass
          : variant === "solid"
          ? "bg-ecrp-500/40 px-2" 
          : variant === "close"
          ? "bg-red-800/40 px-2 absolute top-0 right-0" 
          : "bg-zinc-500/50 px-2"
      } ${className}`}
      onClick={onClick}>
      <FontAwesomeIcon icon={icon} size="sm" className={`${variant === "solid" && "text-ecrp-500"} ${variant === "close" && "text-red-200"}`} />
    </button>
  );
}

export default IconButton;
