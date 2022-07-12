import dayjs from "dayjs";

interface IProps {
  date: string;
}

export default function Date(props: IProps) {
  return (
    <section className="date-group">
      <div className="date-month-year">
        {dayjs(props.date).utc().format("MMMM YYYY")}
      </div>
      <div className="date-day">{dayjs(props.date).utc().format("DD")}</div>
    </section>
  );
}
