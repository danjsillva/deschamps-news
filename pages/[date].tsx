import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

import Date from "../components/date";
import Post from "../components/post";

import { IPost } from "../types/index";

interface Props {
  date: string;
  posts: IPost[];
}

const PostsPage: NextPage<Props> = ({ date, posts }) => {
  return (
    <main>
      <section className="container">
        <Date date={date} />

        {posts.map((post) => (
          <Post key={post.id} post={post} />
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
      posts: posts.sort((a, b) => a.id - b.id),
    },
  };
};

export default PostsPage;
