import { Category } from "./Category";

export type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: number;
  postCategories: { category: Category }[];
  thumbnailUrl: string;
};

export interface MicroCmsPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  categories: { id: string; name: string }[];
  thumbnail: { url: string; height: number; width: number };
}
