import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Calendar from "react-calendar";
import dayjs from "dayjs";

import Date from "./date";

interface IProps {
  date?: string;
  search?: string;
  results?: number;
}

export default function Sidebar(props: IProps) {
  const [search, setSearch] = useState(props.search);
  const router = useRouter();

  useEffect(() => {
    setSearch(props.search);
  }, [props.search]);

  const handleChangeDate = (value: Date) => {
    if (dayjs(value).isToday()) {
      return router.push("/");
    }

    return router.push(`/${dayjs(value).format("YYYY-MM-DD")}`);
  };

  const handleSubmitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (search) {
      return router.push(`/search?q=${search}`);
    }

    return router.push("/");
  };

  return (
    <aside className="sidebar">
      {props.date && (
        <div>
          <Date date={props.date} />

          <Calendar
            onChange={handleChangeDate}
            value={dayjs(props.date).toDate()}
            locale="pt-BR"
            minDate={dayjs("2020-12-10").toDate()}
            maxDate={dayjs().toDate()}
            next2Label={null}
            prev2Label={null}
            tileDisabled={({ date }) =>
              dayjs(date).weekday() === 0 || dayjs(date).weekday() === 6
            }
          />
        </div>
      )}

      {props.search && (
        <div>
          <form onSubmit={handleSubmitSearch}>
            <div className="input-group">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <span className="input-status">{props.results} resultado(s)</span>
            </div>
          </form>
        </div>
      )}
    </aside>
  );
}
