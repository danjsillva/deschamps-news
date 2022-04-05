import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import Post from "../components/post";

import { IPost } from "../types/index";

const SearchPage: NextPage = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = router.query.q as string;

    setSearch(query);
  }, [router.query.q]);

  useEffect(() => {
    if (search) {
      handleGetPosts(search);
    }
  }, [search]);

  const handleGetPosts = async (search: string) => {
    setLoading(true);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/search?q=${search}`
    );
    const { total, documents } = await response.json();

    setCount(total);
    setPosts(documents.map((document: any) => document.value));

    setLoading(false);
  };

  return (
    <main>
      <section className="search-bar">
        <section className="search-bar-container">
          <div className="input-group">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {loading ? (
              <span className="input-status">Buscando</span>
            ) : (
              <span className="input-status">{count} resultado(s)</span>
            )}
          </div>
        </section>
      </section>

      <section className="container" style={{ marginTop: "32px" }}>
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}

        {!posts.length && !loading && (
          <article className="post">
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

export default SearchPage;
