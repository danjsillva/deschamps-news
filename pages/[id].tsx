import type { GetServerSideProps, NextPage } from "next";

interface Props {
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

const Post: NextPage<Props> = ({ post }) => {
  return (
    <div>
      <h1>{post.text}</h1>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch(
    "https://deschamps-news.vercel.app/api/posts/2020-12-24"
  );
  const post = await response.json();

  return {
    props: {
      post,
    },
    revalidate: 60 * 60,
  };
};

export default Post;
