import tags from "../../data/tags.json";
import { useState } from "react";
import BaseModal from "./BaseModal";
import { Dialogs } from "../../context/AppContext";
import Search from "../Search";
import { IncidentData } from "../../Pages/Incidents";
import { ProfileI } from "../../utils/contstants";
import Tag from "../Tag";

type Props = {
  onClick: (value: string) => void;
  incident?: IncidentData;
  profile?: ProfileI;
};

function TagsModal({ onClick, incident, profile }: Props) {
  const [search, setSearch] = useState<string>("");

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <BaseModal open={Dialogs.Tags} title="Tags">
      <>
        <div className="grid grid-cols-5 items-center gap-4">
          <label className="col-span-2 text-sm">Ranks</label>
          <Search
            setValue={setSearch}
            value={search}
            className="col-span-3 w-full"
          />
        </div>
        <div className="max-h-80 flex flex-wrap gap-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {filteredTags.map((tag) => (
            <>
              {incident ? (
                <>
                  {incident?.tags.some((t) => t === tag.value) ? null : (
                    <Tag
                      key={tag.value}
                      background={tag.background}
                      className="cursor-pointer"
                      addClick={() => onClick && onClick(tag.value as string)}>
                      {tag.name}
                    </Tag>
                  )}
                </>
              ) : (
                <>
                  {profile?.tags.some((t) => t === tag.value) ? null : (
                    <Tag
                      key={tag.value}
                      background={tag.background}
                      className="cursor-pointer"
                      addClick={() => onClick && onClick(tag.value as string)}>
                      {tag.name}
                    </Tag>
                  )}
                </>
              )}
            </>
          ))}
        </div>
      </>
    </BaseModal>
  );
}

export default TagsModal;
