import { Dispatch, SetStateAction, useState } from "react";
import { Criminal, IncidentData } from "../Pages/Incidents";
import IconButton from "./IconButton";
import { faFloppyDisk, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import Tag from "./Tag";
import DeleteButton from "./DeleteButton";
import { fetchNui } from "../utils/fetchNui";
import { toast } from "../../components/ui/use-toast";
import Slider from "./Slider";
import { Charges, GetChargesData, HistoryI } from "../utils/contstants";
import { addWeeks } from "date-fns";
import { isEnvBrowser } from "../utils/misc";

type Props = {
  crim: Criminal;
  incident: IncidentData;
  charges: Charges[];
  setCharges: Dispatch<SetStateAction<Charges[]>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setCid: Dispatch<SetStateAction<number>>;
  deleteCrim: (cid: number, incidentid: number) => void;
};

function PlayerCharges({
  crim,
  incident,
  charges,
  setOpen,
  setCid,
  deleteCrim,
  setCharges,
}: Props) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter((i) => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };

  const totalMonths = () => {
    const chargeList = charges.find(
      (playerCharge) => playerCharge.citizenid === crim.citizenid
    )?.charges;

    let time = 0;
    chargeList?.forEach((charge) => {
      time += parseInt(charge.time);
    });
    return time;
  };

  const totalFine = () => {
    const chargeList = charges.find(
      (playerCharge) => playerCharge.citizenid === crim.citizenid
    )?.charges;

    let fine = 0;
    chargeList?.forEach((charge) => {
      fine += parseInt(charge.fine);
    });

    const formattedFine = fine.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    return formattedFine;
  };

  const totalPoints = () => {
    const chargeList = charges.find(
      (playerCharge) => playerCharge.citizenid === crim.citizenid
    )?.charges;

    let points = 0;
    chargeList?.forEach((charge) => {
      points += parseInt(charge.points);
    });
    return points;
  };

  const handleToggle = (key: keyof Charges) => {
    setCharges((prevCharges) => {
      // Find the index of the charge in the array
      const index = prevCharges.findIndex(
        (charge) => charge.citizenid === crim.citizenid
      );

      // If the charge is found, update the specific property
      if (index !== -1) {
        // Create a copy of the charge object to avoid mutating state directly
        const updatedCharge = { ...prevCharges[index] };

        // Update the specified property
        // updatedCharge[key] = !updatedCharge[key];
        (updatedCharge as any)[key] = !(updatedCharge as any)[key];

        // Create a new array with the updated charge object
        const updatedCharges = [...prevCharges];
        updatedCharges[index] = updatedCharge;

        return updatedCharges;
      } else {
        console.error("Charge not found.");
        return prevCharges; // Return the original state if charge is not found
      }
    });
  };

  const saveCharges = () => {
    if (!isEnvBrowser()) {
      fetchNui<GetChargesData>("GetCharges", {
        incidentid: incident.incidentid,
        citizenid: crim.citizenid,
      }).then((data) => {
        const findInCharges = charges.find(
          (charge) => charge.citizenid === crim.citizenid
        );

        const foundInData = data.charges.find(
          (charge) => charge.citizenid === crim.citizenid
        );

        const crimIds = incident.criminals.map((crim) => crim.citizenid);

        if (findInCharges?.warrant === true) {
          const oneWeekLater = addWeeks(new Date(), 1);
          const unixTimestampMilliseconds = oneWeekLater.getTime();
          fetchNui("SetWarrant", {
            end_date: unixTimestampMilliseconds,
            citizenid: crim.citizenid,
            incidentid: incident.incidentid,
            exists: false,
          });
        } else {
          fetchNui("SetWarrant", {
            end_date: null,
            citizenid: crim.citizenid,
            incidentid: incident.incidentid,
            exists: true,
          });
        }

        if (foundInData) {
          const targetChargeIndex = data.charges.findIndex(
            (charge) => charge.citizenid === crim.citizenid
          );
          const foundCharge = findInCharges as Charges;
          data.charges[targetChargeIndex] = foundCharge;

          if (data.history && Array.isArray(data.history)) {
            const historyI = data.history.findIndex(
              (item) => item.id === incident.incidentid
            );
            const newHistoryItem: HistoryI = {
              id: incident.incidentid,
              charges: data.charges[targetChargeIndex].charges,
            };
            data.history[historyI] = newHistoryItem;
          }

          fetchNui("SaveCharges", {
            charges: JSON.stringify(data.charges),
            criminals: JSON.stringify(crimIds),
            incidentid: incident.incidentid,
            citizenid: crim.citizenid,
            history: JSON.stringify(data.history),
          }).then((data) => {
            if (data === true) {
              toast({
                title: "Saved!",
                variant: "success",
                duration: 1000,
              });
            }
          });
        } else {
          if (findInCharges) {
            const targetChargeIndex = charges.findIndex(
              (charge) => charge.citizenid === crim.citizenid
            );

            const newHistoryItem: HistoryI = {
              id: incident.incidentid,
              charges: charges[targetChargeIndex].charges,
            };
            
            data.history.push(newHistoryItem);
            data.charges.push(findInCharges);
            fetchNui("SaveCharges", {
              charges: JSON.stringify(data.charges),
              criminals: JSON.stringify(crimIds),
              incidentid: incident.incidentid,
              citizenid: crim.citizenid,
              history: JSON.stringify(data.history),
            }).then((data) => {
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
              title: "Error!",
              variant: "destructive",
              duration: 1000,
            });
          }
        }
      });
    } else {
      toast({
        title: "Saved!",
        variant: "success",
        duration: 1000,
      });
    }
  };

  return (
    <>
      <div>
        <div
          className="bg-zinc-500/30 px-2 h-9 font-bold items-center flex justify-between cursor-pointer"
          onClick={() => toggleAccordion(crim.citizenid)}>
          <div className="overflow-hidden">
            <h4 className="text-sm text-red-400/60 leading-4 pointer-events-none select-none whitespace-nowrap">
              {crim.name} (#{crim.citizenid})
            </h4>
            <p className="text-xs font-light leading-4 pointer-events-none select-none whitespace-nowrap">
              {
                charges.find(
                  (playerCharge) => playerCharge.citizenid === crim.citizenid
                )?.charges.length
              }{" "}
              charges
            </p>
          </div>
          <div className="flex items-center gap-1">
            <DeleteButton
              text={`${crim.name}`}
              onClick={(e) => {
                e && e.stopPropagation();
                deleteCrim(crim.citizenid, incident.incidentid);
              }}
            />
            <IconButton
              icon={faLocationDot}
              variant="solid"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
                setCid(crim.citizenid);
              }}
            />
            <IconButton
              icon={faFloppyDisk}
              variant="solid"
              onClick={(e) => {
                e.stopPropagation();
                saveCharges();
              }}
            />
          </div>
        </div>

        {/* Accordion content */}
        {openIndexes.includes(crim.citizenid) && (
          <>
            <div className="bg-zinc-500/10 p-2 flex flex-wrap gap-1 whitespace-nowrap overflow-x-auto custom-scrollbar">
              {charges
                .find(
                  (playerCharge) => playerCharge.citizenid === crim.citizenid
                )
                ?.charges.map((charge, i) => (
                  <Tag key={i}>{charge.title}</Tag>
                ))}

              {charges.find(
                (playerCharge) => playerCharge.citizenid === crim.citizenid
              )?.charges.length === 0 && (
                <Button
                  text="Add Charges"
                  variant="solid"
                  className="w-max m-auto"
                  onClick={() => {
                    setOpen(true);
                    setCid(crim.citizenid);
                  }}
                />
              )}
            </div>
            {charges.find(
              (playerCharge) => playerCharge.citizenid === crim.citizenid
            )?.charges.length !== 0 && (
              <>
                <div className="bg-zinc-500/30 px-2 h-9 font-bold items-center flex justify-between text-xs pointer-events-none select-none whitespace-nowrap">
                  <h4>Total</h4>
                  <h4>
                    {totalMonths()} Months | {totalFine()} Fine |{" "}
                    {totalPoints()} Points
                  </h4>
                </div>
                <div className="bg-zinc-500/10 p-2 flex flex-col gap-3 font-bold select-none">
                  <div>
                    <Slider
                      label="Warrant for arrest"
                      checked={
                        charges.find(
                          (playerCharge) =>
                            playerCharge.citizenid === crim.citizenid
                        )?.warrant || false
                      }
                      onChange={() => handleToggle("warrant")}
                    />
                  </div>
                  <div>
                    <Slider
                      label="Processed"
                      checked={
                        charges.find(
                          (playerCharge) =>
                            playerCharge.citizenid === crim.citizenid
                        )?.processed || false
                      }
                      onChange={() => handleToggle("processed")}
                    />
                  </div>
                  <div>
                    <Slider
                      label="Plead Guilty"
                      checked={
                        charges.find(
                          (playerCharge) =>
                            playerCharge.citizenid === crim.citizenid
                        )?.guilty || false
                      }
                      onChange={() => handleToggle("guilty")}
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default PlayerCharges;
