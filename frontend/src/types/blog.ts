export interface CreateBlogData {
  title: string;
  description: string;
  imageUrl?: string;
  comment?: string;
  likeCount?: number;
}

export interface BlogUser {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface Blog {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  comment?: string;
  likeCount?: number;
  user?: BlogUser;
  createdAt?: string;
  updatedAt?: string;
}