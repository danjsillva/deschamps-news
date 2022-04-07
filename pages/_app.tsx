import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import "dayjs/locale/pt-br";

import "react-toastify/dist/ReactToastify.css";
import "../styles/index.css";

dayjs.extend(utc);
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
