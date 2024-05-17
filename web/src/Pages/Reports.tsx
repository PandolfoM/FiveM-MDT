import { faFolderOpen, faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";
import Search from "../components/Search";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../components/Modal";
import { fetchNui } from "../utils/fetchNui";
import { AppContext } from "../context/AppContext";
import Report from "./Report";
import { formatDateAgo } from "../utils/functions";
import { isEnvBrowser } from "../utils/misc";

type ReportData = {
  title: string;
  category: string;
  reportid: number;
  author: string;
  time: number;
  description: string;
};

export interface ReportModalData {
  title: string;
  category:
    | "Category"
    | "Reports"
    | "BOLO"
    | "PD Dossiers"
    | "Subpoenas"
    | "Search Warrants"
    | "DOJ Documents";
}

function Reports() {
  const { tabs, setTabs, activeTab, setOpen } = useContext(AppContext);
  const [value, setValue] = useState<string>("");
  const [reports, setReports] = useState<Array<ReportData>>([]);

  const selectReport = (id: number) => {
    const newTabs = [...tabs];
    newTabs[activeTab] = {
      title: "Reports",
      content: <Report id={id} />,
    };
    setTabs(newTabs);
  };

  useEffect(() => {
    fetchNui("GetReports").then((data) => {
      setReports(data as ReportData[]);
    });
  }, []);

  const CreateReport = (data: ReportModalData) => {
    if (!isEnvBrowser()) {
      fetchNui<number>("CreateReport", {
        title: data.title,
        category: data.category,
      }).then((data) => {
        const newTabs = [...tabs];
        newTabs[activeTab] = {
          title: "Reports",
          content: <Report id={data} />,
        };
        setTabs(newTabs);
      });
    } else {
      const newTabs = [...tabs];
      newTabs[activeTab] = {
        title: "Reports",
        content: <Report />,
      };
      setTabs(newTabs);
    }
  };

  const Content = ({ report }: { report: ReportData }) => {
    return (
      <div
        className="flex gap-1 bg-zinc-500/20 p-1 overflow-hidden cursor-pointer"
        onClick={() => selectReport(report.reportid)}>
        <div className="bg-zinc-500/20 aspect-square h-12 flex items-center justify-center text-white/50">
          <FontAwesomeIcon icon={faFolderOpen} size="xl" />
        </div>
        <div className="flex flex-col justify-between gap-[2px] overflow-hidden">
          <p className="text-sm font-bold leading-3">
            {report.title}
            <span className="text-xs font-normal text-white/50 capitalize pl-1">
              {report.category}
            </span>
          </p>
          <div className="bg-zinc-50/20 flex items-center text-xs max-w-max">
            <p className=" bg-ecrp-500 w-fit px-1 leading-4 h-full py-[0.1rem]">
              ID: {report.reportid}
            </p>
            <p className="px-1 py-[0.1rem]">
              {report.author} - {formatDateAgo(report.time)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Modal title="Create Report" close logo type="report" onSubmit={CreateReport} />
      <div className="overflow-hidden h-full flex flex-col gap-3">
        <header className="bg-zinc-500/40 p-2 text-sm font-bold flex justify-between items-center h-9">
          <h3>Reports</h3>
          <div className="flex gap-1 max-h-50% whitespace-nowrap">
            <Button
              variant="solid"
              text="Create Report"
              icon={faPlus}
              onClick={() => setOpen(true)}
              className="w-max"
            />
            <Search value={value} setValue={setValue} />
          </div>
        </header>

        <div className="h-full overflow-y-auto flex flex-col gap-1 custom-scrollbar">
          {reports.map((report, i) => (
            <Content key={i} report={report} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Reports;
