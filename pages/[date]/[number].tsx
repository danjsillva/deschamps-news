import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import Sidebar from "../../components/sidebar";
import Post from "../../components/post";

import { IPost } from "../../types/index";

interface IProps {
  date: string;
  post: IPost;
}

const PostPage: NextPage<IProps> = ({ date, post }) => {
  return (
    <main className="flex justify-center gap-9 my-24">
      <Head>
        <title>
          Deschamps News -{" "}
          {post?.text.substring(0, 64) ?? "Notícia não encontrada"}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar date={date} />

      <section className="w-[36rem]">
        {!!post && <Post post={post} />}

        {!post && (
          <article className="border-t py-6 text-lg">
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
