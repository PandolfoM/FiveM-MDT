import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  variant: "solid" | "outline" | "text" | "active";
  text: string;
  icon?: IconDefinition;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "submit" | "reset" | "button" | undefined;
};

function Button({
  variant,
  text,
  icon,
  onClick,
  className,
  disabled,
  type,
}: Props) {
  const outlineClass =
    "hover:text-ecrp-500 hover:outline-ecrp-500 transition-all outline-2 outline outline-offset-2 outline-transparent rounded-sm";

  const activeClass =
    "text-ecrp-500 outline-ecrp-500 outline outline-2 outline-offset-2 rounded-sm ";

  return (
    <button
      type={type}
      disabled={disabled}
      className={`w-full text-left text-sm leading-6 ${
        variant === "outline"
          ? outlineClass
          : variant === "active"
          ? activeClass
          : variant === "solid"
          ? "bg-ecrp-500/40 px-2 transition-[background] hover:bg-ecrp-500 disabled:bg-ecrp-500/40"
          : ""
      } ${className}`}
      onClick={onClick}>
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          className={`mr-2 ${variant === "solid" && "text-ecrp-500"}`}
        />
      )}
      {text}
    </button>
  );
}

export default Button;
