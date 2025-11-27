import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "./App.css";
import EditableTable from "./components/EditableTable";
import Header from "./components/Header";
import userService from "./services/User";
import Loading from "./components/Loading";
import SystemError from "./components/SystemError";

type User = {
  id?: number | string;
  name?: string;
  bio?: string;
  language?: string;
  version?: number;
  state?: string;
  created?: string;
};

function App() {
  const { data, isLoading, isError } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(),
    select: (data) => data,
  });

  const [users, setUsers] = useState<User[]>(() => {
    const bookmark = JSON.parse(localStorage.getItem("bookmark") || "{}");
    return bookmark.data || [];
  });

  useEffect(() => {
    const bookmark = JSON.parse(localStorage.getItem("bookmark") || "{}");
    if (bookmark.data.length === 0 && data?.length) {
      setUsers(data);
      localStorage.setItem("bookmark", JSON.stringify({ ...bookmark, data }));
    }
  }, [data]);

  if (isLoading) return <Loading fullscreen />;

  if (true) return <SystemError />;

  return (
    <div>
      <Header />
      <EditableTable data={users} isLoading={isLoading} />
    </div>
  );
}

export default App;
