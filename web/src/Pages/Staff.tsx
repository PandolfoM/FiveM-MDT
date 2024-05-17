import { useContext, useEffect, useState } from "react";
import Search from "../components/Search";
import { AppContext, Dialogs } from "../context/AppContext";
import StaffInfo from "./StaffInfo";
import Button from "../components/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { NewStaffModal } from "../components/Modals";
import { fetchNui } from "../utils/fetchNui";
import { isEnvBrowser } from "../utils/misc";

interface Member {
  name: string;
  citizenid: string;
  pfp: string;
}

function Staff() {
  const { tabs, activeTab, setTabs, setIsOpen } = useContext(AppContext);
  const [search, setSearch] = useState<string>("");
  const [staff, setStaff] = useState<Member[]>([]);

  useEffect(() => {
    if (!isEnvBrowser()) {
      fetchNui<Member[]>("GetStaffMembers").then((data) => {
        setStaff(data);
      });
    }
  }, []);

  const SelectProfile = (citizenid: string) => {
    const newTabs = [...tabs];
    newTabs[activeTab] = {
      title: "Staff",
      content: <StaffInfo citizenid={citizenid} />,
    };
    setTabs(newTabs);
  };

  const Content = ({ member }: { member: Member }) => {
    return (
      <div
        className="flex gap-1 bg-zinc-500/20 p-1 cursor-pointer"
        onClick={() => SelectProfile(member.citizenid)}>
        <div className="bg-zinc-500/20 aspect-square h-12 flex items-center justify-center text-white/50">
          <img
            src={member.pfp}
            className="object-cover w-full h-full aspect-square"
          />
        </div>
        <div className="flex flex-col justify-between gap-[2px]">
          <p className="text-sm font-bold leading-3">{member.name}</p>
          <p className=" bg-ecrp-500 w-fit text-xs px-1 leading-4">
            ID: {member.citizenid}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <NewStaffModal />
      <div className="overflow-hidden h-full flex flex-col gap-3">
        <header className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
          <h3>Profiles</h3>
          <div className="flex gap-1 max-h-50% whitespace-nowrap">
            <Button
              variant="solid"
              text="Create Profile"
              icon={faPlus}
              onClick={() => {
                setIsOpen(Dialogs.Staff);
              }}
              className="w-max"
            />
            <Search value={search} setValue={setSearch} />
          </div>
        </header>
        <div className="h-full overflow-y-auto flex flex-col gap-1 custom-scrollbar">
          {staff.map((m, i) => (
            <Content key={i} member={m} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Staff;
