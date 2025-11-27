import { useRef, useState, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useSelector } from "react-redux";
import type { RootState } from "../features/store";
import { Plus } from "../icons";
import Loading from "./Loading";
import { useDebounce } from "../hooks/useDebounce";

type User = {
  id?: number | string;
  name?: string;
  bio?: string;
  language?: string;
  version?: number;
  state?: string;
  created?: string | number;
};

export default function DataTable({
  isLoading,
}: {
  data: User[];
  isLoading: boolean;
}) {
  // ===== State =====
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rows, setRows] = useState<User[]>(() => {
    const bookmark = JSON.parse(localStorage.getItem("bookmark") || "{}");
    return bookmark.data || [];
  });
  const [newRow, setNewRow] = useState<User | null>(null);
  const [selected, setSelected] = useState<number[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const addingRow = useSelector((state: RootState) => state.rows.addingRow);
  const searchQuery = useSelector((state: RootState) => state.rows.searchQuery);
  const debouncedText = useDebounce(searchQuery, 500);
  const today = new Date().toISOString().split("T")[0];

  // ===== Columns & UI Helpers =====
  const columns = [
    { key: "id", title: "ID" },
    { key: "bio", title: "Bio" },
    { key: "name", title: "Name" },
    { key: "language", title: "Language" },
    { key: "version", title: "Version" },
    { key: "state", title: "State" },
    { key: "created", title: "Created Date" },
  ];

  const COLUMN_WIDTH = {
    ID: 150,
    BIO: 200,
    NAME: 180,
    LANGUAGE: 140,
    VERSION: 140,
    STATE: 140,
    CREATED: 170,
  };

  const versionColor = (v: number) => {
    if (v < 2) return "bg-blue-100 text-blue-500";
    if (v < 4) return "bg-red-100 text-red-500";
    if (v < 6) return "bg-yellow-100 text-yellow-500";
    return "";
  };

  const formatDate = (d?: string) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  const renderColGroup = () => (
    <colgroup>
      {columns.map((col) => {
        const w =
          COLUMN_WIDTH[col.key.toUpperCase() as keyof typeof COLUMN_WIDTH];
        return (
          <col key={col.key} style={{ width: `${w}px`, minWidth: `${w}px` }} />
        );
      })}
    </colgroup>
  );

  const validateRow = (row: User) => {
    const err: Record<string, string> = {};

    if (!row.id) err.id = "ID is required";
    if (!row.name) err.name = "Name is required";
    if (!row.bio) err.bio = "bio is required";
    if (row.version !== undefined && isNaN(Number(row.version)))
      err.version = "Version must be a number";
    if (row.created && isNaN(new Date(String(row.created)).getTime()))
      err.created = "Invalid date";

    return err;
  };

  // ===== Effects =====
  useEffect(() => {
    if (addingRow) handleAddRow();
  }, [addingRow]);

  // Filter/search rows with debounce
  useEffect(() => {
    const bookmark = JSON.parse(localStorage.getItem("bookmark") || "{}");
    const baseRows = Array.isArray(bookmark.data) ? bookmark.data : [];

    if (debouncedText) {
      const lower = debouncedText.toLowerCase();
      setRows(
        baseRows.filter((item: User) =>
          Object.values(item).some(
            (val) => val && val.toString().toLowerCase().includes(lower)
          )
        )
      );
    } else {
      setRows(baseRows);
    }
  }, [debouncedText]);

  // ===== Actions =====
  const handleAddRow = () => {
    setNewRow({
      id: "",
      bio: "",
      name: "",
      language: "",
      version: 0,
      state: "",
      created: today,
    });
  };

  const commitNewRow = () => {
    if (!newRow) return;

    const err = validateRow(newRow);
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }
    setErrors({});
    const bookmark = JSON.parse(localStorage.getItem("bookmark") || "{}");
    const updated = [...(bookmark.data || []), newRow];
    localStorage.setItem(
      "bookmark",
      JSON.stringify({ ...bookmark, data: updated })
    );

    setNewRow(null);
  };

  const onCellChange = (index: number, key: keyof User, value: any) => {
    console.log(index);
    console.log(key);
    console.log(value);
    console.log('-------')

    setRows((prev) => {
      const copy = [...prev];
      copy[index][key] = value;

      const err = validateRow(copy[index]);
      setErrors((prevErr) => ({
        ...prevErr,
        ...Object.fromEntries(
          Object.entries(err).map(([k, v]) => [`${index}.${k}`, v])
        ),
      }));

      const bookmark = JSON.parse(localStorage.getItem("bookmark") || "{}");
      bookmark.data = bookmark.data || [];
      bookmark.data[index] = { ...copy[index] };
      localStorage.setItem("bookmark", JSON.stringify(bookmark));

      return copy;
    });
  };

  const toggleSelectAll = () => {
    if (selected.length === rows.length) setSelected([]);
    else setSelected(rows.map((_, i) => i));
  };

  const toggleSelect = (index: number) => {
    if (selected.includes(index))
      setSelected(selected.filter((i) => i !== index));
    else setSelected([...selected, index]);
  };

  // ===== Virtualizer =====
  const virtualizer = useVirtualizer({
    count: rows.length + 1,
    estimateSize: () => 48,
    getScrollElement: () => scrollRef.current,
  });

  // ===== Render =====
  if (isLoading) return <Loading fullscreen />;

  return (
    <div className="container mx-auto">
      <table className="w-full text-sm border border-[var(--table-border)]">
        {renderColGroup()}
        <thead>
          <tr className="bg-gray-50 border-b border-[var(--table-border)] text-xs">
            {columns.map((col) => (
              <th
                key={col.key}
                className="border border-[var(--table-border)] p-3 text-left text-[var(--table-text-title)]"
              >
                {col.key === "id" ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={
                        selected.length === rows.length && rows.length > 0
                      }
                      onChange={toggleSelectAll}
                    />
                    {col.title}
                  </div>
                ) : (
                  col.title
                )}
              </th>
            ))}
          </tr>
        </thead>
      </table>

      <div ref={scrollRef} className="h-screen hide-scrollbar overflow-y-auto">
        <div
          className="relative"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualizer.getVirtualItems().map((item) => {
            const i = item.index;
            const isAddRow = i === rows.length;
            const row = rows[i];

            return (
              <div
                key={item.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${item.start}px)`,
                }}
              >
                <table
                  className="w-full text-sm table-fixed"
                  style={{ borderCollapse: "collapse", tableLayout: "fixed" }}
                >
                  {renderColGroup()}
                  <tbody>
                    {newRow && isAddRow && (
                      <tr className="bg-yellow-50">
                        {columns.map((col) => (
                          <td
                            key={col.key}
                            className="border border-[var(--table-border)] p-3"
                          >
                            {col.key === "version" ? (
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${versionColor(
                                  Number(newRow.version)
                                )}`}
                              >
                                {newRow.version}
                              </span>
                            ) : col.key === "created" ? (
                              <input
                                type="date"
                                className="w-full bg-transparent outline-none"
                                value={newRow.created}
                                onChange={(e) =>
                                  setNewRow({
                                    ...newRow,
                                    created: e.target.value,
                                  })
                                }
                                onKeyDown={(e) =>
                                  e.key === "Enter" && commitNewRow()
                                }
                              />
                            ) : (
                              <>
                                <input
                                  className={`w-full bg-transparent outline-none font-bold ${
                                    errors[col.key]
                                      ? "border border-red-500"
                                      : ""
                                  }`}
                                  value={newRow[col.key as keyof User] || ""}
                                  onChange={(e) =>
                                    setNewRow({
                                      ...newRow,
                                      [col.key]: e.target.value,
                                    })
                                  }
                                  onKeyDown={(e) =>
                                    e.key === "Enter" && commitNewRow()
                                  }
                                />
                                {errors[col.key] && (
                                  <div className="text-red-500 text-xs mt-1">
                                    {errors[col.key]}
                                  </div>
                                )}
                              </>
                            )}
                          </td>
                        ))}
                      </tr>
                    )}

                    {!isAddRow && (
                      <tr className="hover:bg-[var(--table-hover-bg)]">
                        {columns.map((col) => {
                          const value = row[col.key as keyof User];
                          return (
                            <td
                              key={col.key}
                              className="border border-[var(--table-border)] p-3"
                            >
                              {col.key === "id" ? (
                                <div
                                  className="flex items-center gap-3 cursor-pointer"
                                  onClick={() => toggleSelect(i)}
                                >
                                  {selected.includes(i) ? (
                                    <input
                                      type="checkbox"
                                      checked
                                      onChange={() => toggleSelect(i)}
                                    />
                                  ) : (
                                    <span className="text-gray-400 w-5 inline-block">
                                      {i + 1}
                                    </span>
                                  )}
                                  <input
                                    className="w-full bg-transparent font-bold outline-none"
                                    value={value}
                                    onChange={(e) =>
                                      onCellChange(i, "id", e.target.value)
                                    }
                                  />
                                </div>
                              ) : col.key === "version" ? (
                                <span
                                  className={`px-2 py-1 rounded text-xs font-semibold ${versionColor(
                                    Number(value)
                                  )}`}
                                >
                                  {value}
                                </span>
                              ) : col.key === "created" ? (
                                <input
                                  type="date"
                                  className="w-full bg-transparent outline-none"
                                  value={
                                    value ? formatDate(String(value)) : today
                                  }
                                  onChange={(e) =>
                                    onCellChange(i, "created", e.target.value)
                                  }
                                />
                              ) : (
                                <>
                                  <input
                                    className={`w-full bg-transparent outline-none ${
                                      errors[`${i}.${col.key}`]
                                        ? "border border-red-500"
                                        : ""
                                    }`}
                                    value={value || ""}
                                    onChange={(e) =>
                                      onCellChange(
                                        i,
                                        col.key as keyof User,
                                        e.target.value
                                      )
                                    }
                                  />
                                  {errors[`${i}.${col.key}`] && (
                                    <div className="text-red-500 text-xs mt-1">
                                      {errors[`${i}.${col.key}`]}
                                    </div>
                                  )}
                                </>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    )}

                    {isAddRow && !newRow && (
                      <tr
                        className="cursor-pointer hover:bg-[var(--table-hover-bg)]"
                        onClick={handleAddRow}
                      >
                        <td
                          className="border border-[var(--table-border)] p-3 flex items-center gap-2"
                          colSpan={columns.length}
                        >
                          <Plus className="w-5 h-5" /> Add row
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
