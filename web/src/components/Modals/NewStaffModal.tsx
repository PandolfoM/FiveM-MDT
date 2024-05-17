import { useContext, useState } from "react";
import { AppContext, Dialogs } from "../../context/AppContext";
import BaseModal from "./BaseModal";
import Button from "../Button";
import { fetchNui } from "../../utils/fetchNui";
import { toast } from "../../../components/ui/use-toast";
import StaffInfo from "../../Pages/StaffInfo";
import { isEnvBrowser } from "../../utils/misc";

function NewStaffModal() {
  const { tabs, setTabs, activeTab, setIsOpen } = useContext(AppContext);
  const [citizenid, setCitizenid] = useState<string>("");

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (!isEnvBrowser()) {
      fetchNui<boolean | string>("CreateStaff", citizenid).then((data) => {
        if (data === false) {
          toast({
            title: "No Profile Found!",
            variant: "destructive",
            duration: 1000,
          });
        } else {
          setIsOpen(Dialogs.Closed);
          const newTabs = [...tabs];
          newTabs[activeTab] = {
            title: "Staff",
            content: <StaffInfo citizenid={data as string} />,
          };
          setTabs(newTabs);
        }
      });
    } else {
      setIsOpen(Dialogs.Closed);
      const newTabs = [...tabs];
      newTabs[activeTab] = {
        title: "Staff",
        content: <StaffInfo citizenid={citizenid} />,
      };
      setTabs(newTabs);
    }
  };

  return (
    <BaseModal open={Dialogs.Staff} title="New Staff">
      <form
        className="grid gap-4 text-white"
        action="submit"
        onSubmit={handleSubmit}>
        <div className="grid grid-cols-5 items-center gap-4">
          <label htmlFor="title" className="col-span-2 text-sm">
            Citizen ID
          </label>
          <input
            placeholder="Citizen ID"
            id="citizenid"
            type="text"
            name="citizenid"
            value={citizenid}
            onChange={(e) => setCitizenid(e.target.value)}
            className="col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 w-full border-none outline-none"
          />
        </div>
        <Button
          text="Create"
          variant="solid"
          type="submit"
          disabled={!citizenid}
          className="text-center py-1"
        />
      </form>
    </BaseModal>
  );
}

export default NewStaffModal;
