import type { AppProps } from "next/app";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import "../styles/index.css";

dayjs.locale("pt-br");

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
