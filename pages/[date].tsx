import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import dayjs from "dayjs";

import { Post } from "../types/index";

interface Props {
  date: string;
  posts: Post[];
}

const Posts: NextPage<Props> = ({ date, posts }) => {
  return (
    <main>
      <section>
        <div className="date-group">
          <span className="date-day">{dayjs(date).utc().format("DD")}</span>
          <div className="date-month-year-group">
            <span className="date-month">
              {dayjs(date).utc().format("MMMM")}
            </span>
            <span className="date-year">
              {dayjs(date).utc().format("YYYY")}
            </span>
          </div>
        </div>

        {posts.map((post) => (
          <article key={post.id} className="post">
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
          </article>
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
  const posts: Post[] = await response.json();

  return {
    props: {
      date,
      posts: posts.sort((a, b) => a.id - b.id),
    },
  };
};

export default Posts;
