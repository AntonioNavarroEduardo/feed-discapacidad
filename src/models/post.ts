export interface Post {
  uri: string;
  cid: string;
  author: string;
  text: string;
  createdAt: number;
  language?: string;
}

export interface PostMetadata {
  id: string;
  timestamp: number;
  source: string;
}
