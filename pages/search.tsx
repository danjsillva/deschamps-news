import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import dayjs from "dayjs";

import { Post } from "../types/index";

const Search: NextPage = () => {
  const router = useRouter();

  return (
    <main>
      <section>
        <h1>{JSON.stringify(router.query)}</h1>
      </section>
    </main>
  );
};

export default Search;
