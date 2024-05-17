import certs from "../data/certs.json";
import departments from "../data/departments.json";
import ranks from "../data/ranks.json";
import { faFloppyDisk, faPlus } from "@fortawesome/free-solid-svg-icons";
import IconButton from "../components/IconButton";
import { isEnvBrowser } from "../utils/misc";
import { toast } from "../../components/ui/use-toast";
import { useContext, useEffect, useState } from "react";
import { fetchNui } from "../utils/fetchNui";
import { formatPhoneNumber } from "../utils/functions";
import { AppContext, Dialogs } from "../context/AppContext";
import Tag from "../components/Tag";
import { CertsModal, DepartmentsModal, RankModal } from "../components/Modals";

type Props = {
  citizenid: string;
};

interface Staff {
  citizenid: string;
  user_type?: string;
  alias?: string;
  pfp: string;
  phone: string;
  firstname: string;
  lastname: string;
  callsign: string;
  certs: string[];
  departments: string[];
  ranks: string[];
}

const initStaff: Staff = {
  alias: "",
  callsign: "309",
  citizenid: "1000",
  firstname: "Matt",
  lastname: "Walker",
  pfp: "https://kappa.lol/D0jxn",
  phone: "1234567890",
  user_type: "",
  certs: [],
  departments: [],
  ranks: [],
};

