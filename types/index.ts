export interface IPost {
  id: number;
  html: string;
  text: string;
  categories: string[];
  entities: string[];
  likes: number;
  date: string;
}
