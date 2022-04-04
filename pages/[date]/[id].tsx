import { useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { FiBookmark, FiHeart, FiShare } from "react-icons/fi";

import { Post } from "../../types/index";

interface Props {
  date: string;
  post: Post;
}

const Post: NextPage<Props> = ({ date, post }) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const refreshData = () => router.replace(router.asPath);

  const handleClickLike = async () => {
    setLoading(true);

    const response = await fetch(
      `http://localhost:3000/api/posts/${date}/${post.id}/likes`,
      {
        method: "POST",
      }
    );

    refreshData();

    setLoading(false);
  };

  return (
    <main>
      <section>
        <Link href={`/${dayjs(post.date).utc().format("YYYY-MM-DD")}`} passHref>
          <div className="date-group">
            <span className="date-day">{dayjs(date).utc().format("DD")}</span>
            <div className="date-month-year-group">
              <span className="date-month">
                {dayjs(date).utc().format("MMMM")}
              </span>
              <span className="date-year">
                {dayjs(date).utc().format("YYYY")}
              </span>
            </div>
          </div>
        </Link>

        {!!Object.keys(post).length && (
          <article className="post">
            <div dangerouslySetInnerHTML={{ __html: post.html }} />

            {post.entities.map((entity) => (
              <span key={entity} className="post-keywords">
                {entity}
              </span>
            ))}

            <div className="post-actions">
              <div onClick={handleClickLike} className="post-actions-group">
                <FiHeart size={24} style={{ marginRight: "8px" }} />{" "}
                {post.likes}
              </div>
              <div>
                <FiShare size={24} style={{ marginRight: "16px" }} />
                <FiBookmark size={24} />
              </div>
            </div>
          </article>
        )}

        {!Object.keys(post).length && (
          <article className="post">
            <div>
              <p>
                <strong>Notícia não encontrada.</strong> Veja a newsletter de
                hoje <Link href={`/`}>aqui</Link>.
              </p>
            </div>
          </article>
        )}
      </section>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { date, id } = context.query;

  const response = await fetch(
    `${process.env.API_BASE_URL}/posts/${date}/${id}`
  );
  const post = await response.json();

  return {
    props: {
      date,
      post,
    },
  };
};

export default Post;
