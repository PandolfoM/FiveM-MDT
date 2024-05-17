import { useEffect, useState } from "react";
import { fetchNui } from "../utils/fetchNui";
import { useVisibility } from "../providers/VisibilityProvider";

type CurrentUser = {
  name: string;
  callsign: string;
  pfp: string;
};

function CurrentUser() {
  const { visible } = useVisibility();
  const [user, setUser] = useState<CurrentUser>({
    callsign: "309",
    name: "Test User",
    pfp: "https://kappa.lol/D0jxn",
  });

  useEffect(() => {
    if (visible) {
      fetchNui<CurrentUser>("GetCurrentUser").then((data) => {
        setUser(data);
      });
    }
  }, [visible]);

  return (
    <div className="bg-zinc-500/20 h-8 flex items-center w-full justify-between pr-1">
      <div className="flex items-center h-full">
        <img
          src={user.pfp}
          alt={user.name}
          className="object-cover w-8 h-full"
        />
        <p className="whitespace-nowrap text-sm px-2 overflow-hidden text-ellipsis">
          {user.name}
        </p>
      </div>
      <div className="bg-ecrp-500 flex items-center text-sm px-2">
        {user.callsign}
      </div>
    </div>
  );
}

export default CurrentUser;
