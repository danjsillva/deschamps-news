import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import dayjs from "dayjs";

interface Props {
  date: string;
  posts: Post[];
}

interface Post {
  id: number;
  html: string;
  text: string;
  categories: string[];
  entities: string[];
  keywords: string[];
  likes: number;
  date: string;
}

const Home: NextPage<Props> = ({ date, posts }) => {
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
          <Link
            key={post.id}
            href={`/${dayjs(post.date).utc().format("YYYY-MM-DD")}/${post.id}`}
            passHref
          >
            <article
              key={post.id}
              dangerouslySetInnerHTML={{ __html: post.html }}
              className="post-item"
            />
          </Link>
        ))}

        {!posts.length && (
          <p>
            <strong>As notícias de hoje chegam lá pelas 11.</strong> Veja a
            newsletter de ontem{" "}
            <Link href={`/${dayjs().subtract(1, "day").format("YYYY-MM-DD")}`}>
              aqui
            </Link>
            .
          </p>
        )}
      </section>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const date = dayjs().format("YYYY-MM-DD");

  const response = await fetch(`${process.env.API_BASE_URL}/posts/${date}`);
  const posts: Post[] = await response.json();

  return {
    props: {
      date,
      posts: posts.sort((a, b) => a.id - b.id),
    },
    revalidate: 60,
  };
};

export default Home;
