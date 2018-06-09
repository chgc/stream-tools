import { LiveChatMessage } from './liveChatMessage';

export interface LiveChatMessageListResponse {
  kind: 'youtube#liveChatMessageListResponse';
  etag: string;
  nextPageToken: string;
  pollingIntervalMillis: number;
  offlineAt: Date;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: LiveChatMessage[];
}
