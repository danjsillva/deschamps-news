import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Calendar from "react-calendar";
import dayjs from "dayjs";

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

  const handleChangeDate = (value: Date | any) => {
    if (!(value instanceof Date)) {
      return;
    }

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
    <aside className="sticky top-0 flex flex-col items-end text-end w-[24rem] mt-16">
      <Link href="/" className="!no-underline">
        <h1 className="text-6xl font-bold text-black">Deschamps News</h1>
      </Link>

      {props.date && (
        <Fragment>
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
        </Fragment>
      )}

      {props.search && (
        <Fragment>
          <form onSubmit={handleSubmitSearch} className="mt-10">
            <div className="border rounded py-3 px-4">
              <input
                type="text"
                value={search}
                className="outline-none"
                onChange={(e) => setSearch(e.target.value)}
              />

              <span className="text-sm text-gray-400">{props.results} resultado(s)</span>
            </div>
          </form>
        </Fragment>
      )}
    </aside>
  );
}
