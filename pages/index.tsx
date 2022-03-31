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
  return <main></main>;
};

/* export const getStaticProps: GetStaticProps = async () => { */
/*   const response = await fetch(`${process.env.API_BASE_URL}/posts`); */
/*   const posts = await response.json(); */
/*   const date = posts[0].date; */

/*   return { */
/*     props: { */
/*       date, */
/*       posts, */
/*     }, */
/*     revalidate: 60 * 60, */
/*   }; */
/* }; */

export default Home;
