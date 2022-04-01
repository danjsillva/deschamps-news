import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import dayjs from "dayjs";

interface Props {
  date: string;
  post: Post;
}

interface Post {
  id: string;
  html: string;
  text: string;
  categories: string[];
  entities: string[];
  keywords: string[];
  likes: number;
  date: string;
}

const Post: NextPage<Props> = ({ date, post }) => {
  return (
    <main>
      <section>
        <Link href={`/${dayjs(post.date).utc().format("YYYY-MM-DD")}`} passHref>
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
        </Link>

        <article
          dangerouslySetInnerHTML={{ __html: post.html }}
          className="post-item"
        />

        {!Object.keys(post).length && (
          <p>
            <strong>Notícia não encontrada.</strong> Veja a newsletter de hoje{" "}
            <Link href={`/${dayjs().format("YYYY-MM-DD")}`}>aqui</Link>.
          </p>
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
  const post = await response.json();

  return {
    props: {
      date,
      post,
    },
  };
};

export default Post;
