import type { GetStaticProps, NextPage } from "next";

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

const Home: NextPage<Props> = ({ posts }) => {
  return (
    <div>
      <h1>Hello!</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.text}</li>
        ))}
      </ul>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch("https://deschamps-news.vercel.app/api/get");
  const posts = await response.json();

  return {
    props: {
      posts,
    },
    revalidate: 60 * 60,
  };
};

export default Home;
