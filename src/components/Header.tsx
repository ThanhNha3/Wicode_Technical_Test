import { useState } from "react";
import {
  ArrowDownTray,
  ArrowLeft,
  ArrowPath,
  ArrowUpDown,
  ChevronDown,
  EyeSlash,
  Funnel,
  PencilSquare,
  PlusCircle,
  Search,
  Setting,
  Share,
  Sparkles,
  Window,
} from "../icons";
import { ButtonAction } from "./ButtonAction";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "../features/rowsSlice";

export default function Header() {
  const data = JSON.parse(localStorage.getItem("bookmark") || "{}");
  const dispatch = useDispatch();
  const [tableName, setTableName] = useState<string>(data.name || "table name");
  const [showWarning, setShowWarning] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const onChangeTableName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTableName(value);

    if (value.trim() === "") {
      setShowWarning(true);
    } else {
      setShowWarning(false);
      const data = JSON.parse(localStorage.getItem("bookmark") || "{}");
      localStorage.setItem(
        "bookmark",
        JSON.stringify({ ...data, name: value })
      );
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between py-2 bg-white px-4">
        <div className="flex items-center gap-2">
          <ArrowLeft className="h-5 w-5 text-[var(--color-primary)] cursor-pointer" />
          <Window className="h-5 w-5 text-[var(--color-icon-hover)]" />
          <div className="flex flex-col gap-1 ml-2">
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={tableName}
                onChange={onChangeTableName}
                className={`font-bold border-b px-1 py-0.5 focus:outline-none ${
                  showWarning ? "border-yellow-500" : "border-gray-300"
                }`}
              />
              <PencilSquare className="h-4 w-4 text-gray-500" />
            </div>
            {showWarning && (
              <span className="text-yellow-700 bg-yellow-50 px-2 py-1 rounded text-sm">
                Vui lòng nhập tên sổ tính
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <ButtonAction title="Add row" icon={PlusCircle} isActive />
            <ButtonAction title="Filter" icon={Funnel} />
            <ButtonAction title="Sort" icon={ArrowUpDown} />
            <ButtonAction
              title="Search"
              icon={Search}
              isActive={showSearch}
              onClick={() => setShowSearch((prev) => !prev)}
            />
            {showSearch && (
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="border px-2 py-1 rounded focus:outline-none w-64"
              />
            )}
            <ButtonAction title="Fields" icon={EyeSlash} />
          </div>

          <div className="h-5 w-px bg-[var(--color-divider)]"></div>

          <div className="flex items-center gap-3">
            <ArrowPath className="h-5 w-5 text-[var(--color-primary)] cursor-pointer" />
            <ArrowDownTray className="h-5 w-5 text-[var(--color-primary)] cursor-pointer" />
            <Share className="h-5 w-5 text-[var(--color-primary)] cursor-pointer" />
            <Setting className="h-5 w-5 text-[var(--color-primary)] cursor-pointer" />
          </div>

          <ButtonAction title="Action" icon={ChevronDown} isActive />
          <ButtonAction
            title="Ask AI"
            icon={Sparkles}
            className="bg-gradient-to-r from-[#FFCB65] from-10% to-[#FF4B97] to-90% text-white"
          />
        </div>
      </div>
    </div>
  );
}
