type Props = {
  label: string;
  checked: boolean;
  onChange: () => void;
};

function Slider({ label, checked, onChange }: Props) {
  const stringWithDashes = label.replace(/ /g, "-").toLowerCase();

  return (
    <div className="flex items-center justify-between w-full gap-3">
      <label
        htmlFor={`${stringWithDashes}-toggle`}
        className="flex items-center justify-between cursor-pointer w-full">
        <div className="text-white font-bold text-sm">{label}</div>
        <div className="relative">
          <input
            type="checkbox"
            id={`${stringWithDashes}-toggle`}
            className="sr-only peer"
            checked={checked}
            onChange={onChange}
          />
          <div className="relative w-16 h-7 bg-red-300/20 peer-focus:outline-none peer-focus:ring-0  rounded-sm peer peer-checked:after:translate-x-[180%] rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-1 after:left-1 after:bg-red-300/40  after:peer-checked:bg-green-300/40 after:rounded-sm after:h-5 after:w-5 after:transition-all peer-checked:bg-green-300/30"></div>
        </div>
      </label>
    </div>
  );
}

export default Slider;
