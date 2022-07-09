import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import dayjs from "dayjs";

import Date from "../components/date";
import Post from "../components/post";

import { IPost } from "../types/index";

interface IProps {
  date: string;
  posts: IPost[];
}

const HomePage: NextPage<IProps> = ({ date, posts }) => {
  return (
    <main>
      <Head>
        <title>Deschamps News - Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="container">
        <Date date={date} />

        {posts.map((post) => (
          <Post key={post.number} post={post} />
        ))}

        {!posts.length && (
          <article className="post">
            <div>
              <p>
                <strong>As notícias de hoje chegam lá pelas 11.</strong> Veja a
                newsletter de ontem{" "}
                <Link
                  href={`/${dayjs().subtract(1, "day").format("YYYY-MM-DD")}`}
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
      posts: posts.sort((a, b) => a.number - b.number),
    },
    revalidate: 60,
  };
};

export default HomePage;
