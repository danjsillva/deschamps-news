import type { GetServerSideProps, NextPage } from "next";
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

const PostsPage: NextPage<IProps> = ({ date, posts }) => {
  return (
    <main>
      <Head>
        <title>
          Deschamps News - {dayjs(date).utc().format("DD [de] MMM [de] YYYY")}
        </title>
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
                <strong>Notícia não encontrada.</strong> Veja a newsletter de
                hoje <Link href={`/`}>aqui</Link>.
              </p>
            </div>
          </article>
        )}
      </section>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { date } = context.query;

  const response = await fetch(`${process.env.API_BASE_URL}/posts/${date}`);
  const posts: IPost[] = await response.json();

  return {
    props: {
      date,
      posts: posts.sort((a, b) => a.number - b.number),
    },
  };
};

export default PostsPage;
