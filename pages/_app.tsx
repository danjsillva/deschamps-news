import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import isYesterday from "dayjs/plugin/isYesterday";
import weekday from "dayjs/plugin/weekday";
import dayjsBusinessDays from "dayjs-business-days";

import "dayjs/locale/pt-br";

import "react-toastify/dist/ReactToastify.css";
import "../styles/index.css";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.extend(isYesterday);
dayjs.extend(weekday);
dayjs.extend(dayjsBusinessDays);
dayjs.locale("pt-br");

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer position="bottom-left" hideProgressBar={true} />
    </>
  );
}

export default MyApp;
