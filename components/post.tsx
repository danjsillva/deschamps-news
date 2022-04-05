import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import dayjs from "dayjs";
import { FiBookmark, FiHeart, FiShare } from "react-icons/fi";

import { IPost } from "../types/index";

interface IProps {
  post: IPost;
}

export default function Post(props: IProps) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const refreshData = () => router.replace(router.asPath);

  const handleClickLike = async () => {
    setLoading(true);

    const response = await fetch(
      `http://localhost:3000/api/posts/${dayjs(props.post.date).format(
        "YYYY-MM-DD"
      )}/${props.post.id}/likes`,
      {
        method: "POST",
      }
    );

    refreshData();

    setLoading(false);
  };

  return (
    <article key={props.post.id} className="post">
      <div dangerouslySetInnerHTML={{ __html: props.post.html }} />

      {props.post.entities.map((entity) => (
        <Link href={`/search?q=${entity}`} key={entity} passHref>
          <span className="post-keywords">{entity}</span>
        </Link>
      ))}

      {
        <div className="post-actions">
          <div onClick={handleClickLike} className="post-actions-group">
            <FiHeart size={24} style={{ marginRight: "8px" }} />{" "}
            {props.post.likes}
          </div>

          <span style={{ fontSize: "14px" }}>
            {dayjs(props.post.date).utc().format("DD [de] MMMM [de] YYYY")}
          </span>

          <div>
            <FiShare size={24} style={{ marginRight: "16px" }} />
            <FiBookmark size={24} />
          </div>
        </div>
      }
    </article>
  );
}
