import {
  faFileLines,
  faFloppyDisk,
  faPlus,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import tags from "../data/tags.json";
import IconButton from "../components/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { fetchNui } from "../utils/fetchNui";
import { isEnvBrowser } from "../utils/misc";
import { ProfileI } from "../utils/contstants";
import { useToast } from "../../components/ui/use-toast";
import Editor from "../components/Editor";
import Tag from "../components/Tag";
import { AppContext, Dialogs } from "../context/AppContext";
import { TagsModal } from "../components/Modals";

type Props = {
  citizenid: string;
  name?: string;
  pfp?: string;
  newProfile?: boolean;
};

interface ProfileData {
  licenses: object;
  player: object;
  properties: object[];
  vehicles: object[];
}

function Profile({ citizenid, name, pfp, newProfile }: Props) {
  const { toast } = useToast();
  const { setIsOpen } = useContext(AppContext);
  const [editorTxt, setEditorTxt] = useState<string>("");
  const [vehicles, setVehicles] = useState<{ plate: string }[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [properties, setProperties] = useState<{ house: string }[]>([]);
  const [licenses, setLicenses] = useState<{
    business: boolean;
    driver: boolean;
    weapon: boolean;
  }>({
    business: false,
    driver: false,
    weapon: false,
  });
  const [profile, setProfile] = useState<ProfileI>({
    citizenid: "",
    name: "",
    pfp: "",
    dna: "",
    points: "0",
    text: "",
    tags: [],
    history: [],
  });

  useEffect(() => {
    if (!isEnvBrowser()) {
      fetchNui<ProfileData>("GetProfile", citizenid).then((data) => {
        const profile = data.player as ProfileI;

        setProfile(profile);
        setEditorTxt(profile.text);
        setLicenses(
          data.licenses as {
            business: boolean;
            driver: boolean;
            weapon: boolean;
          }
        );
        setVehicles(data.vehicles as { plate: string }[]);
        setProperties(data.properties as { house: string }[]);

        const chargeNames: string[] = profile.history.reduce((acc: string[], curr) => {
          // Extract charge titles from each charges array and add them to the accumulator
          curr.charges.forEach((charge) => {
            acc.push(charge.title);
          });
          return acc;
        }, []);

        setHistory(chargeNames);
      });
    } else {
      setProfile({
        citizenid,
        name: name ? name : "Test",
        pfp: pfp ? pfp : "https://kappa.lol/D0jxn",
        dna: "",
        points: "0",
        text: "",
        tags: [],
        history: [],
      });
    }
  }, [citizenid, name, pfp, newProfile]);

  useEffect(() => {
    setProfile((prev) => ({ ...prev, text: editorTxt }));
  }, [editorTxt]);

  const removeTag = (i: number) => {
    const updatedItems = [
      ...profile.tags.slice(0, i),
      ...profile.tags.slice(i + 1),
    ];
    setProfile((prev) => ({
      ...prev,
      tags: updatedItems,
    }));
  };

  const addTag = (data: string) => {
    setProfile((prev) => ({
      ...prev,
      tags: prev.tags ? [...prev.tags, data] : [data],
    }));
  };

  const SaveProfile = () => {
    if (!isEnvBrowser()) {
      const profileStringified = {
        ...profile,
        tags: JSON.stringify(profile.tags),
      };
      fetchNui("SaveProfile", profileStringified).then((data) => {
        if (data === true) {
          toast({
            title: "Saved Profile!",
            variant: "success",
            duration: 1000,
          });
        }
      });
    } else {
      toast({
        title: "Saved Profile!",
        variant: "success",
        duration: 1000,
      });
    }
  };

  const RevokeLicense = (license: string) => {
    setLicenses((prevState) => ({
      ...prevState,
      [license]: false,
    }));
  };

  const SaveLicenses = () => {
    fetchNui("RevokeLicense", {
      citizenid: profile.citizenid,
      licenses: licenses,
    });
    toast({
      title: "Saved!",
      variant: "success",
      duration: 1000,
    });
  };

  return (
    <>
      <TagsModal onClick={addTag} />
      <div className="h-full gap-3 grid grid-cols-3 overflow-visible">
        <div className="col-span-2 flex flex-col gap-3">
          <header className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
            <h3>
              {profile.name} (#{citizenid})
            </h3>
            <IconButton
              variant="solid"
              icon={faFloppyDisk}
              onClick={SaveProfile}
            />
          </header>

          <div className="h-full flex flex-col gap-2 bg-zinc-500/20 p-2">
            <div className="h-52 flex gap-5">
              <div className="h-[208px] w-[208px] aspect-square bg-zinc-500/40">
                <img
                  src={profile.pfp}
                  alt="mugshot"
                  className="w-full h-full"
                />
              </div>
              <div className="flex flex-col w-full justify-between">
                <div className="flex justify-between items-center">
                  <label htmlFor="id" className="text-sm">
                    State ID
                  </label>
                  <input
                    id="id"
                    value={profile.citizenid}
                    disabled
                    className="w-3/5 col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 border-none outline-none disabled:bg-zinc-500/20 disabled:text-white/50"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label htmlFor="name" className="text-sm">
                    Name
                  </label>
                  <input
                    id="name"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-3/5 col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 border-none outline-none"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label htmlFor="name" className="text-sm">
                    Profile Image URL
                  </label>
                  <input
                    id="name"
                    value={profile.pfp}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, pfp: e.target.value }))
                    }
                    className="w-3/5 col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 border-none outline-none"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label htmlFor="name" className="text-sm">
                    DNA
                  </label>
                  <input
                    id="name"
                    value={profile.dna}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, dna: e.target.value }))
                    }
                    placeholder="xxxx-xxxx-xxxx"
                    className="w-3/5 col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 border-none outline-none"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label htmlFor="name" className="text-sm">
                    License Points
                  </label>
                  <input
                    id="name"
                    disabled
                    value={profile.points}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        points: e.target.value,
                      }))
                    }
                    className="w-3/5 col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 border-none outline-none disabled:bg-zinc-500/20 disabled:text-white/50"
                  />
                </div>
              </div>
            </div>
            <div className="flex h-full">
              <div className="w-1 h-full bg-ecrp-500 shadow-[0_0_8px_0_rgba(187,154,247,0.8)]" />
              <Editor value={editorTxt} setValue={setEditorTxt} />
            </div>
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-3 overflow-y-auto">
          {/* Tags */}
          <section>
            <div className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
              <h3>Tags</h3>
              <IconButton
                icon={faPlus}
                variant="solid"
                onClick={() => {
                  setIsOpen(Dialogs.Tags);
                }}
              />
            </div>
            {profile.tags?.length > 0 && (
              <div className="bg-zinc-500/10 flex flex-wrap gap-2 p-2">
                {profile.tags.map((t, i) => (
                  <Tag
                    key={i}
                    onClick={() => removeTag(i)}
                    background={
                      tags.find((tag) => tag.value === t)?.background
                    }>
                    {tags.find((tag) => tag.value === t)?.name}
                  </Tag>
                ))}
              </div>
            )}
          </section>

          {/* Vehicles */}
          <section>
            <div className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
              <h3>Vehicles</h3>
            </div>
            {vehicles.length > 0 && (
              <div className="bg-zinc-500/10 flex flex-wrap gap-2 p-2">
                {vehicles.map((veh) => (
                  <Tag>#{veh.plate}</Tag>
                ))}
              </div>
            )}
          </section>

          {/* Properties */}
          <section>
            <div className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
              <h3>Properties</h3>
            </div>
            {properties.length > 0 && (
              <div className="bg-zinc-500/10 flex flex-wrap gap-2 p-2">
                {properties.map((prop) => (
                  <p className="text-xs tracking-tighter bg-ecrp-500 p-1 h-6">
                    {prop.house}
                  </p>
                ))}
              </div>
            )}
          </section>

          {/* Criminal History */}
          <section>
            <div className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
              <h3>Criminal History</h3>
            </div>
            {history.length > 0 && (
              <div className="bg-zinc-500/10 flex flex-wrap gap-2 p-2">
                {[...new Set(history)].map((chargeName, index) => (
                  <Tag key={index}>
                    {((name) => {
                      const count = history.filter(
                        (item) => item === name
                      ).length;
                      return count > 1 ? `${name} x${count}` : name;
                    })(chargeName)}
                  </Tag>
                ))}
              </div>
            )}
          </section>

          {/* Licenses */}
          <section>
            <div className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
              <h3>Licenses</h3>
              <IconButton
                icon={faFileLines}
                variant="solid"
                onClick={SaveLicenses}
              />
            </div>
            <div
              className={`bg-zinc-500/10 flex flex-wrap gap-2 p-2 ${
                Object.values(licenses).some((val) => val) ? "" : "hidden"
              }`}>
              {Object.keys(licenses).map(
                (license: string, i: number) =>
                  licenses[license as keyof typeof licenses] && (
                    <Tag
                      key={i}
                      onClick={() => RevokeLicense(license)}
                      className="capitalize">
                      {license} License
                    </Tag>
                  )
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Profile;
