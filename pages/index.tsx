import { useEffect } from "react";
import type {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from "next";

const Home: NextPage = ({ data }) => {
  return (
    <div>
      <h1>Hello!</h1>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch("http://localhost:3000/api/get");
  const data = await response.json();

  return {
    props: {
      data,
    },
  };
};

export default Home;
