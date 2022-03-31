import type { NextPage } from "next";

const Home: NextPage = ({ posts }) => {
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

export async function getStaticProps() {
  const response = await fetch("http://localhost:3000/api/get");
  const posts = await response.json();

  return {
    props: {
      posts,
    },
    revalidate: 60 * 60,
  };
}

export default Home;
