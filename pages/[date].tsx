import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import dayjs from "dayjs";

import Sidebar from "../components/sidebar";
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

      <Sidebar date={date} />

      <section className="container">
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}

        {!posts.length && (
          <article className="post">
            <div>
              <p>
                <strong>Nenhuma notícia encontrada.</strong>
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
      posts,
    },
  };
};

export default PostsPage;
