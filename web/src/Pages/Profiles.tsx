import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Search from "../components/Search";
import { useContext, useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { AppContext } from "../context/AppContext";
import Profile from "./Profile";
import { fetchNui } from "../utils/fetchNui";
import { isEnvBrowser } from "../utils/misc";
import { ProfileI } from "../utils/contstants";

export interface ProfileModalData {
  cid: string;
  name: string;
  pfp: string;
}

function Profiles() {
  const { setTabs, activeTab, tabs, setOpen } = useContext(AppContext);
  const [profiles, setProfiles] = useState<ProfileI[]>([]);
  const [value, setValue] = useState<string>("");
  const idInput = useRef<HTMLInputElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const pfpInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchNui("GetProfiles").then((data) => {
      setProfiles(data as ProfileI[]);
    });
  }, []);

  const CreateProfile = (data: ProfileModalData) => {
    if (!isEnvBrowser()) {
      fetchNui("CreateProfile", {
        cid: data.cid.trim(),
        name: data.name.trim(),
        pfp: data.pfp.trim(),
      }).then((data) => {
        if (idInput.current?.value.trim()) {
          const newTabs = [...tabs];
          newTabs[activeTab] = {
            title: "Profiles",
            content: (
              <Profile
                citizenid={idInput.current?.value.trim()}
                name={nameInput.current?.value.trim()}
                pfp={pfpInput.current?.value.trim()}
              />
            ),
          };
          setTabs(newTabs);
        }
      });
    } else {
      const newTabs = [...tabs];
      newTabs[activeTab] = {
        title: "Profiles",
        content: (
          <Profile
            citizenid={data.cid.trim()}
            name={data.name.trim()}
            pfp={data.pfp.trim()}
          />
        ),
      };
      setTabs(newTabs);
    }
  };

  const SelectProfile = (citizenid: string) => {
    const newTabs = [...tabs];
    newTabs[activeTab] = {
      title: "Profiles",
      content: <Profile citizenid={citizenid} />,
    };
    setTabs(newTabs);
  };

  const Content = ({
    name,
    citizenid,
    pfp,
  }: {
    name: string;
    citizenid: string;
    pfp: string;
  }) => {
    return (
      <div
        className="flex gap-1 bg-zinc-500/20 p-1 cursor-pointer"
        onClick={() => SelectProfile(citizenid)}>
        <div className="bg-zinc-500/20 aspect-square h-12 flex items-center justify-center text-white/50">
          <img src={pfp} className="object-cover h-full aspect-square" />
        </div>
        <div className="flex flex-col justify-between gap-[2px]">
          <p className="text-sm font-bold leading-3">{name}</p>
          <p className=" bg-ecrp-500 w-fit text-xs px-1 leading-4">
            ID: {citizenid}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <Modal title="Create Citizen" close logo type="profile" onSubmit={CreateProfile} />
      <div className="overflow-hidden h-full flex flex-col gap-3">
        <header className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
          <h3>Profiles</h3>
          <div className="flex gap-1 max-h-50% whitespace-nowrap">
            <Button
              variant="solid"
              text="Create Profile"
              icon={faPlus}
              onClick={() => setOpen(true)}
              className="w-max"
            />
            <Search value={value} setValue={setValue} />
          </div>
        </header>

        <div className="h-full overflow-y-auto flex flex-col gap-1 custom-scrollbar">
          {profiles.map((profile, i) => (
            <Content
              key={i}
              citizenid={profile.citizenid}
              name={profile.name}
              pfp={profile.pfp}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Profiles;
