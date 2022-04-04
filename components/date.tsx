import dayjs from "dayjs";

interface IProps {
  date: string;
}

export default function Date(props: IProps) {
  return (
    <section className="date-group">
      <span className="date-day">{dayjs(props.date).utc().format("DD")}</span>
      <div className="date-month-year-group">
        <span className="date-month">
          {dayjs(props.date).utc().format("MMMM")}
        </span>
        <span className="date-year">
          {dayjs(props.date).utc().format("YYYY")}
        </span>
      </div>
    </section>
  );
}
