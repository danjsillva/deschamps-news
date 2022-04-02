import { useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { FiBookmark, FiHeart, FiShare } from "react-icons/fi";

interface Props {
  date: string;
  post: Post;
}

interface Post {
  id: number;
  html: string;
  text: string;
  categories: string[];
  entities: string[];
  keywords: string[];
  likes: number;
  date: string;
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

        <article
          dangerouslySetInnerHTML={{ __html: post.html }}
          className="post"
        />

        <div className="post-actions">
          <div onClick={handleClickLike} className="post-actions-group">
            <FiHeart size={24} style={{ marginRight: "8px" }} /> {post.likes}
          </div>
          <div>
            <FiShare size={24} style={{ marginRight: "16px" }} />
            <FiBookmark size={24} />
          </div>
        </div>

        {/*<div className="post-item-keywords">Tecnologia e programação</div>*/}

        {!Object.keys(post).length && (
          <p>
            <strong>Notícia não encontrada.</strong> Veja a newsletter de hoje{" "}
            <Link href={`/${dayjs().format("YYYY-MM-DD")}`}>aqui</Link>.
          </p>
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
