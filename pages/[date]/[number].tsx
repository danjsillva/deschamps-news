import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import dayjs from "dayjs";

import Sidebar from "../../components/sidebar";
import Post from "../../components/post";

import { IPost } from "../../types/index";

interface Props {
  date: string;
  post: IPost;
}

const PostPage: NextPage<Props> = ({ date, post }) => {
  return (
    <main>
      <Head>
        <title>Deschamps News - {post.text}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar date={date} />

      <section className="container">
        {!!Object.keys(post).length && <Post post={post} />}

        {!Object.keys(post).length && (
          <article className="post">
            <div>
              <p>
                <strong>Notícia não encontrada.</strong>
              </p>
            </div>
          </article>
        )}
      </section>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { date, number } = context.query;

  const response = await fetch(
    `${process.env.API_BASE_URL}/posts/${date}/${number}`
  );
  const post: IPost = await response.json();

  return {
    props: {
      date,
      post,
    },
  };
};

export default PostPage;
