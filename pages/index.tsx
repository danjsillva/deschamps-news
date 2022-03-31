import type { GetStaticProps, NextPage } from "next";
import dayjs from "dayjs";

interface Props {
  date: string;
  posts: Post[];
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

const Home: NextPage<Props> = ({ date, posts }) => {
  return (
    <main>
      <section>
        <div className="date-group">
          <span className="date-day">{dayjs(date).format("DD")}</span>
          <div className="date-month-year-group">
            <span className="date-month">{dayjs(date).format("MMMM")}</span>
            <span className="date-year">{dayjs(date).format("YYYY")}</span>
          </div>
        </div>

        {posts.map((post) => (
          <article
            key={post.id}
            dangerouslySetInnerHTML={{ __html: post.html }}
            className="post-item"
          />
        ))}
      </section>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch("https://deschamps-news.vercel.app/api/get");
  const posts = await response.json();
  const date = posts[0].date;

  return {
    props: {
      date,
      posts,
    },
    revalidate: 60 * 60,
  };
};

export default Home;
