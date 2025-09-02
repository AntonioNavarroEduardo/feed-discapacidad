import { Post } from './post';

export interface Feed {
  page: number;
  pageSize: number;
  total: number;
  posts: Post[];
}

export interface FeedConfig {
  refreshIntervalMs: number;
  maxAgeMs: number;
  defaultPageSize: number;
}
