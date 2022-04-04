import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import dayjs from "dayjs";

import Date from "../../components/date";
import Post from "../../components/post";

import { IPost } from "../../types/index";

interface Props {
  date: string;
  post: IPost;
}

const PostPage: NextPage<Props> = ({ date, post }) => {
  return (
    <main>
      <section className="container">
        <Link href={`/${dayjs(post.date).utc().format("YYYY-MM-DD")}`} passHref>
          <Date date={date} />
        </Link>

        {!!Object.keys(post).length && <Post post={post} />}

        {!Object.keys(post).length && (
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
  const { date, id } = context.query;

  const response = await fetch(
    `${process.env.API_BASE_URL}/posts/${date}/${id}`
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
