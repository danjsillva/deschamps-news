import type { GetServerSideProps, NextPage } from "next";
import dayjs from "dayjs";

interface Props {
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

const Post: NextPage<Props> = ({ posts }) => {
  return (
    <div>
      <h1>{posts[0].text}</h1>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { date } = context.query;

  const response = await fetch(`${process.env.API_BASE_URL}/posts/${date}`);
  const posts = await response.json();

  return {
    props: {
      date,
      posts,
    },
  };
};

export default Post;
