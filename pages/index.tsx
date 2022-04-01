import type { GetStaticProps, NextPage } from "next";
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

const Home: NextPage<Props> = ({ postsDate, posts }) => {
  return <main></main>;
};

/* export const getStaticProps: GetStaticProps = async () => { */
/*   const date = dayjs().format("YYYY-MM-DD"); */

/*   const response = await fetch(`${process.env.API_BASE_URL}/posts/${date}`); */
/*   const posts = await response.json(); */
/*   const postsDate = posts[0].date; */

/*   return { */
/*     props: { */
/*       postsDate, */
/*       posts, */
/*     }, */
/*     revalidate: 60, */
/*   }; */
/* }; */

export default Home;
