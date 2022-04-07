import Link from "next/link";

interface IProps {}

export default function Breadcrumb(props: IProps) {
  return (
    <ul className="breadcrumb">
      <li className="breadcrumb-item">
        <Link href="/">Home</Link>
      </li>
      <li className="breadcrumb-item">
        <span>{"/"}</span>
      </li>
      <li className="breadcrumb-item">
        <Link href="/search">Histórico</Link>
      </li>
      <li className="breadcrumb-item">
        <span>{"/"}</span>
      </li>
      <li className="breadcrumb-item">
        <Link href="/search">Busca</Link>
      </li>
    </ul>
  );
}
