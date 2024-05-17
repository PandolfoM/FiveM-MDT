import ecrpLogo from "../assets/ecrp.svg";
import tags from "../data/tags.json";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import IconButton from "./IconButton";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import Button from "./Button";
import { ReportModalData } from "../Pages/Reports";
import { Criminal, IncidentData, IncidentModalData } from "../Pages/Incidents";
import Select, { OptionProps } from "./Select";
import { ProfileModalData } from "../Pages/Profiles";
import Report, { Citizen, EvidenceModalData, Officers } from "../Pages/Report";
import Search from "./Search";
import Tag from "./Tag";

type Props = {
  title: string;
  close?: boolean;
  logo?: boolean;
  data?: Officers[] | EvidenceModalData[] | Criminal[] | Citizen[];
  report?: Report | IncidentData;
  onClick?: (data: any) => void;
  type:
    | "report"
    | "incident"
    | "profile"
    | "evidence"
    | "officers"
    | "citizens"
    | "criminals"
    | "tags";
  onSubmit?: (data: any) => void;
};

const initialReport: ReportModalData = {
  title: "",
  category: "Category",
};

const initialIncident: IncidentModalData = {
  title: "",
};

const initialProfile: ProfileModalData = {
  cid: "",
  name: "",
  pfp: "",
};

const initialCriminal: Criminal = {
  citizenid: 0,
  firstname: "",
  lastname: "",
  pfp: "",
};

const initialEvidence: EvidenceModalData = {
  title: "",
  category: "",
  id: 0,
  identifier: "",
  photo: "",
  stateid: "",
  evidenceid: 0,
};

