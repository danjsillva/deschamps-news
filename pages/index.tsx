import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import dayjs from "dayjs";

import Sidebar from "../components/sidebar";
import Post from "../components/post";

import { IPost } from "../types/index";

interface IProps {
  date: string;
  posts: IPost[];
}

const HomePage: NextPage<IProps> = ({ date, posts }) => {
  return (
    <main className="flex justify-center gap-9 my-24">
      <Head>
        <title>Deschamps News - Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar date={date} />

      <section className="w-[36rem]">
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}

        {!posts.length && (
          <article className="border-t py-6 text-lg">
            <div>
              <p>
                <strong>As notícias de hoje chegam lá pelas 11.</strong> Veja a
                última newsletter{" "}
                <Link
                  // @ts-ignore
                  href={`/${dayjs().prevBusinessDay().format("YYYY-MM-DD")}`}
                >
                  aqui
                </Link>
                .
              </p>
            </div>
          </article>
        )}
      </section>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const date = dayjs().format("YYYY-MM-DD");

  const response = await fetch(`${process.env.API_BASE_URL}/posts/${date}`);
  const posts: IPost[] = await response.json();

  return {
    props: {
      date,
      posts,
    },
    revalidate: 60,
  };
};

export default HomePage;
