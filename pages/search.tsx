import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import Post from "../components/post";

import { IPost } from "../types/index";

const SearchPage: NextPage = () => {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    handleGetPosts(search);
  }, [search]);

  const handleGetPosts = async (search: string) => {
    const response = await fetch(
      `${process.env.API_BASE_URL}/posts/search?s=${search}`
    );
    const posts = await response.json();

    setPosts(posts);
  };

  return (
    <main>
      <section className="container">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}

        {!posts.length && (
          <article className="post">
            <div>
              <p>
                <strong>As notícias de hoje chegam lá pelas 11.</strong> Veja a
                newsletter de ontem.
              </p>
            </div>
          </article>
        )}
      </section>
    </main>
  );
};

export default SearchPage;