function Modal({
  title,
  close,
  logo,
  onSubmit,
  type,
  data,
  report,
  onClick,
}: Props) {
  const { open, setOpen } = useContext(AppContext);
  const [search, setSearch] = useState<string>("");
  const [formState, setFormState] = useState<
    | ReportModalData
    | IncidentModalData
    | ProfileModalData
    | EvidenceModalData
    | Criminal
  >(
    type === "report"
      ? initialReport
      : type === "incident"
      ? initialIncident
      : type === "evidence"
      ? initialEvidence
      : type === "criminals"
      ? initialCriminal
      : initialProfile
  );

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    setOpen(false);
    if (onSubmit) {
      onSubmit(formState);
    }
    setFormState(
      type === "report"
        ? initialReport
        : type === "incident"
        ? initialIncident
        : type === "evidence"
        ? initialEvidence
        : initialProfile
    );
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = event.target;
    setFormState((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleCategoryChange = (
    selectedOption: OptionProps | OptionProps[]
  ): void => {
    const newValue = Array.isArray(selectedOption)
      ? selectedOption.map((option) => option.value).join(", ")
      : selectedOption.value;

    setFormState((prevState) => ({
      ...prevState,
      category: newValue as ReportModalData["category"],
    }));
  };

  return (
    <dialog
      open={open}
      className={`fixed left-0 top-0 z-50 w-full h-full transition-all bg-transparent text-white`}>
      <div className="fixed flex flex-col gap-3 w-96 h-auto bg-ecrp-900 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-3 rounded-md max-h-[50rem] shadow-[0_0_15rem_0_rgba(187,154,247,0.8)]">
        <header className="flex items-center gap-5 relative h-14">
          {logo && <img src={ecrpLogo} width={30} />}
          <p className="whitespace-nowrap font-bold">{title}</p>
          {close && (
            <IconButton
              icon={faX}
              variant="close"
              onClick={() => setOpen(false)}
            />
          )}
        </header>
        {/* Report modal */}
        {type === "report" && (
          <>
            <form
              className="grid gap-4 text-white"
              action="submit"
              onSubmit={handleSubmit}>
              <div className="grid grid-cols-5 items-center gap-4">
                <label htmlFor="title" className="col-span-2 text-sm">
                  Title
                </label>
                <input
                  placeholder="Title"
                  id="title"
                  name="title"
                  type="text"
                  value={(formState as ReportModalData).title}
                  onChange={handleInputChange}
                  className="col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 w-full border-none outline-none"
                />
              </div>
              <div className="grid grid-cols-5 items-center gap-4 relative">
                <label htmlFor="category" className="col-span-2 text-sm">
                  Category
                </label>
                <div className="col-span-3">
                  <Select
                    placeholder="Category"
                    onChange={handleCategoryChange}
                    isSearchable
                    options={[
                      {
                        label: "Reports",
                        value: "Reports",
                      },
                      {
                        label: "BOLO",
                        value: "BOLO",
                      },
                      {
                        label: "PD Dossiers",
                        value: "PD Dossiers",
                      },
                      {
                        label: "Subpoenas",
                        value: "Subpoenas",
                      },
                      {
                        label: "Search Warrants",
                        value: "Search Warrants",
                      },
                      {
                        label: "DOJ Documents",
                        value: "DOJ Documents",
                      },
                    ]}
                  />
                </div>
              </div>
              <Button
                text="Create"
                variant="solid"
                type="submit"
                disabled={
                  (formState as ReportModalData).category === "Category" ||
                  !(formState as ReportModalData).title
                }
                className="text-center py-1"
              />
            </form>
          </>
        )}

        {/* Incident Modal */}
        {type === "incident" && (
          <>
            <form
              className="grid gap-4 text-white"
              action="submit"
              onSubmit={handleSubmit}>
              <div className="grid grid-cols-5 items-center gap-4">
                <label htmlFor="title" className="col-span-2 text-sm">
                  Title
                </label>
                <input
                  placeholder="Title"
                  id="title"
                  type="text"
                  name="title"
                  value={(formState as IncidentModalData).title}
                  onChange={handleInputChange}
                  className="col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 w-full border-none outline-none"
                />
              </div>
              <Button
                text="Create"
                variant="solid"
                type="submit"
                disabled={!(formState as IncidentModalData).title}
                className="text-center py-1"
              />
            </form>
          </>
        )}

        {/* Profile Modal */}
        {type === "profile" && (
          <>
            <form
              className="grid gap-4 text-white"
              action="submit"
              onSubmit={handleSubmit}>
              <div className="grid grid-cols-5 items-center gap-4">
                <label htmlFor="cid" className="col-span-2 text-sm">
                  ID
                </label>
                <input
                  placeholder="ID"
                  id="cid"
                  type="text"
                  name="cid"
                  onChange={handleInputChange}
                  className="col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 w-full border-none outline-none"
                />
              </div>
              <div className="grid grid-cols-5 items-center gap-4">
                <label htmlFor="name" className="col-span-2 text-sm">
                  Name
                </label>
                <input
                  placeholder="Name"
                  id="name"
                  type="text"
                  name="name"
                  onChange={handleInputChange}
                  className="col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 w-full border-none outline-none"
                />
              </div>
              <div className="grid grid-cols-5 items-center gap-4">
                <label htmlFor="name" className="col-span-2 text-sm">
                  Profile Picture URL
                </label>
                <input
                  placeholder="Profile Picture URL"
                  id="pfp"
                  type="text"
                  name="pfp"
                  onChange={handleInputChange}
                  className="col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 w-full border-none outline-none"
                />
              </div>
              <Button
                text="Create"
                variant="solid"
                className="text-center py-1"
                type="submit"
                disabled={
                  !(formState as ProfileModalData).cid ||
                  !(formState as ProfileModalData).name
                }
              />
            </form>
          </>
        )}

        {/* Evidence Modal */}
        {type === "evidence" && (
          <>
            <form
              className="grid gap-4 text-white"
              action="submit"
              onSubmit={handleSubmit}>
              <div className="grid grid-cols-5 items-center gap-4">
                <label htmlFor="title" className="col-span-2 text-sm">
                  Title
                </label>
                <input
                  placeholder="Title"
                  id="title"
                  type="text"
                  name="title"
                  onChange={handleInputChange}
                  className="col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 w-full border-none outline-none"
                />
              </div>
              <div className="grid grid-cols-5 items-center gap-4 relative">
                <label htmlFor="category" className="col-span-2 text-sm">
                  Category
                </label>
                <div className="col-span-3">
                  <Select
                    placeholder="Category"
                    onChange={handleCategoryChange}
                    isSearchable
                    options={[
                      {
                        label: "Other",
                        value: "other",
                      },
                      {
                        label: "Blood",
                        value: "blood",
                      },
                      {
                        label: "Casing",
                        value: "casing",
                      },
                      {
                        label: "Weapon",
                        value: "weapon",
                      },
                      {
                        label: "Projectile",
                        value: "projectile",
                      },
                      {
                        label: "Glass",
                        value: "glass",
                      },
                      {
                        label: "Vehicle Fragment",
                        value: "vehicle fragment",
                      },
                      {
                        label: "Photo",
                        value: "photo",
                      },
                    ]}
                  />
                </div>
              </div>
              {!(formState as EvidenceModalData).category && (
                <div className="grid grid-cols-5 items-center gap-4">
                  <label htmlFor="id" className="col-span-2 text-sm">
                    Identifier
                  </label>
                  <input
                    placeholder="Identifier"
                    id="id"
                    type="text"
                    name="id"
                    onChange={handleInputChange}
                    className="col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 w-full border-none outline-none"
                  />
                </div>
              )}
              {(formState as EvidenceModalData).category === "photo" && (
                <div className="grid grid-cols-5 items-center gap-4">
                  <label htmlFor="photo" className="col-span-2 text-sm">
                    Photo URL
                  </label>
                  <input
                    placeholder="Photo URL"
                    id="photo"
                    type="text"
                    name="photo"
                    onChange={handleInputChange}
                    className="col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 w-full border-none outline-none"
                  />
                </div>
              )}
              <div className="grid grid-cols-5 items-center gap-4">
                <label htmlFor="stateid" className="col-span-2 text-sm">
                  State ID
                </label>
                <input
                  placeholder="State ID"
                  id="stateid"
                  type="text"
                  name="stateid"
                  onChange={handleInputChange}
                  className="col-span-3 bg-zinc-500/40 text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 w-full border-none outline-none"
                />
              </div>
              <Button
                text="Create"
                variant="solid"
                type="submit"
                disabled={
                  !(formState as EvidenceModalData).category ||
                  !(formState as EvidenceModalData).title ||
                  ((formState as EvidenceModalData).category === "photo" &&
                    !(formState as EvidenceModalData).photo)
                }
                className="text-center py-1"
              />
            </form>
            <div className="overflow-y-auto custom-scrollbar">
              {data?.map((evidence, i) => (
                <div key={i}>
                  {report?.evidence.some(
                    (o) =>
                      o.evidenceid ===
                      (evidence as EvidenceModalData).evidenceid
                  ) ? null : (
                    <div
                      className={`flex justify-between items-center bg-zinc-500/10 p-2 mt-3`}>
                      <div className="flex items-center gap-3">
                        <p>
                          <span className="capitalize">
                            {(evidence as EvidenceModalData).category}:{" "}
                          </span>{" "}
                          {(evidence as EvidenceModalData).title}
                        </p>
                      </div>
                      {onClick && (
                        <IconButton
                          icon={faPlus}
                          variant="solid"
                          onClick={() => {
                            onClick(evidence as EvidenceModalData);
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Officer Modal */}
        {type === "officers" && (
          <>
            <div className="grid grid-cols-5 items-center gap-4">
              <label htmlFor="title" className="col-span-2 text-sm">
                Assign Officer
              </label>
              <Search
                setValue={setSearch}
                value={search}
                className="col-span-3 w-full"
              />
            </div>
            <div className="max-h-80 flex-col flex gap-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
              {data && (
                <>
                  {data.map((officer, i) => (
                    <div key={i}>
                      {report?.officers.some(
                        (o) => o.citizenid === (officer as Officers).citizenid
                      ) ? null : (
                        <div
                          className={`flex justify-between items-center bg-zinc-500/10 p-2 mt-3`}>
                          <div className="flex items-center gap-3">
                            <img
                              src={(officer as Officers).pfp}
                              alt="pfp"
                              className="aspect-square w-11"
                            />
                            <p>
                              {(officer as Officers).firstname}{" "}
                              {(officer as Officers).lastname} - #
                              {(officer as Officers).callsign}
                            </p>
                          </div>
                          {onClick && (
                            <IconButton
                              icon={faPlus}
                              variant="solid"
                              onClick={() => {
                                onClick(officer as Officers);
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </>
        )}

        {/* Citizens Modal */}
        {type === "citizens" && (
          <>
            <div className="grid grid-cols-5 items-center gap-4">
              <label htmlFor="title" className="col-span-2 text-sm">
                Assign Citizens
              </label>
              <Search
                setValue={setSearch}
                value={search}
                className="col-span-3 w-full"
              />
            </div>
            <div className="max-h-80 flex-col flex gap-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
              {data && (
                <>
                  {data.map((civ, i) => (
                    <div key={i}>
                      {(report as Report)?.citizens.some(
                        (o) => o.citizenid === (civ as Citizen).citizenid
                      ) ? null : (
                        <div
                          className={`flex justify-between items-center bg-zinc-500/10 p-2 mt-3`}>
                          <div className="flex items-center gap-3">
                            <img
                              src={(civ as Citizen).pfp}
                              alt="pfp"
                              className="aspect-square w-11"
                            />
                            <p>
                              {(civ as Citizen).firstname}{" "}
                              {(civ as Citizen).lastname}
                            </p>
                          </div>
                          {onClick && (
                            <IconButton
                              icon={faPlus}
                              variant="solid"
                              onClick={() => {
                                onClick(civ as Citizen);
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </>
        )}

        {/* Criminals Modal */}
        {type === "criminals" && (
          <>
            <div className="grid grid-cols-5 items-center gap-4">
              <label htmlFor="title" className="col-span-2 text-sm">
                Assign Criminals
              </label>
              <Search
                setValue={setSearch}
                value={search}
                className="col-span-3 w-full"
              />
            </div>
            <div className="max-h-80 flex-col flex gap-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
              {data && (
                <>
                  {data.map((crim, i) => (
                    <div key={i}>
                      {(report as IncidentData)?.criminals.some(
                        (o) => o.citizenid === (crim as Criminal).citizenid
                      ) ? null : (
                        <div
                          className={`flex justify-between items-center bg-zinc-500/10 p-2 mt-3`}>
                          <div className="flex items-center gap-3">
                            <img
                              src={(crim as Citizen).pfp}
                              alt="pfp"
                              className="aspect-square w-11"
                            />
                            <p>
                              {(crim as Criminal).firstname}{" "}
                              {(crim as Criminal).lastname}
                            </p>
                          </div>
                          {onClick && (
                            <IconButton
                              icon={faPlus}
                              variant="solid"
                              onClick={() => {
                                onClick(crim as Criminal);
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </>
        )}

        {type === "tags" && (
          <>
            <div className="grid grid-cols-5 items-center gap-4">
              <label className="col-span-2 text-sm">Tags</label>
              <Search
                setValue={setSearch}
                value={search}
                className="col-span-3 w-full"
              />
            </div>
            <div className="max-h-80 flex flex-wrap gap-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
              {tags.map((tag) => (
                <>
                  {(report as IncidentData)?.tags.some(
                    (t) => t === tag.value
                  ) ? null : (
                    <Tag
                      key={tag.value}
                      background={tag.background}
                      addClick={() => onClick && onClick(tag.value as string)}>
                      {tag.name}
                    </Tag>
                  )}
                </>
              ))}
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}

export default Modal;
