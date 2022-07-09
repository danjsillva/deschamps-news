export interface IPost {
  _id?: string;
  number: number;
  html: string;
  text: string;
  categories: string[];
  entities: string[];
  likes: number;
  date: string;
}
