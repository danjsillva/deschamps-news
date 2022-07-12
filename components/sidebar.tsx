import { useRouter } from "next/router";
import Calendar from "react-calendar";
import dayjs from "dayjs";

import Date from "./date";

interface IProps {
  date: string;
}

export default function Sidebar(props: IProps) {
  const router = useRouter();

  const setDate = (value: Date) => {
    if (dayjs(value).isToday()) {
      return router.push("/");
    }

    return router.push(`/${dayjs(value).format("YYYY-MM-DD")}`);
  };

  return (
    <aside className="sidebar">
      <Date date={props.date} />

      <Calendar
        onChange={setDate}
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
    </aside>
  );
}