function StaffInfo({ citizenid }: Props) {
  const { setIsOpen } = useContext(AppContext);
  const [staff, setStaff] = useState<Staff>(initStaff);

  useEffect(() => {
    if (!isEnvBrowser()) {
      fetchNui<Staff>("GetStaffMember", citizenid).then((data) => {
        setStaff(data);
      });
    } else {
      setStaff(initStaff);
    }
  }, [citizenid]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = event.target;
    setStaff((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const removeCert = (i: number) => {
    const updatedItems = [
      ...staff.certs.slice(0, i),
      ...staff.certs.slice(i + 1),
    ];
    setStaff((prev) => ({
      ...prev,
      certs: updatedItems,
    }));
  };

  const addCert = (value: string) => {
    setStaff((prev) => ({
      ...prev,
      certs: prev.certs ? [...prev.certs, value] : [value],
    }));
  };

  const removeDept = (i: number) => {
    const updatedItems = [
      ...staff.departments.slice(0, i),
      ...staff.departments.slice(i + 1),
    ];
    setStaff((prev) => ({
      ...prev,
      departments: updatedItems,
    }));
  };

  const addDept = (value: string) => {
    setStaff((prev) => ({
      ...prev,
      departments: prev.departments ? [...prev.departments, value] : [value],
    }));
  };

  const removeRank = (i: number) => {
    const updatedItems = [
      ...staff.departments.slice(0, i),
      ...staff.departments.slice(i + 1),
    ];
    setStaff((prev) => ({
      ...prev,
      departments: updatedItems,
    }));
  };

  const addRank = (value: string) => {
    setStaff((prev) => ({
      ...prev,
      ranks: prev.ranks ? [...prev.ranks, value] : [value],
    }));
  };

  const SaveStaff = () => {
    if (!isEnvBrowser()) {
      const staffStringified = {
        ...staff,
        certs: JSON.stringify(staff.certs),
        departments: JSON.stringify(staff.departments),
        ranks: JSON.stringify(staff.ranks),
      };
      fetchNui("SaveStaff", staffStringified).then((data) => {
        if (data === true) {
          toast({
            title: "Saved!",
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

  return (
    <>
      <CertsModal onClick={addCert} />
      <DepartmentsModal onClick={addDept} />
      <RankModal onClick={addRank} />
      <div className="h-full gap-3 grid grid-cols-3 overflow-visible">
        <div className="col-span-2 flex flex-col gap-3">
          <header className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
            <h3>
              {staff?.firstname} {staff?.lastname} (#{staff?.citizenid})
            </h3>
            <IconButton
              variant="solid"
              icon={faFloppyDisk}
              onClick={SaveStaff}
            />
          </header>

          <div className="h-full flex flex-col gap-2 bg-zinc-500/20 p-2">
            <div className="h-full flex gap-5">
              <div className="h-[208px] w-[208px] aspect-square bg-zinc-500/40">
                <img src={staff.pfp} alt="mugshot" className="w-full h-full" />
              </div>
              <div className="flex flex-col gap-3 w-full">
                <div className="flex justify-between items-center">
                  <label htmlFor="citizenid" className="text-sm">
                    State ID
                  </label>
                  <input
                    id="citizenid"
                    value={staff.citizenid}
                    disabled
                    className="w-3/5 col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 border-none outline-none disabled:bg-zinc-500/20 disabled:text-white/50"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label htmlFor="user_type" className="text-sm">
                    User Type
                  </label>
                  <input
                    id="user_type"
                    name="user_type"
                    value={staff?.user_type}
                    onChange={handleInputChange}
                    className="w-3/5 col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 border-none outline-none"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label htmlFor="firstname" className="text-sm">
                    First Name
                  </label>
                  <input
                    id="firstname"
                    value={staff.firstname}
                    disabled
                    onChange={handleInputChange}
                    className="disabled:bg-zinc-500/20 disabled:text-white/50 w-3/5 col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 border-none outline-none"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label htmlFor="lastname" className="text-sm">
                    Last Name
                  </label>
                  <input
                    id="lastname"
                    value={staff.lastname}
                    disabled
                    onChange={handleInputChange}
                    className="disabled:bg-zinc-500/20 disabled:text-white/50 w-3/5 col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 border-none outline-none"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label htmlFor="callsign" className="text-sm">
                    Callsign
                  </label>
                  <input
                    id="callsign"
                    value={staff.callsign}
                    disabled
                    onChange={handleInputChange}
                    className="disabled:bg-zinc-500/20 disabled:text-white/50 w-3/5 col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 border-none outline-none"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label htmlFor="alias" className="text-sm">
                    Alias
                  </label>
                  <input
                    id="alias"
                    name="alias"
                    value={staff?.alias}
                    onChange={handleInputChange}
                    className="w-3/5 col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 border-none outline-none"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label htmlFor="phone" className="text-sm">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    value={formatPhoneNumber(staff.phone)}
                    disabled
                    onChange={handleInputChange}
                    className="disabled:bg-zinc-500/20 disabled:text-white/50 w-3/5 col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 border-none outline-none"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label htmlFor="pfp" className="text-sm">
                    Profile Picture
                  </label>
                  <input
                    id="pfp"
                    name="pfp"
                    value={staff.pfp}
                    onChange={handleInputChange}
                    className="w-3/5 col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 border-none outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-3 overflow-y-auto">
          {/* Certs */}
          <section>
            <div className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
              <h3>Certs</h3>
              <IconButton
                icon={faPlus}
                variant="solid"
                onClick={() => {
                  setIsOpen(Dialogs.Certs);
                }}
              />
            </div>
            {staff.certs.length > 0 && (
              <div className="bg-zinc-500/10 flex flex-wrap gap-2 p-2">
                {staff.certs.map((c, i) => (
                  <Tag key={i} onClick={() => removeCert(i)}>
                    {certs.find((cert) => cert.value === c)?.name}
                  </Tag>
                ))}
              </div>
            )}
          </section>
          {/* Departments */}
          <section>
            <div className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
              <h3>Departments</h3>
              <IconButton
                icon={faPlus}
                variant="solid"
                onClick={() => {
                  setIsOpen(Dialogs.Departments);
                }}
              />
            </div>
            {staff.departments.length > 0 && (
              <div className="bg-zinc-500/10 flex flex-wrap gap-2 p-2">
                {staff.departments.map((d, i) => (
                  <Tag key={i} onClick={() => removeDept(i)}>
                    {departments.find((dept) => dept.value === d)?.name}
                  </Tag>
                ))}
              </div>
            )}
          </section>
          {/* Rank */}
          <section>
            <div className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
              <h3>Rank</h3>
              <IconButton
                icon={faPlus}
                variant="solid"
                onClick={() => {
                  setIsOpen(Dialogs.Rank);
                }}
              />
            </div>
            {staff.ranks.length > 0 && (
              <div className="bg-zinc-500/10 flex flex-wrap gap-2 p-2">
                {staff.ranks.map((r, i) => (
                  <Tag key={i} onClick={() => removeRank(i)}>
                    {ranks.find((rank) => rank.value === r)?.name}
                  </Tag>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default StaffInfo;
