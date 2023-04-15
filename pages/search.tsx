import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import Sidebar from "../components/sidebar";
import Post from "../components/post";

import { IPost } from "../types/index";

interface IProps {
  search: string;
  posts: IPost[];
}

const SearchPage: NextPage<IProps> = ({ search, posts }) => {
  return (
    <main className="flex justify-center gap-12 my-24">
      <Head>
        <title>Deschamps News - {search ?? "Busca"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar search={search} results={posts.length} />

      <section className="w-[48rem]">
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}

        {!posts.length && (
          <article className="border-t py-6 text-lg">
            <div>
              <p>
                <strong>Nenhuma notícia encontrada.</strong>
              </p>
            </div>
          </article>
        )}
      </section>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { q: search } = context.query;

  const response = await fetch(
    `${process.env.API_BASE_URL}/posts/search?q=${search}`
  );
  const posts: IPost[] = await response.json();

  return {
    props: {
      search,
      posts,
    },
  };
};

export default SearchPage;
