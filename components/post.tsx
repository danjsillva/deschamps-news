import { useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { FiHeart, FiShare } from "react-icons/fi";

import { IPost } from "../types/index";

interface IProps {
  post: IPost;
}

export default function Post(props: IProps) {
  const [loading, setLoading] = useState(false);

  const handleClickLike = async () => {
    setLoading(true);

    props.post.likes++;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${dayjs(props.post.date)
        .utc()
        .format("YYYY-MM-DD")}/${props.post.number}/likes`,
      {
        method: "POST",
      }
    );

    setLoading(false);
  };

  return (
    <article key={props.post.number} className="post">
      {(props.post.html.toLowerCase().includes("link patrocinado") ||
        props.post.html.toLowerCase().includes("link afiliado")) && (
        <span className="post-tag">Patrocinado</span>
      )}
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
            <FiShare
              onClick={() => {
                navigator.clipboard.writeText(
                  `${process.env.NEXT_PUBLIC_APP_BASE_URL}/${dayjs(
                    props.post.date
                  )
                    .utc()
                    .format("YYYY-MM-DD")}/${props.post.number}`
                );
                toast("Link copiado para a sua área de transferência!");
              }}
              size={24}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      }
    </article>
  );
}
