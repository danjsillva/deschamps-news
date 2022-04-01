import type { GetServerSideProps, NextPage } from "next";
import dayjs from "dayjs";

interface Props {
  postsDate: string;
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

const Posts: NextPage<Props> = ({ postsDate, posts }) => {
  return (
    <main>
      <section>
        <div className="date-group">
          <span className="date-day">
            {dayjs(postsDate).utc().format("DD")}
          </span>
          <div className="date-month-year-group">
            <span className="date-month">
              {dayjs(postsDate).utc().format("MMMM")}
            </span>
            <span className="date-year">
              {dayjs(postsDate).utc().format("YYYY")}
            </span>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { date } = context.query;

  const response = await fetch(`${process.env.API_BASE_URL}/posts/${date}`);
  const posts = await response.json();
  const postsDate = posts[0].date;

  return {
    props: {
      postsDate,
      posts,
    },
  };
};

export default Posts;
